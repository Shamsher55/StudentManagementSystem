import { Injectable, inject } from '@angular/core';
import { Admission } from './admission.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private admissions: Admission[] = [
    // School 1 — Al-Faisal Academy
    { id:1, schoolId:1, applicantName:'Zaid Malik',    email:'zaid@example.com',   phone:'0501234567', dateOfBirth:'2005-03-12', gender:'male',   address:'12 Main St, Riyadh',   program:'Computer Science', previousSchool:'Al-Faisal School',  appliedDate:'2026-06-01', status:'approved', notes:'Strong academic record' },
    { id:2, schoolId:1, applicantName:'Hana Yusuf',    email:'hana@example.com',   phone:'0557654321', dateOfBirth:'2005-07-22', gender:'female', address:'45 Palm Ave, Jeddah',  program:'Web Development',  previousSchool:'Bright Future HS',  appliedDate:'2026-06-03', status:'approved', notes:'' },
    { id:3, schoolId:1, applicantName:'Tariq Saeed',   email:'tariq@example.com',  phone:'0509876543', dateOfBirth:'2006-01-08', gender:'male',   address:'8 Rose Blvd, Dammam',  program:'Data Science',     previousSchool:'National Academy',  appliedDate:'2026-06-05', status:'pending',  notes:'' },
    { id:4, schoolId:1, applicantName:'Nadia Farouk',  email:'nadia@example.com',  phone:'0551122334', dateOfBirth:'2005-11-30', gender:'female', address:'77 Lake Rd, Riyadh',   program:'Computer Science', previousSchool:"Queen's Academy",   appliedDate:'2026-06-08', status:'pending',  notes:'' },
    { id:5, schoolId:1, applicantName:'Bilal Ahmed',   email:'bilal@example.com',  phone:'0503344556', dateOfBirth:'2006-04-15', gender:'male',   address:'3 Green St, Mecca',    program:'Web Development',  previousSchool:'Al-Noor Institute', appliedDate:'2026-06-10', status:'rejected', notes:'Incomplete documents' },
    { id:6, schoolId:1, applicantName:'Amira Hassan',  email:'amira@example.com',  phone:'0556677889', dateOfBirth:'2005-09-19', gender:'female', address:'21 Desert Dr, Taif',   program:'Data Science',     previousSchool:'Future Leaders HS', appliedDate:'2026-06-12', status:'pending',  notes:'' },
    { id:7, schoolId:1, applicantName:'Khalid Omar',   email:'khalid@example.com', phone:'0508899001', dateOfBirth:'2006-06-02', gender:'male',   address:'60 Valley Rd, Riyadh', program:'Computer Science', previousSchool:'Ibn Rushd School',  appliedDate:'2026-06-14', status:'pending',  notes:'' },
    // School 2 — Bright Future School
    { id:8, schoolId:2, applicantName:'Sara Nasser',   email:'sara2@example.com',  phone:'0551234567', dateOfBirth:'2005-05-10', gender:'female', address:'12 Corniche, Jeddah',  program:'Mathematics',      previousSchool:'Al-Falah School',   appliedDate:'2026-06-05', status:'approved', notes:'High marks in math' },
    { id:9, schoolId:2, applicantName:'Faisal Turki',  email:'faisal@example.com', phone:'0557891234', dateOfBirth:'2006-02-20', gender:'male',   address:'88 Coast Rd, Jeddah',  program:'Science',          previousSchool:'Al-Khawarizmi',     appliedDate:'2026-06-09', status:'pending',  notes:'' },
  ];
  private nextId = 10;

  getAll(): Admission[] {
    const sid = this.sid;
    return sid === null ? [...this.admissions] : this.admissions.filter(a => a.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Admission[] { return this.admissions.filter(a => a.schoolId === schoolId); }
  getById(id: number): Admission | undefined { return this.admissions.find(a => a.id === id); }
  getByStatus(status: Admission['status']): Admission[] { return this.getAll().filter(a => a.status === status); }

  add(data: Omit<Admission, 'id'>): Admission {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.admissions.push(entry);
    return entry;
  }

  update(id: number, data: Omit<Admission, 'id'>): boolean {
    const i = this.admissions.findIndex(a => a.id === id);
    if (i === -1) return false;
    this.admissions[i] = { ...data, id };
    return true;
  }

  updateStatus(id: number, status: Admission['status'], notes?: string): boolean {
    const entry = this.admissions.find(a => a.id === id);
    if (!entry) return false;
    entry.status = status;
    if (notes !== undefined) entry.notes = notes;
    return true;
  }

  delete(id: number): void {
    this.admissions = this.admissions.filter(a => a.id !== id);
  }

  getStats() {
    const all = this.getAll();
    return {
      total:    all.length,
      pending:  all.filter(a => a.status === 'pending').length,
      approved: all.filter(a => a.status === 'approved').length,
      rejected: all.filter(a => a.status === 'rejected').length,
    };
  }
}
