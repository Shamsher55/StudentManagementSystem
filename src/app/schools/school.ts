import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { School } from './school.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/schools`;

  getAll(): Observable<School[]>          { return this.http.get<School[]>(this.url); }
  getActive(): Observable<School[]>       { return this.getAll().pipe(map(s => s.filter(x => x.status === 'active'))); }
  getById(id: number): Observable<School> { return this.http.get<School>(`${this.url}/${id}`); }

  add(data: Omit<School, 'id'>): Observable<School> {
    return this.http.post<School>(this.url, data);
  }

  update(id: number, data: Omit<School, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
