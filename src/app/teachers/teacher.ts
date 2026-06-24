import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Teacher } from './teacher.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/teachers`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  private parseCourses(teachers: any[]): Teacher[] {
    return teachers.map(t => ({ ...t, courses: typeof t.courses === 'string' ? JSON.parse(t.courses) : (t.courses ?? []) }));
  }

  getAll(): Observable<Teacher[]>                        { return this.http.get<any[]>(this.url, this.schoolParams()).pipe(map(t => this.parseCourses(t))); }
  getAllBySchool(schoolId: number): Observable<Teacher[]>{ return this.http.get<any[]>(this.url, this.schoolParams(schoolId)).pipe(map(t => this.parseCourses(t))); }
  getById(id: number): Observable<Teacher>               {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      map(t => ({ ...t, courses: typeof t.courses === 'string' ? JSON.parse(t.courses) : (t.courses ?? []) }))
    );
  }
  getActive(): Observable<Teacher[]>                     { return this.getAll().pipe(map(t => t.filter(x => x.status === 'active'))); }

  add(data: Omit<Teacher, 'id'>): Observable<Teacher> {
    const payload = { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId(), courses: JSON.stringify(data.courses ?? []) };
    return this.http.post<Teacher>(this.url, payload);
  }

  update(id: number, data: Omit<Teacher, 'id'>): Observable<void> {
    const payload = { ...data, id, courses: JSON.stringify(data.courses ?? []) };
    return this.http.put<void>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
