import { Injectable, inject } from '@angular/core';
import { Course } from './course.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private courses: Course[] = [
    // School 1 — Al-Faisal Academy
    { id:1, schoolId:1, title:'Angular Fundamentals',    instructor:'Ali Hassan',  duration:'30 hrs', level:'Beginner',     category:'Frontend', enrolled:120, status:'Active' },
    { id:2, schoolId:1, title:'React from Scratch',      instructor:'Sara Khan',   duration:'25 hrs', level:'Beginner',     category:'Frontend', enrolled:98,  status:'Active' },
    { id:3, schoolId:1, title:'Node.js REST APIs',       instructor:'John Doe',    duration:'20 hrs', level:'Intermediate', category:'Backend',  enrolled:75,  status:'Active' },
    { id:4, schoolId:1, title:'Python for Data Science', instructor:'Fatima Noor', duration:'40 hrs', level:'Intermediate', category:'Data',     enrolled:200, status:'Active' },
    { id:5, schoolId:1, title:'Advanced TypeScript',     instructor:'Omar Farooq', duration:'15 hrs', level:'Advanced',     category:'Frontend', enrolled:45,  status:'Inactive' },
    { id:6, schoolId:1, title:'SQL & Databases',         instructor:'Nadia Ahmed', duration:'18 hrs', level:'Beginner',     category:'Database', enrolled:88,  status:'Active' },
    // School 2 — Bright Future School
    { id:7, schoolId:2, title:'Calculus I',              instructor:'Nora Teacher', duration:'45 hrs', level:'Intermediate', category:'Math',     enrolled:60,  status:'Active' },
    { id:8, schoolId:2, title:'Physics Fundamentals',    instructor:'Saad Trainer', duration:'35 hrs', level:'Beginner',     category:'Science',  enrolled:55,  status:'Active' },
    { id:9, schoolId:2, title:'Algebra',                 instructor:'Nora Teacher', duration:'30 hrs', level:'Beginner',     category:'Math',     enrolled:70,  status:'Active' },
    // School 3 — National Institute
    { id:10, schoolId:3, title:'Organic Chemistry',      instructor:'Ali Trainer',  duration:'40 hrs', level:'Advanced',     category:'Science',  enrolled:40,  status:'Active' },
    { id:11, schoolId:3, title:'Biology I',              instructor:'Mona Hassan',  duration:'30 hrs', level:'Beginner',     category:'Science',  enrolled:50,  status:'Active' },
  ];
  private nextId = 12;

  getAll(): Course[] {
    const sid = this.sid;
    return sid === null ? [...this.courses] : this.courses.filter(c => c.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Course[] { return this.courses.filter(c => c.schoolId === schoolId); }
  getById(id: number): Course | undefined { return this.courses.find(c => c.id === id); }

  add(course: Omit<Course, 'id'>): Course {
    const newCourse = { ...course, schoolId: course.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.courses.push(newCourse);
    return newCourse;
  }

  update(id: number, updated: Omit<Course, 'id'>): boolean {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.courses[index] = { ...updated, id };
    return true;
  }

  delete(id: number): boolean {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.courses.splice(index, 1);
    return true;
  }
}
