import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Grade } from './grade.model';
import { Auth } from '../login/auth';
import { environment } from '../../environments/environment';

const GPA_POINTS: Record<string, number> = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

@Injectable({ providedIn: 'root' })
export class GradeService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private url = `${environment.apiUrl}/grades`;

  private schoolParams(schoolId?: number): { params?: HttpParams } {
    const sid = schoolId ?? this.auth.getSchoolId();
    return sid ? { params: new HttpParams().set('schoolId', sid.toString()) } : {};
  }

  getAll(): Observable<Grade[]>                        { return this.http.get<Grade[]>(this.url, this.schoolParams()); }
  getAllBySchool(schoolId: number): Observable<Grade[]>{ return this.http.get<Grade[]>(this.url, this.schoolParams(schoolId)); }
  getById(id: number): Observable<Grade>               { return this.http.get<Grade>(`${this.url}/${id}`); }
  getByStudent(studentId: number): Observable<Grade[]> { return this.getAll().pipe(map(g => g.filter(x => x.studentId === studentId))); }

  add(data: Omit<Grade, 'id'>): Observable<Grade> {
    return this.http.post<Grade>(this.url, { ...data, schoolId: data.schoolId ?? this.auth.getSchoolId() });
  }

  update(id: number, data: Omit<Grade, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, { ...data, id });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getGPA(studentId: number, allGrades: Grade[]): number {
    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    if (!studentGrades.length) return 0;
    const total = studentGrades.reduce((s, g) => s + (GPA_POINTS[g.letterGrade] ?? 0), 0);
    return Math.round((total / studentGrades.length) * 100) / 100;
  }

  scoreToLetter(score: number): Grade['letterGrade'] {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
