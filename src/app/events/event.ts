import { Injectable, inject } from '@angular/core';
import { SchoolEvent } from './event.model';
import { Auth } from '../login/auth';

@Injectable({ providedIn: 'root' })
export class EventService {
  private auth = inject(Auth);
  private get sid(): number | null { return this.auth.getSchoolId(); }

  private events: SchoolEvent[] = [
    // School 1 — Al-Faisal Academy
    { id:1,  schoolId:1, title:'Eid Al-Adha Holiday',      type:'holiday', date:'2026-06-06', endDate:'2026-06-10', description:'Public holiday for Eid Al-Adha' },
    { id:2,  schoolId:1, title:'React Mid-term Exam',       type:'exam',    date:'2026-06-20', description:'React Basics mid-term examination in Hall A' },
    { id:3,  schoolId:1, title:'Python Quiz',               type:'exam',    date:'2026-06-18', description:'Python Basics quiz in Room 2' },
    { id:4,  schoolId:1, title:'Sports Day',                type:'sports',  date:'2026-06-25', description:'Annual sports competition — all students participate' },
    { id:5,  schoolId:1, title:'Parent-Teacher Meeting',    type:'meeting', date:'2026-06-28', description:'Quarterly PTM — parents invited 9 AM to 12 PM' },
    { id:6,  schoolId:1, title:'HTML & CSS Mid-term Exam',  type:'exam',    date:'2026-07-10', description:'Mid-term exam in Hall A' },
    { id:7,  schoolId:1, title:'Angular Final Exam',        type:'exam',    date:'2026-07-15', description:'Final exam for Angular Framework in Hall B' },
    { id:8,  schoolId:1, title:'Summer Break Begins',       type:'holiday', date:'2026-07-20', endDate:'2026-08-31', description:'Summer vacation' },
    { id:9,  schoolId:1, title:'Science Fair',              type:'event',   date:'2026-07-05', description:'Annual science & technology exhibition' },
    { id:10, schoolId:1, title:'Staff Development Day',     type:'meeting', date:'2026-07-03', description:'Professional development workshop for all staff' },
    // School 2 — Bright Future School
    { id:11, schoolId:2, title:'Calculus Mid-term Exam',    type:'exam',    date:'2026-07-12', description:'Calculus mid-term in Room 201' },
    { id:12, schoolId:2, title:'Annual Day Celebration',    type:'event',   date:'2026-06-30', description:'Bright Future School annual celebration event' },
    { id:13, schoolId:2, title:'Physics Final Exam',        type:'exam',    date:'2026-07-18', description:'Physics I final exam in Hall C' },
  ];
  private nextId = 14;

  getAll(): SchoolEvent[] {
    const sid = this.sid;
    const list = sid === null ? [...this.events] : this.events.filter(e => e.schoolId === sid);
    return list.sort((a,b) => a.date.localeCompare(b.date));
  }

  getAllBySchool(schoolId: number): SchoolEvent[] { return this.events.filter(e => e.schoolId === schoolId); }
  getById(id: number): SchoolEvent | undefined { return this.events.find(e => e.id === id); }

  getByMonth(year: number, month: number): SchoolEvent[] {
    const prefix = `${year}-${String(month).padStart(2,'0')}`;
    return this.getAll().filter(e => e.date.startsWith(prefix));
  }

  getUpcoming(): SchoolEvent[] {
    const today = new Date().toISOString().slice(0,10);
    return this.getAll().filter(e => e.date >= today).slice(0,5);
  }

  add(data: Omit<SchoolEvent, 'id'>): SchoolEvent {
    const entry = { ...data, schoolId: data.schoolId ?? this.sid ?? 1, id: this.nextId++ };
    this.events.push(entry);
    return entry;
  }

  update(id: number, data: Omit<SchoolEvent, 'id'>): boolean {
    const i = this.events.findIndex(e => e.id === id);
    if (i === -1) return false;
    this.events[i] = { ...data, id };
    return true;
  }

  delete(id: number): void { this.events = this.events.filter(e => e.id !== id); }
}
