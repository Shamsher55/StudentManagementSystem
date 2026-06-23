export interface Grade {
  id: number;
  schoolId: number;
  studentId: number;
  studentName: string;
  subject: string;
  score: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  semester: string;
  date: string;
}
