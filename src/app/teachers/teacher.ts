import { Injectable, inject } from '@angular/core';
import { Teacher } from './teacher.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private teachers: Teacher[] = [
    // School 1 — Al-Faisal Academy
    { id:1, schoolId:1, name:'John Teacher',  email:'john@sms.edu',   phone:'0501111111', subject:'Web Development',    qualification:'MSc Computer Science',    joiningDate:'2022-01-15', status:'active',   courses:['HTML & CSS','Angular Framework','Node.js Basics','Express.js'] },
    { id:2, schoolId:1, name:'Sara Trainer',  email:'sara@sms.edu',   phone:'0502222222', subject:'Frontend Frameworks', qualification:'BSc Software Engineering', joiningDate:'2023-03-01', status:'active',   courses:['React Basics','React Hooks','State Management','TypeScript'] },
    { id:3, schoolId:1, name:'Ali Mentor',    email:'ali@sms.edu',    phone:'0503333333', subject:'Backend & Data',      qualification:'MSc Data Science',         joiningDate:'2021-09-01', status:'active',   courses:['Python Basics','Data Structures'] },
    { id:4, schoolId:1, name:'Nora Advisor',  email:'nora@sms.edu',   phone:'0504444444', subject:'Networking',          qualification:'BSc Computer Networks',    joiningDate:'2024-01-10', status:'inactive', courses:[] },
    // School 2 — Bright Future School
    { id:5, schoolId:2, name:'Nora Teacher',  email:'nora@brightfuture.edu',  phone:'0551111111', subject:'Mathematics',         qualification:'BSc Mathematics',          joiningDate:'2023-08-01', status:'active',   courses:['Calculus','Algebra'] },
    { id:6, schoolId:2, name:'Saad Trainer',  email:'saad@brightfuture.edu',  phone:'0552222222', subject:'Physics',             qualification:'MSc Physics',               joiningDate:'2022-06-15', status:'active',   courses:['Physics I','Physics II'] },
    // School 3 — National Institute
    { id:7, schoolId:3, name:'Ali Trainer',   email:'ali@national.edu',       phone:'0561111111', subject:'Chemistry',           qualification:'MSc Chemistry',             joiningDate:'2023-01-10', status:'active',   courses:['Organic Chemistry','Lab Work'] },
    { id:8, schoolId:3, name:'Mona Hassan',   email:'mona@national.edu',      phone:'0562222222', subject:'Biology',             qualification:'BSc Biology',               joiningDate:'2024-02-01', status:'active',   courses:['Biology I','Biology II'] },
  ];
  private nextId = 9;

  getAll(): Teacher[] {
    const sid = this.sid;
    return sid === null ? [...this.teachers] : this.teachers.filter(t => t.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Teacher[] {
    return this.teachers.filter(t => t.schoolId === schoolId);
  }

  getById(id: number): Teacher | undefined { return this.teachers.find(t => t.id === id); }
  getActive(): Teacher[] { return this.getAll().filter(t => t.status === 'active'); }

  add(data: Omit<Teacher, 'id'>): Teacher {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.teachers.push(entry);
    return entry;
  }

  update(id: number, data: Omit<Teacher, 'id'>): boolean {
    const i = this.teachers.findIndex(t => t.id === id);
    if (i === -1) return false;
    this.teachers[i] = { ...data, id };
    return true;
  }

  delete(id: number): void { this.teachers = this.teachers.filter(t => t.id !== id); }

  getStats() {
    const all = this.getAll();
    return {
      total:    all.length,
      active:   all.filter(t => t.status === 'active').length,
      inactive: all.filter(t => t.status === 'inactive').length,
    };
  }
}
