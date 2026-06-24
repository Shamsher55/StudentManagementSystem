import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Fee, FeeStatus } from './fee.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeeService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/fees`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<Fee[]>                        { return this.http.get<Fee[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Fee[]>{ return this.http.get<Fee[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Fee>               { return this.http.get<Fee>(`${this.url}/${id}`); }

  add(data: Omit<Fee, 'id'>): Observable<Fee> {
    return this.http.post<Fee>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Fee, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  markPaid(id: number): Observable<void> {
    return this.getById(id).pipe(
      switchMap(fee => this.http.put<void>(`${this.url}/${id}`, {
        ...fee,
        status: 'paid' as FeeStatus,
        paidDate: new Date().toISOString().slice(0, 10),
        receiptNo: 'RCP-' + String(id).padStart(3, '0'),
      }))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
