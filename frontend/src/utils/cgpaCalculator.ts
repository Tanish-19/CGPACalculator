import { Subject, CGPAResult } from '../types';

// Map grades to grade points
export const gradeMap: { [key: string]: number } = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};


// CGPA calculation formula
export const calculateCGPA = (subjects: Subject[]): CGPAResult => {
  const validSubjects = subjects.filter(s => s.name && s.grade && s.credits > 0);

  if (validSubjects.length === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      subjects: [],
      grade: 'N/A',
      overallPercentage: 0,
      totalMarksObtained: 0,
      totalMaxMarks: 0
    };
  }

  const totalCredits = validSubjects.reduce((sum, subject) => sum + subject.credits, 0);
  const totalGradePoints = validSubjects.reduce((sum, subject) => {
    const gradePoint = gradeMap[subject.grade] ?? 0;
    subject.gradePoints = gradePoint;
    return sum + (gradePoint * subject.credits);
  }, 0);

  // Optional: if you want to keep marks for stats
  const totalMarksObtained = validSubjects.reduce((sum, subject) => sum + (subject.marks ?? 0), 0);
  const totalMaxMarks = validSubjects.reduce((sum, subject) => sum + (subject.totalMarks ?? 0), 0);
  const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;

  return {
    cgpa: Math.round((totalGradePoints / totalCredits) * 100) / 100,
    totalCredits,
    totalGradePoints,
    subjects: validSubjects,
    grade: 'N/A', // Overall grade not needed anymore
    overallPercentage: Math.round(overallPercentage * 100) / 100,
    totalMarksObtained,
    totalMaxMarks
  };
};

// Sample data generator for manual grading
export const generateRandomSubjects = (): Subject[] => {
  const sampleSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English',
    'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems'
  ];

  const sampleGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P'];

  return sampleSubjects.slice(0, 6).map((name, index) => {
    const grade = sampleGrades[Math.floor(Math.random() * sampleGrades.length)];
    const gradePoints = gradeMap[grade];
    const credits = Math.floor(Math.random() * 3) + 3;

    return {
      id: `subject-${index}`,
      name,
      marks: 0,            // Optional now
      totalMarks: 0,       // Optional now
      credits,
      grade,
      gradePoints,
      percentage: 0        // Optional now
    };
  });
};
