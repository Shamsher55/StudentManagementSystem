import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student';

export interface AppUser {
  email: string;
  name: string;
  role: UserRole;
  schoolId?: number;
  studentId?: number;
}

interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
  schoolId?: number;
  studentId?: number;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private currentUser: AppUser | null = null;
  private _schoolContext: number | null = null;
  private _schoolName: string | null = null;

  register(name: string, email: string, password: string, role: string, schoolId?: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password, role, schoolId });
  }

  login(email: string, password: string): Observable<AppUser> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        const user: AppUser = { email: res.email, name: res.name, role: res.role as UserRole, schoolId: res.schoolId ?? undefined, studentId: res.studentId ?? undefined };
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('schoolContext');
        localStorage.removeItem('schoolName');
      }),
      map(res => ({ email: res.email, name: res.name, role: res.role as UserRole, schoolId: res.schoolId ?? undefined, studentId: res.studentId ?? undefined }))
    );
  }

  logout(): void {
    this.currentUser = null;
    this._schoolContext = null;
    this._schoolName = null;
    localStorage.removeItem('token');
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

  getSchoolId(): number | null {
    const user = this.getUser();
    if (!user) return null;
    if (user.role === 'superadmin') {
      if (this._schoolContext !== null) return this._schoolContext;
      const stored = localStorage.getItem('schoolContext');
      if (stored) { this._schoolContext = +stored; return this._schoolContext; }
      return null;
    }
    return user.schoolId ?? null;
  }

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
  isLoggedIn(): boolean          { return !!this.getUser() && !!localStorage.getItem('token'); }
  isSuperAdmin(): boolean        { return this.getRole() === 'superadmin'; }
  isAdmin(): boolean             { return this.getRole() === 'admin'; }
  isTeacher(): boolean           { return this.getRole() === 'teacher'; }
  isStudent(): boolean           { return this.getRole() === 'student'; }
  isAdminOrAbove(): boolean      { return this.isAdmin() || this.isSuperAdmin(); }
  hasSchoolContext(): boolean     { return this.getSchoolId() !== null; }
}
