import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolEvent } from './event.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/events`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<SchoolEvent[]>                        { return this.http.get<SchoolEvent[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<SchoolEvent[]>{ return this.http.get<SchoolEvent[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<SchoolEvent>               { return this.http.get<SchoolEvent>(`${this.url}/${id}`); }

  add(data: Omit<SchoolEvent, 'id'>): Observable<SchoolEvent> {
    return this.http.post<SchoolEvent>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<SchoolEvent, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
