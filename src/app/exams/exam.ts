import { Injectable, inject } from '@angular/core';
import { Exam, ExamResult } from './exam.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private exams: Exam[] = [
    // School 1 — Al-Faisal Academy
    { id:1, schoolId:1, title:'HTML & CSS Mid-term',       courseName:'HTML & CSS',        date:'2026-07-10', startTime:'09:00', duration:120, totalMarks:100, venue:'Hall A', status:'upcoming' },
    { id:2, schoolId:1, title:'Angular Framework Final',   courseName:'Angular Framework',  date:'2026-07-15', startTime:'10:00', duration:180, totalMarks:100, venue:'Hall B', status:'upcoming' },
    { id:3, schoolId:1, title:'TypeScript Assessment',     courseName:'TypeScript',         date:'2026-07-08', startTime:'08:00', duration:90,  totalMarks:50,  venue:'Lab A',  status:'upcoming' },
    { id:4, schoolId:1, title:'React Basics Mid-term',     courseName:'React Basics',       date:'2026-06-20', startTime:'09:00', duration:120, totalMarks:100, venue:'Hall A', status:'completed' },
    { id:5, schoolId:1, title:'Python Basics Quiz',        courseName:'Python Basics',      date:'2026-06-18', startTime:'11:00', duration:60,  totalMarks:50,  venue:'Room 2', status:'completed' },
    { id:6, schoolId:1, title:'Node.js Mid-term',          courseName:'Node.js Basics',     date:'2026-07-22', startTime:'10:00', duration:120, totalMarks:100, venue:'Hall B', status:'upcoming' },
    // School 2 — Bright Future School
    { id:7, schoolId:2, title:'Calculus Mid-term',         courseName:'Calculus',           date:'2026-07-12', startTime:'09:00', duration:120, totalMarks:100, venue:'Room 201', status:'upcoming' },
    { id:8, schoolId:2, title:'Physics I Final',           courseName:'Physics I',          date:'2026-07-18', startTime:'10:00', duration:180, totalMarks:100, venue:'Hall C',   status:'upcoming' },
  ];
  private results: ExamResult[] = [
    { id:1, examId:4, examTitle:'React Basics Mid-term',   studentId:1, studentName:'Ali Hassan',  marksObtained:88, totalMarks:100, grade:'B' },
    { id:2, examId:4, examTitle:'React Basics Mid-term',   studentId:2, studentName:'Sara Khan',   marksObtained:72, totalMarks:100, grade:'C' },
    { id:3, examId:4, examTitle:'React Basics Mid-term',   studentId:3, studentName:'John Doe',    marksObtained:95, totalMarks:100, grade:'A' },
    { id:4, examId:5, examTitle:'Python Basics Quiz',      studentId:4, studentName:'Fatima Noor', marksObtained:38, totalMarks:50,  grade:'C' },
    { id:5, examId:5, examTitle:'Python Basics Quiz',      studentId:5, studentName:'Omar Farooq', marksObtained:45, totalMarks:50,  grade:'A' },
  ];
  private nextExamId = 9;
  private nextResultId = 6;

  getAll(): Exam[] {
    const sid = this.sid;
    return sid === null ? [...this.exams] : this.exams.filter(e => e.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Exam[] { return this.exams.filter(e => e.schoolId === schoolId); }
  getById(id: number): Exam | undefined { return this.exams.find(e => e.id === id); }
  getByStatus(s: Exam['status']): Exam[] { return this.getAll().filter(e => e.status === s); }
  getResults(examId: number): ExamResult[] { return this.results.filter(r => r.examId === examId); }
  getAllResults(): ExamResult[] { return [...this.results]; }

  add(data: Omit<Exam, 'id'>): Exam {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextExamId++ };
    this.exams.push(entry);
    return entry;
  }

  update(id: number, data: Omit<Exam, 'id'>): boolean {
    const i = this.exams.findIndex(e => e.id === id);
    if (i === -1) return false;
    this.exams[i] = { ...data, id };
    return true;
  }

  delete(id: number): void { this.exams = this.exams.filter(e => e.id !== id); }

  addResult(data: Omit<ExamResult, 'id'>): ExamResult {
    const entry = { ...data, id: this.nextResultId++ };
    this.results.push(entry);
    return entry;
  }

  scoreToGrade(score: number, total: number): string {
    const pct = (score / total) * 100;
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  }

  getStats() {
    const all = this.getAll();
    return {
      total:     all.length,
      upcoming:  all.filter(e => e.status === 'upcoming').length,
      completed: all.filter(e => e.status === 'completed').length,
    };
  }
}
