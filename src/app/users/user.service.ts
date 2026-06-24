import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUserItem } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  getAll(schoolId?: number): Observable<AppUserItem[]> {
    let params = new HttpParams();
    if (schoolId) params = params.set('schoolId', schoolId.toString());
    return this.http.get<AppUserItem[]>(this.url, { params });
  }

  register(data: { name: string; email: string; password: string; role: string; schoolId?: number }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  update(id: number, data: { name: string; email: string; role: string; schoolId?: number; newPassword?: string }): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }

  resetPassword(id: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/reset-password`, { newPassword });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
