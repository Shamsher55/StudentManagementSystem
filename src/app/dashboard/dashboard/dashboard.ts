import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Auth } from '../../login/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  loading = true;

  stats = [
    { label: 'Total Students',     value: 0, icon: '🎓', color: '#1976d2', route: '/students' },
    { label: 'Active Students',    value: 0, icon: '✅', color: '#2e7d32', route: '/students' },
    { label: 'Total Teachers',     value: 0, icon: '👨‍🏫', color: '#00838f', route: '/teachers' },
    { label: 'Total Courses',      value: 0, icon: '📚', color: '#f57c00', route: '/courses' },
    { label: 'Active Courses',     value: 0, icon: '🟢', color: '#6a1b9a', route: '/courses' },
    { label: 'Total Admissions',   value: 0, icon: '📋', color: '#c62828', route: '/admissions' },
    { label: 'Pending Admissions', value: 0, icon: '⏳', color: '#e65100', route: '/admissions' },
    { label: 'Pending Fees',       value: 0, icon: '💰', color: '#558b2f', route: '/fees' },
  ];

  recentStudents: any[] = [];
  recentCourses:  any[] = [];

  ngOnInit() {
    const schoolId = this.auth.getSchoolId();
    let params = new HttpParams();
    if (schoolId) params = params.set('schoolId', schoolId.toString());

    this.http.get<any>(`${environment.apiUrl}/dashboard/stats`, { params }).subscribe({
      next: data => {
        this.stats[0].value = data.students;
        this.stats[1].value = data.activeStudents;
        this.stats[2].value = data.teachers;
        this.stats[3].value = data.courses;
        this.stats[4].value = data.activeCourses;
        this.stats[5].value = data.admissions;
        this.stats[6].value = data.pendingAdmissions;
        this.stats[7].value = data.pendingFees;
        this.recentStudents = data.recentStudents;
        this.recentCourses  = data.recentCourses;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
