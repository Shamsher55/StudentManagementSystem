import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/courses`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<Course[]>                        { return this.http.get<Course[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Course[]>{ return this.http.get<Course[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Course>               { return this.http.get<Course>(`${this.url}/${id}`); }

  add(data: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Course, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
