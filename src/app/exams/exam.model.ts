export type ExamStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Exam {
  id: number;
  schoolId: number;
  title: string;
  courseName: string;
  date: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  venue: string;
  status: ExamStatus;
}

export interface ExamResult {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
}
