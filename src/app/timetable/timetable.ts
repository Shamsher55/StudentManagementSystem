import { Injectable, inject } from '@angular/core';
import { TimetableSlot, WeekDay } from './timetable.model';
import { Auth } from '../login/auth';

export const DAYS: WeekDay[] = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private slots: TimetableSlot[] = [
    // School 1 — Al-Faisal Academy
    { id:1,  schoolId:1, day:'Monday',    startTime:'08:00', endTime:'09:30', courseName:'HTML & CSS',        teacherName:'John Teacher', room:'Lab A' },
    { id:2,  schoolId:1, day:'Monday',    startTime:'10:00', endTime:'11:30', courseName:'Angular Framework',  teacherName:'John Teacher', room:'Lab B' },
    { id:3,  schoolId:1, day:'Monday',    startTime:'13:00', endTime:'14:30', courseName:'TypeScript',         teacherName:'Sara Trainer', room:'Room 3' },
    { id:4,  schoolId:1, day:'Tuesday',   startTime:'08:00', endTime:'09:30', courseName:'React Basics',       teacherName:'Sara Trainer', room:'Lab A' },
    { id:5,  schoolId:1, day:'Tuesday',   startTime:'10:00', endTime:'11:30', courseName:'Node.js Basics',     teacherName:'John Teacher', room:'Lab B' },
    { id:6,  schoolId:1, day:'Tuesday',   startTime:'13:00', endTime:'14:30', courseName:'Python Basics',      teacherName:'Ali Mentor',   room:'Room 2' },
    { id:7,  schoolId:1, day:'Wednesday', startTime:'08:00', endTime:'09:30', courseName:'Angular Framework',  teacherName:'John Teacher', room:'Lab B' },
    { id:8,  schoolId:1, day:'Wednesday', startTime:'10:00', endTime:'11:30', courseName:'Data Structures',    teacherName:'Ali Mentor',   room:'Room 1' },
    { id:9,  schoolId:1, day:'Thursday',  startTime:'08:00', endTime:'09:30', courseName:'React Hooks',        teacherName:'Sara Trainer', room:'Lab A' },
    { id:10, schoolId:1, day:'Thursday',  startTime:'10:00', endTime:'11:30', courseName:'Express.js',         teacherName:'John Teacher', room:'Lab B' },
    { id:11, schoolId:1, day:'Thursday',  startTime:'13:00', endTime:'14:30', courseName:'State Management',   teacherName:'Sara Trainer', room:'Room 3' },
    { id:12, schoolId:1, day:'Friday',    startTime:'08:00', endTime:'09:30', courseName:'HTML & CSS',         teacherName:'John Teacher', room:'Lab A' },
    { id:13, schoolId:1, day:'Friday',    startTime:'10:00', endTime:'11:30', courseName:'TypeScript',         teacherName:'Sara Trainer', room:'Room 3' },
    // School 2 — Bright Future School
    { id:14, schoolId:2, day:'Monday',    startTime:'08:00', endTime:'09:30', courseName:'Calculus',           teacherName:'Nora Teacher',  room:'Room 101' },
    { id:15, schoolId:2, day:'Monday',    startTime:'10:00', endTime:'11:30', courseName:'Physics I',          teacherName:'Saad Trainer',  room:'Lab 1' },
    { id:16, schoolId:2, day:'Tuesday',   startTime:'08:00', endTime:'09:30', courseName:'Algebra',            teacherName:'Nora Teacher',  room:'Room 101' },
    { id:17, schoolId:2, day:'Wednesday', startTime:'09:00', endTime:'10:30', courseName:'Physics II',         teacherName:'Saad Trainer',  room:'Lab 1' },
  ];
  private nextId = 18;

  getAll(): TimetableSlot[] {
    const sid = this.sid;
    return sid === null ? [...this.slots] : this.slots.filter(s => s.schoolId === sid);
  }

  getAllBySchool(schoolId: number): TimetableSlot[] { return this.slots.filter(s => s.schoolId === schoolId); }
  getById(id: number): TimetableSlot | undefined { return this.slots.find(s => s.id === id); }

  getByDay(day: WeekDay): TimetableSlot[] {
    return this.getAll().filter(s => s.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
  }

  add(data: Omit<TimetableSlot, 'id'>): TimetableSlot {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.slots.push(entry);
    return entry;
  }

  update(id: number, data: Omit<TimetableSlot, 'id'>): boolean {
    const i = this.slots.findIndex(s => s.id === id);
    if (i === -1) return false;
    this.slots[i] = { ...data, id };
    return true;
  }

  delete(id: number): void { this.slots = this.slots.filter(s => s.id !== id); }
}
