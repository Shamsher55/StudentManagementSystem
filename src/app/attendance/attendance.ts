import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttendanceRecord } from './attendance.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/attendance`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<AttendanceRecord[]>                          { return this.http.get<AttendanceRecord[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<AttendanceRecord[]>  { return this.http.get<AttendanceRecord[]>(this.url, this.schoolParams(schoolId)); }
  getByStudent(studentId: number): Observable<AttendanceRecord[]>  { return this.getAll().pipe(map(r => r.filter(x => x.studentId === studentId))); }

  add(data: Omit<AttendanceRecord, 'id'>): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<AttendanceRecord, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
