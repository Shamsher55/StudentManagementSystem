import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, ExamResult } from './exam.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/exams`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<Exam[]>                        { return this.http.get<Exam[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Exam[]>{ return this.http.get<Exam[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Exam>               { return this.http.get<Exam>(`${this.url}/${id}`); }
  getResults(examId: number): Observable<ExamResult[]>{ return this.http.get<ExamResult[]>(`${this.url}/${examId}/results`); }

  add(data: Omit<Exam, 'id'>): Observable<Exam> {
    return this.http.post<Exam>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Exam, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  addResult(data: Omit<ExamResult, 'id'>): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.url}/${data.examId}/results`, data);
  }

  scoreToGrade(score: number, total: number): string {
    const pct = (score / total) * 100;
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  }
}
