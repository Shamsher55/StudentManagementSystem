import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admission } from './admission.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/admissions`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<Admission[]>                         { return this.http.get<Admission[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Admission[]> { return this.http.get<Admission[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Admission>                { return this.http.get<Admission>(`${this.url}/${id}`); }

  add(data: Omit<Admission, 'id'>): Observable<Admission> {
    return this.http.post<Admission>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Admission, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
