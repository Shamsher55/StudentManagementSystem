import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StudentService } from '../../students/student';
import { CourseService } from '../../courses/course';
import { AttendanceService } from '../../attendance/attendance';

interface BarItem { label: string; value: number; color: string; pct: number; }

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css',
})
export class ReportsDashboard implements OnInit {
  studentStats = { total: 0, active: 0, inactive: 0 };
  courseStats  = { total: 0, active: 0 };
  attendanceStats = { total: 0, present: 0, absent: 0, late: 0, rate: 0 };

  attendanceBar: BarItem[] = [];
  gradeBar:      BarItem[] = [];
  courseEnrollBar: BarItem[] = [];
  studentStatusDonut = '';

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit() {
    forkJoin({
      students:   this.studentService.getAll(),
      courses:    this.courseService.getAll(),
      attendance: this.attendanceService.getAll(),
    }).subscribe(({ students, courses, attendance }) => {
      this.studentStats = {
        total:    students.length,
        active:   students.filter(s => s.status === 'Active').length,
        inactive: students.filter(s => s.status === 'Inactive').length,
      };

      this.courseStats = {
        total:  courses.length,
        active: courses.filter(c => c.status === 'Active').length,
      };

      const total   = attendance.length;
      const present = attendance.filter(r => r.status === 'Present').length;
      const absent  = attendance.filter(r => r.status === 'Absent').length;
      const late    = attendance.filter(r => r.status === 'Late').length;
      const rate    = total ? Math.round((present / total) * 100) : 0;
      this.attendanceStats = { total, present, absent, late, rate };

      const aMax = Math.max(present, absent, late, 1);
      this.attendanceBar = [
        { label: 'Present', value: present, color: '#43a047', pct: Math.round(present / aMax * 100) },
        { label: 'Absent',  value: absent,  color: '#e53935', pct: Math.round(absent  / aMax * 100) },
        { label: 'Late',    value: late,     color: '#fb8c00', pct: Math.round(late    / aMax * 100) },
      ];

      const grades: Record<string, number> = {};
      students.forEach(s => { grades[s.grade] = (grades[s.grade] || 0) + 1; });
      const gradeColors: Record<string, string> = { A: '#43a047', B: '#1976d2', C: '#fb8c00', D: '#9c27b0', F: '#e53935' };
      const gMax = Math.max(...Object.values(grades), 1);
      this.gradeBar = Object.entries(grades)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([g, v]) => ({ label: g, value: v, color: gradeColors[g] || '#888', pct: Math.round(v / gMax * 100) }));

      const enrollMax = Math.max(...courses.map(c => c.enrolled), 1);
      this.courseEnrollBar = courses.map(c => ({
        label: c.title,
        value: c.enrolled,
        color: '#1976d2',
        pct:   Math.round(c.enrolled / enrollMax * 100),
      }));

      const activePct = students.length ? Math.round(this.studentStats.active / students.length * 100) : 0;
      this.studentStatusDonut = `conic-gradient(#43a047 0% ${activePct}%, #e53935 ${activePct}% 100%)`;
    });
  }
}
