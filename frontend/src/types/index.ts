export interface Subject {
  id: string;
  name: string;
  marks: number;
  totalMarks: number;
  credits: number;
  grade: string;
  gradePoints: number;
  percentage: number;
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  subjects: Subject[];
  grade: string;
  overallPercentage: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
}

export interface UploadedImage {
  file: File;
  preview: string;
}