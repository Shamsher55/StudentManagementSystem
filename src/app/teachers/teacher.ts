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

  getAll(): Observable<Teacher[]>                        { return this.http.get<Teacher[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Teacher[]>{ return this.http.get<Teacher[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Teacher>               { return this.http.get<Teacher>(`${this.url}/${id}`); }
  getActive(): Observable<Teacher[]>                     { return this.getAll().pipe(map(t => t.filter(x => x.status === 'active'))); }

  add(data: Omit<Teacher, 'id'>): Observable<Teacher> {
    return this.http.post<Teacher>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Teacher, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
