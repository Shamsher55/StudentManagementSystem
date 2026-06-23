export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetableSlot {
  id: number;
  schoolId: number;
  day: WeekDay;
  startTime: string;
  endTime: string;
  courseName: string;
  teacherName: string;
  room: string;
}
