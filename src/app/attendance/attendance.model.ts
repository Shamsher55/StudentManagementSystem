export interface AttendanceRecord {
  id: number;
  schoolId: number;
  studentId: number;
  studentName: string;
  course: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}
