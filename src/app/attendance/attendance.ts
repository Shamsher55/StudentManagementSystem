import { Injectable, inject } from '@angular/core';
import { AttendanceRecord } from './attendance.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private records: AttendanceRecord[] = [
    // School 1 — Al-Faisal Academy
    { id:1,  schoolId:1, studentId:1, studentName:'Ali Hassan',  course:'Angular', date:'2026-06-16', status:'Present' },
    { id:2,  schoolId:1, studentId:2, studentName:'Sara Khan',   course:'React',   date:'2026-06-16', status:'Absent'  },
    { id:3,  schoolId:1, studentId:3, studentName:'John Doe',    course:'Node.js', date:'2026-06-16', status:'Present' },
    { id:4,  schoolId:1, studentId:4, studentName:'Fatima Noor', course:'Python',  date:'2026-06-16', status:'Late'    },
    { id:5,  schoolId:1, studentId:5, studentName:'Omar Farooq', course:'Angular', date:'2026-06-16', status:'Present' },
    { id:6,  schoolId:1, studentId:1, studentName:'Ali Hassan',  course:'Angular', date:'2026-06-17', status:'Present' },
    { id:7,  schoolId:1, studentId:2, studentName:'Sara Khan',   course:'React',   date:'2026-06-17', status:'Present' },
    { id:8,  schoolId:1, studentId:3, studentName:'John Doe',    course:'Node.js', date:'2026-06-17', status:'Absent'  },
    { id:9,  schoolId:1, studentId:4, studentName:'Fatima Noor', course:'Python',  date:'2026-06-17', status:'Present' },
    { id:10, schoolId:1, studentId:5, studentName:'Omar Farooq', course:'Angular', date:'2026-06-17', status:'Late'    },
    { id:11, schoolId:1, studentId:1, studentName:'Ali Hassan',  course:'Angular', date:'2026-06-18', status:'Late'    },
    { id:12, schoolId:1, studentId:2, studentName:'Sara Khan',   course:'React',   date:'2026-06-18', status:'Present' },
    { id:13, schoolId:1, studentId:3, studentName:'John Doe',    course:'Node.js', date:'2026-06-18', status:'Present' },
    { id:14, schoolId:1, studentId:4, studentName:'Fatima Noor', course:'Python',  date:'2026-06-18', status:'Present' },
    { id:15, schoolId:1, studentId:5, studentName:'Omar Farooq', course:'Angular', date:'2026-06-18', status:'Present' },
    // School 2 — Bright Future School
    { id:16, schoolId:2, studentId:6, studentName:'Ahmed Zaki',  course:'Calculus', date:'2026-06-16', status:'Present' },
    { id:17, schoolId:2, studentId:7, studentName:'Layla Saad',  course:'Physics',  date:'2026-06-16', status:'Absent'  },
    { id:18, schoolId:2, studentId:8, studentName:'Khalid Nasser',course:'Calculus',date:'2026-06-16', status:'Present' },
  ];
  private nextId = 19;

  getAll(): AttendanceRecord[] {
    const sid = this.sid;
    return sid === null ? [...this.records] : this.records.filter(r => r.schoolId === sid);
  }

  getAllBySchool(schoolId: number): AttendanceRecord[] { return this.records.filter(r => r.schoolId === schoolId); }

  getByDate(date: string): AttendanceRecord[] {
    return this.getAll().filter(r => r.date === date);
  }

  getByStudent(studentId: number): AttendanceRecord[] {
    return this.getAll().filter(r => r.studentId === studentId);
  }

  getByCourse(course: string): AttendanceRecord[] {
    return this.getAll().filter(r => r.course === course);
  }

  getByDateAndCourse(date: string, course: string): AttendanceRecord[] {
    return this.getAll().filter(r => r.date === date && r.course === course);
  }

  isAlreadyMarked(studentId: number, date: string): boolean {
    return this.getAll().some(r => r.studentId === studentId && r.date === date);
  }

  add(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const newRecord = { ...record, schoolId: record.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.records.push(newRecord);
    return newRecord;
  }

  update(id: number, status: 'Present' | 'Absent' | 'Late'): void {
    const record = this.records.find(r => r.id === id);
    if (record) record.status = status;
  }

  delete(id: number): void {
    this.records = this.records.filter(r => r.id !== id);
  }

  getStats() {
    const all = this.getAll();
    const total   = all.length;
    const present = all.filter(r => r.status === 'Present').length;
    const absent  = all.filter(r => r.status === 'Absent').length;
    const late    = all.filter(r => r.status === 'Late').length;
    const rate    = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, rate };
  }

  getUniqueDates(): string[] {
    return [...new Set(this.getAll().map(r => r.date))].sort().reverse();
  }

  getUniqueCourses(): string[] {
    return [...new Set(this.getAll().map(r => r.course))].sort();
  }
}
