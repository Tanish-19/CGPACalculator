import React, { useState } from 'react';
import { Plus, X, BookOpen, Target, Award } from 'lucide-react';
import { Subject } from '../types';
import { gradeMap } from '../utils/cgpaCalculator';

interface SubjectFormProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ subjects, onSubjectsChange }) => {
  const [newSubject, setNewSubject] = useState({ 
    name: '', 
    marks: '', 
    totalMarks: '100', 
    credits: '',
    grade: ''
  });

  const addSubject = () => {
    if (newSubject.name && newSubject.marks && newSubject.totalMarks && newSubject.credits) {
      const marks = parseFloat(newSubject.marks);
      const totalMarks = parseFloat(newSubject.totalMarks);
      const credits = parseFloat(newSubject.credits);
      const percentage = (marks / totalMarks) * 100;
      const grade = newSubject.grade.toUpperCase();
      const gradePoints = gradeMap[grade] ?? 0;

      const subject: Subject = {
        id: `subject-${Date.now()}`,
        name: newSubject.name,
        marks,
        totalMarks,
        credits,
        grade,
        gradePoints,
        percentage: Math.round(percentage * 100) / 100
      };

      onSubjectsChange([...subjects, subject]);
      setNewSubject({ name: '', marks: '', totalMarks: '100', credits: '', grade: '' });
    }
  };

  const removeSubject = (id: string) => {
    onSubjectsChange(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: string, value: string) => {
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: field === 'name' ? value : parseFloat(value) || 0 };
        
        // Recalculate percentage and grade when marks or totalMarks change
        if (field === 'marks' || field === 'totalMarks') {
          const percentage = (updated.marks / updated.totalMarks) * 100;
          const grade = newSubject.grade;
          const gradePoints = gradeMap[grade] ?? 0;
          updated.percentage = Math.round(percentage * 100) / 100;
          updated.grade = grade;
          updated.gradePoints = gradePoints;
        }
        return updated;
      }
      return subject;
    });
    onSubjectsChange(updatedSubjects);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-purple-300" />
        <h2 className="text-2xl font-bold text-white">Subject Details</h2>
      </div>

      {/* Add New Subject Form */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="relative">
          <input
            type="text"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            placeholder="Subject Name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="relative">
          <input
            type="number"
            value={newSubject.marks}
            onChange={(e) => setNewSubject({ ...newSubject, marks: e.target.value })}
            placeholder="Marks Obtained"
            min="0"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="relative">
          <input
            type="number"
            value={newSubject.totalMarks}
            onChange={(e) => setNewSubject({ ...newSubject, totalMarks: e.target.value })}
            placeholder="Total Marks"
            min="1"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="relative">
          <input
            type="number"
            value={newSubject.credits}
            onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
            placeholder="Credits"
            min="1"
            max="10"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="relative">
          <select
            value={newSubject.grade}
            onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select Grade</option>
            <option value="O">O</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="P">P</option>
            <option value="F">F</option>
          </select>
        </div>

        <button
          onClick={addSubject}
          disabled={!newSubject.name || !newSubject.marks || !newSubject.totalMarks || !newSubject.credits}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Column Headers */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 px-4 py-2 mb-2 text-white/70 text-sm font-medium">
          <div>Subject Name</div>
          <div className="text-center">Marks</div>
          <div className="text-center">Total</div>
          <div className="text-center">Credits</div>
          <div className="text-center">Percentage</div>
          <div className="text-center">Grade</div>
          <div className="text-center">Points</div>
          <div className="text-center">Action</div>
        </div>
      )}
      {/* Subjects List */}
      {subjects.length > 0 && (
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div 
              key={subject.id} 
              className="grid grid-cols-1 md:grid-cols-8 gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <input
                type="text"
                value={subject.name}
                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <input
                type="number"
                value={subject.marks}
                onChange={(e) => updateSubject(subject.id, 'marks', e.target.value)}
                min="0"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <input
                type="number"
                value={subject.totalMarks}
                onChange={(e) => updateSubject(subject.id, 'totalMarks', e.target.value)}
                min="1"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <input
                type="number"
                value={subject.credits}
                onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
                min="1"
                max="10"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-blue-400" />
                  <span className="text-white/80 font-medium">{subject.percentage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                  subject.gradePoints >= 9 ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                  subject.gradePoints >= 7 ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                  subject.gradePoints >= 5 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                  'bg-red-500/20 text-red-300 border border-red-400/30'
                }`}>
                  <Award className="w-3 h-3" />
                  {subject.grade}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white/70 font-medium">{subject.gradePoints}</span>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => removeSubject(subject.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};