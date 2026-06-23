import { Injectable, inject } from '@angular/core';
import { Fee, FeeStatus } from './fee.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class FeeService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private fees: Fee[] = [
    // School 1 — Al-Faisal Academy
    { id:1,  schoolId:1, studentId:1, studentName:'Ali Hassan',  type:'tuition',   description:'Fall 2026 Tuition',     amount:5000, dueDate:'2026-07-01', paidDate:'2026-06-15', status:'paid',    receiptNo:'RCP-001' },
    { id:2,  schoolId:1, studentId:1, studentName:'Ali Hassan',  type:'exam',      description:'Mid-term Exam Fee',     amount:500,  dueDate:'2026-07-10', paidDate:'2026-06-18', status:'paid',    receiptNo:'RCP-002' },
    { id:3,  schoolId:1, studentId:2, studentName:'Sara Khan',   type:'tuition',   description:'Fall 2026 Tuition',     amount:5000, dueDate:'2026-07-01', status:'pending' },
    { id:4,  schoolId:1, studentId:2, studentName:'Sara Khan',   type:'library',   description:'Library Annual Fee',    amount:200,  dueDate:'2026-06-20', status:'overdue' },
    { id:5,  schoolId:1, studentId:3, studentName:'John Doe',    type:'tuition',   description:'Fall 2026 Tuition',     amount:5000, dueDate:'2026-07-01', paidDate:'2026-06-10', status:'paid',    receiptNo:'RCP-003' },
    { id:6,  schoolId:1, studentId:3, studentName:'John Doe',    type:'transport', description:'Bus Fee - Semester',    amount:800,  dueDate:'2026-07-01', status:'pending' },
    { id:7,  schoolId:1, studentId:4, studentName:'Fatima Noor', type:'tuition',   description:'Fall 2026 Tuition',     amount:5000, dueDate:'2026-07-01', status:'pending' },
    { id:8,  schoolId:1, studentId:4, studentName:'Fatima Noor', type:'activity',  description:'Sports & Activities',   amount:300,  dueDate:'2026-06-15', status:'overdue' },
    { id:9,  schoolId:1, studentId:5, studentName:'Omar Farooq', type:'tuition',   description:'Fall 2026 Tuition',     amount:5000, dueDate:'2026-07-01', paidDate:'2026-06-20', status:'paid',    receiptNo:'RCP-004' },
    { id:10, schoolId:1, studentId:5, studentName:'Omar Farooq', type:'exam',      description:'Mid-term Exam Fee',     amount:500,  dueDate:'2026-07-10', status:'pending' },
    // School 2 — Bright Future School
    { id:11, schoolId:2, studentId:6, studentName:'Ahmed Zaki',  type:'tuition',   description:'Fall 2026 Tuition',     amount:4500, dueDate:'2026-07-01', paidDate:'2026-06-12', status:'paid',    receiptNo:'RCP-101' },
    { id:12, schoolId:2, studentId:6, studentName:'Ahmed Zaki',  type:'exam',      description:'Mid-term Exam Fee',     amount:450,  dueDate:'2026-07-10', status:'pending' },
    { id:13, schoolId:2, studentId:7, studentName:'Layla Saad',  type:'tuition',   description:'Fall 2026 Tuition',     amount:4500, dueDate:'2026-07-01', status:'overdue' },
  ];
  private nextId = 14;

  getAll(): Fee[] {
    const sid = this.sid;
    return sid === null ? [...this.fees] : this.fees.filter(f => f.schoolId === sid);
  }

  getAllBySchool(schoolId: number): Fee[] { return this.fees.filter(f => f.schoolId === schoolId); }
  getById(id: number): Fee | undefined { return this.fees.find(f => f.id === id); }
  getByStudent(studentId: number): Fee[] { return this.getAll().filter(f => f.studentId === studentId); }
  getByStatus(status: FeeStatus): Fee[] { return this.getAll().filter(f => f.status === status); }

  add(data: Omit<Fee, 'id'>): Fee {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.fees.push(entry);
    return entry;
  }

  update(id: number, data: Omit<Fee, 'id'>): boolean {
    const i = this.fees.findIndex(f => f.id === id);
    if (i === -1) return false;
    this.fees[i] = { ...data, id };
    return true;
  }

  markPaid(id: number): boolean {
    const f = this.fees.find(x => x.id === id);
    if (!f) return false;
    f.status   = 'paid';
    f.paidDate = new Date().toISOString().slice(0, 10);
    f.receiptNo = 'RCP-' + String(id).padStart(3, '0');
    return true;
  }

  delete(id: number): void { this.fees = this.fees.filter(f => f.id !== id); }

  getStats() {
    const all = this.getAll();
    return {
      total:        all.reduce((s, f) => s + f.amount, 0),
      collected:    all.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0),
      pending:      all.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0),
      overdue:      all.filter(f => f.status === 'overdue').reduce((s, f) => s + f.amount, 0),
      paidCount:    all.filter(f => f.status === 'paid').length,
      pendingCount: all.filter(f => f.status === 'pending').length,
      overdueCount: all.filter(f => f.status === 'overdue').length,
    };
  }
}
