import { Trophy, Download, TrendingUp, BookOpen, Award, Target, Calculator, User } from 'lucide-react';
import { CGPAResult as CGPAResultType } from '../types';
import jsPDF from "jspdf";
import React, { useEffect } from 'react';

interface CGPAResultProps {
  result: CGPAResultType;
  studentName: string;
}

const saveToDatabase = async (name: string, cgpa: number) => {
  try {
    const response = await fetch('http://localhost:5000/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, cgpa }),
    });

    const result = await response.json();
    console.log(result); // Show success message or alert
  } catch (error) {
    console.error('Failed to save student:', error);
  }
};

export const CGPAResult: React.FC<CGPAResultProps> = ({ result, studentName }) => {

  const exportPDFText = (result: CGPAResultType) => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("CGPA Result", 105, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(`CGPA: ${result.cgpa}`, 20, 40);
    pdf.text(`Grade: ${result.grade}`, 20, 50);
    pdf.text(`Overall Percentage: ${result.overallPercentage}%`, 20, 60);
    pdf.text(`Total Credits: ${result.totalCredits}`, 20, 70);
    pdf.text(`Total Marks Obtained: ${result.totalMarksObtained}`, 20, 80);
    pdf.text(`Total Max Marks: ${result.totalMaxMarks}`, 20, 90);

    pdf.text("Subjects:", 20, 105);

    const startY = 115;
    const lineHeight = 10;

   pdf.setFont("helvetica", "bold");
    pdf.text("Name", 20, startY);
    pdf.text("Credits", 70, startY);
    pdf.text("Marks", 100, startY);
    pdf.text("Grade", 130, startY);
    pdf.text("Points", 160, startY);
    pdf.setFont("helvetica", "normal");

    result.subjects.forEach((subj, index) => {
      const y = startY + lineHeight * (index + 1);
      pdf.text(subj.name, 20, y);
      pdf.text(subj.credits.toString(), 70, y);
      pdf.text(`${subj.marks}/${subj.totalMarks}`, 100, y);
      pdf.text(subj.grade, 130, y);
      pdf.text(subj.gradePoints.toString(), 160, y);
    });

    pdf.save("cgpa_result_text.pdf");
  };

  const exportResults = () => {
    const data = {
      cgpa: result.cgpa,
      grade: result.grade,
      overallPercentage: result.overallPercentage,
      totalCredits: result.totalCredits,
      totalMarksObtained: result.totalMarksObtained,
      totalMaxMarks: result.totalMaxMarks,
      subjects: result.subjects,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cgpa-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (result.subjects.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">Add subjects to see your CGPA calculation</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (cgpa: number) => {
    if (cgpa >= 9) return 'from-green-400 to-emerald-500';
    if (cgpa >= 8) return 'from-blue-400 to-cyan-500';
    if (cgpa >= 7) return 'from-yellow-400 to-orange-500';
    if (cgpa >= 6) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  useEffect(() => {
  if (studentName && result.cgpa) {
    console.log("Saving to MongoDB:", studentName, result.cgpa);
    saveToDatabase(studentName, result.cgpa);
  }
}, [studentName, result.cgpa]);

   return (
    <div
      id="result-to-export"
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">CGPA Result</h2>
        </div>
        <button
          onClick={() => exportPDFText(result)}  // ✅ Correctly pass the result
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Download Result as PDF
        </button>
      </div>
       {studentName && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-400/20">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white/70 text-sm">Student Name</p>
              <p className="text-white text-lg font-semibold">{studentName}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* CGPA Card */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-6 border border-white/20 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${getGradeColor(result.cgpa)} flex items-center justify-center`}>
            <span className="text-2xl font-bold text-white">{result.cgpa}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">CGPA</h3>
          <p className="text-white/70">Cumulative Grade Point Average</p>
        </div>

        {/* Grade Card */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-6 border border-white/20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{result.grade}</h3>
          <p className="text-white/70">Overall Grade</p>
        </div>

        {/* Percentage Card */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-6 border border-white/20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{result.overallPercentage}%</h3>
          <p className="text-white/70">Overall Percentage</p>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-6 border border-white/20 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{result.totalCredits}</h3>
          <p className="text-white/70">Total Credits</p>
        </div>
      </div>

      {/* Marks Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-green-400" />
            <span className="text-white/70 text-sm">Marks Obtained</span>
          </div>
          <span className="text-2xl font-bold text-white">{result.totalMarksObtained}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white/70 text-sm">Total Marks</span>
          </div>
          <span className="text-2xl font-bold text-white">{result.totalMaxMarks}</span>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-white/70 text-sm">Grade Points</span>
          </div>
          <span className="text-2xl font-bold text-white">{result.totalGradePoints}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Performance</span>
          <span>{result.cgpa}/10</span>
        </div>
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getGradeColor(result.cgpa)} transition-all duration-1000 ease-out`}
            style={{ width: `${(result.cgpa / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white/90 mb-4">Subject Breakdown</h3>
        {result.subjects.map((subject, index) => (
          <div 
            key={subject.id} 
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-1">
              <h4 className="font-medium text-white">{subject.name}</h4>
              <p className="text-white/60 text-sm">{subject.credits} credits</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-white/60 text-xs">Marks</div>
                <span className="text-white font-medium">{subject.marks}/{subject.totalMarks}</span>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs">Percentage</div>
                <span className="text-white font-medium">{subject.percentage}%</span>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs">Grade</div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  subject.gradePoints >= 9 ? 'bg-green-500/20 text-green-300' :
                  subject.gradePoints >= 7 ? 'bg-blue-500/20 text-blue-300' :
                  subject.gradePoints >= 5 ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {subject.grade}
                </span>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs">Points</div>
                <span className="text-white font-medium">{subject.gradePoints}</span>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};