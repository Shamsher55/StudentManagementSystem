import { Injectable } from '@angular/core';
import { School } from './school.model';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private schools: School[] = [
    { id: 1, name: 'Al-Faisal Academy',      code: 'AFA', address: '12 King Fahd Rd',   city: 'Riyadh',  phone: '011-1234567', email: 'info@alfaisal.edu',     principalName: 'Dr. Ahmed Al-Faisal',  establishedYear: 2005, status: 'active' },
    { id: 2, name: 'Bright Future School',   code: 'BFS', address: '45 Corniche St',     city: 'Jeddah',  phone: '012-7654321', email: 'info@brightfuture.edu', principalName: 'Ms. Sara Al-Rashidi',  establishedYear: 2010, status: 'active' },
    { id: 3, name: 'National Institute',     code: 'NIN', address: '8 Gulf Ave',         city: 'Dammam',  phone: '013-9876543', email: 'info@national.edu',     principalName: 'Mr. Khalid Al-Otaibi', establishedYear: 2015, status: 'active' },
    { id: 4, name: 'Al-Noor Academy',        code: 'ANA', address: '22 Madinah Rd',      city: 'Mecca',   phone: '025-1122334', email: 'info@alnoor.edu',       principalName: 'Dr. Fatima Al-Zahrani',establishedYear: 2018, status: 'inactive' },
  ];
  private nextId = 5;

  getAll(): School[]   { return [...this.schools]; }
  getActive(): School[]{ return this.schools.filter(s => s.status === 'active'); }
  getById(id: number)  { return this.schools.find(s => s.id === id); }

  add(data: Omit<School, 'id'>): School {
    const entry = { ...data, id: this.nextId++ };
    this.schools.push(entry);
    return entry;
  }

  update(id: number, data: Omit<School, 'id'>): boolean {
    const i = this.schools.findIndex(s => s.id === id);
    if (i === -1) return false;
    this.schools[i] = { ...data, id };
    return true;
  }

  delete(id: number): void { this.schools = this.schools.filter(s => s.id !== id); }
}
