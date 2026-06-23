import { Injectable, inject } from '@angular/core';
import { Student } from './student.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private students: Student[] = [
    // School 1 — Al-Faisal Academy
    { id:1, schoolId:1, name:'Ali Hassan',   email:'ali@example.com',    phone:'0501234567', course:'Angular',  grade:'A', status:'Active' },
    { id:2, schoolId:1, name:'Sara Khan',    email:'sara@example.com',   phone:'0507654321', course:'React',    grade:'B', status:'Active' },
    { id:3, schoolId:1, name:'John Doe',     email:'john@example.com',   phone:'0509876543', course:'Node.js',  grade:'A', status:'Inactive' },
    { id:4, schoolId:1, name:'Fatima Noor',  email:'fatima@example.com', phone:'0503456789', course:'Python',   grade:'C', status:'Active' },
    { id:5, schoolId:1, name:'Omar Farooq',  email:'omar@example.com',   phone:'0506789012', course:'Angular',  grade:'B', status:'Active' },
    // School 2 — Bright Future School
    { id:6,  schoolId:2, name:'Ahmed Zaki',   email:'ahmed@brightfuture.edu',  phone:'0551234567', course:'React',    grade:'A', status:'Active' },
    { id:7,  schoolId:2, name:'Layla Saad',   email:'layla@brightfuture.edu',  phone:'0557654321', course:'Angular',  grade:'B', status:'Active' },
    { id:8,  schoolId:2, name:'Khalid Nasser',email:'khalid@brightfuture.edu', phone:'0559876543', course:'Python',   grade:'A', status:'Active' },
    { id:9,  schoolId:2, name:'Reem Ali',     email:'reem@brightfuture.edu',   phone:'0553456789', course:'Node.js',  grade:'C', status:'Inactive' },
    // School 3 — National Institute
    { id:10, schoolId:3, name:'Yousuf Ibrahim',email:'yousuf@national.edu',    phone:'0561234567', course:'React',    grade:'B', status:'Active' },
    { id:11, schoolId:3, name:'Hind Mansour', email:'hind@national.edu',       phone:'0567654321', course:'Angular',  grade:'A', status:'Active' },
    { id:12, schoolId:3, name:'Ziad Turki',   email:'ziad@national.edu',       phone:'0569876543', course:'Python',   grade:'B', status:'Active' },
  ];
  private nextId = 13;

  getAll(): Student[] {
    const sid = this.sid;
    return sid === null ? [...this.students] : this.students.filter(s => s.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Student[] {
    return this.students.filter(s => s.schoolId === schoolId);
  }

  getById(id: number): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  add(student: Omit<Student, 'id'>): Student {
    const newStudent = { ...student, schoolId: student.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.students.push(newStudent);
    return newStudent;
  }

  update(id: number, updated: Omit<Student, 'id'>): boolean {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.students[index] = { ...updated, id };
    return true;
  }

  delete(id: number): boolean {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.students.splice(index, 1);
    return true;
  }
}
