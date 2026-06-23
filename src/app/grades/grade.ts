import { Injectable, inject } from '@angular/core';
import { Grade } from './grade.model';
import { Auth } from '../login/auth';

const GPA_POINTS: Record<string, number> = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

@Injectable({ providedIn: 'root' })
export class GradeService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private grades: Grade[] = [
    // School 1 — Al-Faisal Academy
    { id:1,  schoolId:1, studentId:1, studentName:'Ali Hassan',  subject:'HTML & CSS',       score:92, letterGrade:'A', semester:'Fall 2026', date:'2026-06-10' },
    { id:2,  schoolId:1, studentId:1, studentName:'Ali Hassan',  subject:'TypeScript',        score:88, letterGrade:'B', semester:'Fall 2026', date:'2026-06-10' },
    { id:3,  schoolId:1, studentId:1, studentName:'Ali Hassan',  subject:'Angular Framework', score:95, letterGrade:'A', semester:'Fall 2026', date:'2026-06-10' },
    { id:4,  schoolId:1, studentId:2, studentName:'Sara Khan',   subject:'React Basics',      score:75, letterGrade:'C', semester:'Fall 2026', date:'2026-06-10' },
    { id:5,  schoolId:1, studentId:2, studentName:'Sara Khan',   subject:'React Hooks',       score:52, letterGrade:'F', semester:'Fall 2026', date:'2026-06-10' },
    { id:6,  schoolId:1, studentId:2, studentName:'Sara Khan',   subject:'State Management',  score:68, letterGrade:'D', semester:'Fall 2026', date:'2026-06-10' },
    { id:7,  schoolId:1, studentId:3, studentName:'John Doe',    subject:'Node.js Basics',    score:90, letterGrade:'A', semester:'Fall 2026', date:'2026-06-10' },
    { id:8,  schoolId:1, studentId:3, studentName:'John Doe',    subject:'Express.js',        score:85, letterGrade:'B', semester:'Fall 2026', date:'2026-06-10' },
    { id:9,  schoolId:1, studentId:4, studentName:'Fatima Noor', subject:'Python Basics',     score:70, letterGrade:'C', semester:'Fall 2026', date:'2026-06-10' },
    { id:10, schoolId:1, studentId:4, studentName:'Fatima Noor', subject:'Data Structures',   score:55, letterGrade:'F', semester:'Fall 2026', date:'2026-06-10' },
    { id:11, schoolId:1, studentId:5, studentName:'Omar Farooq', subject:'HTML & CSS',        score:82, letterGrade:'B', semester:'Fall 2026', date:'2026-06-10' },
    { id:12, schoolId:1, studentId:5, studentName:'Omar Farooq', subject:'Angular Framework', score:78, letterGrade:'C', semester:'Fall 2026', date:'2026-06-10' },
    // School 2 — Bright Future School
    { id:13, schoolId:2, studentId:6, studentName:'Ahmed Zaki',   subject:'Calculus',  score:91, letterGrade:'A', semester:'Fall 2026', date:'2026-06-10' },
    { id:14, schoolId:2, studentId:6, studentName:'Ahmed Zaki',   subject:'Physics I', score:85, letterGrade:'B', semester:'Fall 2026', date:'2026-06-10' },
    { id:15, schoolId:2, studentId:7, studentName:'Layla Saad',   subject:'Calculus',  score:73, letterGrade:'C', semester:'Fall 2026', date:'2026-06-10' },
    { id:16, schoolId:2, studentId:7, studentName:'Layla Saad',   subject:'Algebra',   score:80, letterGrade:'B', semester:'Fall 2026', date:'2026-06-10' },
  ];
  private nextId = 17;

  getAll(): Grade[] {
    const sid = this.sid;
    return sid === null ? [...this.grades] : this.grades.filter(g => g.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Grade[] { return this.grades.filter(g => g.schoolId === schoolId); }

  getByStudent(studentId: number): Grade[] {
    return this.getAll().filter(g => g.studentId === studentId);
  }

  getById(id: number): Grade | undefined {
    return this.grades.find(g => g.id === id);
  }

  add(grade: Omit<Grade, 'id'>): Grade {
    const newGrade = { ...grade, schoolId: grade.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.grades.push(newGrade);
    return newGrade;
  }

  update(id: number, updated: Omit<Grade, 'id'>): boolean {
    const i = this.grades.findIndex(g => g.id === id);
    if (i === -1) return false;
    this.grades[i] = { ...updated, id };
    return true;
  }

  delete(id: number): void {
    this.grades = this.grades.filter(g => g.id !== id);
  }

  getGPA(studentId: number): number {
    const studentGrades = this.getByStudent(studentId);
    if (!studentGrades.length) return 0;
    const total = studentGrades.reduce((sum, g) => sum + (GPA_POINTS[g.letterGrade] ?? 0), 0);
    return Math.round((total / studentGrades.length) * 100) / 100;
  }

  scoreToLetter(score: number): Grade['letterGrade'] {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getStudentsWithLowGrades(): { studentId: number; studentName: string; subject: string; score: number }[] {
    return this.getAll()
      .filter(g => g.score < 60)
      .map(g => ({ studentId: g.studentId, studentName: g.studentName, subject: g.subject, score: g.score }));
  }
}
