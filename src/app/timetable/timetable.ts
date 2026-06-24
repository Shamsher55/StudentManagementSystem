import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimetableSlot, WeekDay } from './timetable.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

export const DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/timetable`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<TimetableSlot[]>                          { return this.http.get<TimetableSlot[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<TimetableSlot[]>  { return this.http.get<TimetableSlot[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<TimetableSlot>                 { return this.http.get<TimetableSlot>(`${this.url}/${id}`); }

  add(data: Omit<TimetableSlot, 'id'>): Observable<TimetableSlot> {
    return this.http.post<TimetableSlot>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<TimetableSlot, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
