import { Injectable } from '@angular/core';

export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student';

export interface AppUser {
  email: string;
  name: string;
  role: UserRole;
  schoolId?: number;   // undefined for superadmin
  studentId?: number;
}

const USERS: (AppUser & { password: string })[] = [
  // Super Admin — manages all schools
  { email: 'superadmin@sms.edu',       password: 'super123',    role: 'superadmin', name: 'Super Admin' },

  // School 1 — Al-Faisal Academy (Riyadh)
  { email: 'admin@example.com',        password: 'password123', role: 'admin',      name: 'Admin User',    schoolId: 1 },
  { email: 'teacher@example.com',      password: 'teacher123',  role: 'teacher',    name: 'John Teacher',  schoolId: 1 },
  { email: 'student@example.com',      password: 'student123',  role: 'student',    name: 'Ali Hassan',    schoolId: 1, studentId: 1 },

  // School 2 — Bright Future School (Jeddah)
  { email: 'admin@brightfuture.edu',   password: 'admin123',    role: 'admin',      name: 'Sara Admin',    schoolId: 2 },
  { email: 'teacher@brightfuture.edu', password: 'teach123',    role: 'teacher',    name: 'Nora Teacher',  schoolId: 2 },
  { email: 'student@brightfuture.edu', password: 'student123',  role: 'student',    name: 'Ahmed Zaki',    schoolId: 2, studentId: 6 },

  // School 3 — National Institute (Dammam)
  { email: 'admin@national.edu',       password: 'admin123',    role: 'admin',      name: 'Omar Admin',    schoolId: 3 },
  { email: 'teacher@national.edu',     password: 'teach123',    role: 'teacher',    name: 'Ali Trainer',   schoolId: 3 },
];

@Injectable({ providedIn: 'root' })
export class Auth {
  private currentUser: AppUser | null = null;
  private _schoolContext: number | null = null;
  private _schoolName: string | null = null;

  login(email: string, password: string): AppUser | null {
    const match = USERS.find(u => u.email === email && u.password === password);
    if (!match) return null;
    const { password: _pw, ...user } = match;
    this.currentUser = user;
    this._schoolContext = null;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.removeItem('schoolContext');
    return user;
  }

  logout(): void {
    this.currentUser = null;
    this._schoolContext = null;
    this._schoolName = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('schoolContext');
    localStorage.removeItem('schoolName');
  }

  getUser(): AppUser | null {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try { this.currentUser = JSON.parse(stored); } catch { /**/ }
    }
    return this.currentUser;
  }

  // The active school ID used for data scoping
  getSchoolId(): number | null {
    const user = this.getUser();
    if (!user) return null;
    if (user.role === 'superadmin') {
      if (this._schoolContext !== null) return this._schoolContext;
      const stored = localStorage.getItem('schoolContext');
      if (stored) { this._schoolContext = +stored; return this._schoolContext; }
      return null; // superadmin with no context → sees all
    }
    return user.schoolId ?? null;
  }

  // SuperAdmin only — set school context
  setSchoolContext(schoolId: number | null, schoolName?: string): void {
    this._schoolContext = schoolId;
    this._schoolName = schoolName ?? null;
    if (schoolId !== null) {
      localStorage.setItem('schoolContext', String(schoolId));
      if (schoolName) localStorage.setItem('schoolName', schoolName);
    } else {
      localStorage.removeItem('schoolContext');
      localStorage.removeItem('schoolName');
    }
  }

  getSchoolName(): string | null {
    if (this._schoolName) return this._schoolName;
    const stored = localStorage.getItem('schoolName');
    if (stored) { this._schoolName = stored; return stored; }
    return null;
  }

  getRole(): UserRole | null     { return this.getUser()?.role ?? null; }
  isLoggedIn(): boolean          { return !!this.getUser(); }
  isSuperAdmin(): boolean        { return this.getRole() === 'superadmin'; }
  isAdmin(): boolean             { return this.getRole() === 'admin'; }
  isTeacher(): boolean           { return this.getRole() === 'teacher'; }
  isStudent(): boolean           { return this.getRole() === 'student'; }
  isAdminOrAbove(): boolean      { return this.isAdmin() || this.isSuperAdmin(); }
  hasSchoolContext(): boolean     { return this.getSchoolId() !== null; }
}
