import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AttendanceService } from '../attendance';
import { StudentService } from '../../students/student';
import { Student } from '../../students/student.model';

interface MarkRow {
  student: Student;
  status: 'Present' | 'Absent' | 'Late';
  alreadyMarked: boolean;
}

@Component({
  selector: 'app-attendance-mark',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-mark.html',
  styleUrl: './attendance-mark.css',
})
export class AttendanceMark implements OnInit {
  selectedDate   = '';
  selectedCourse = '';
  courses: string[] = [];
  rows: MarkRow[] = [];
  submitted = false;
  saved = false;

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private router: Router,
  ) {}

  ngOnInit() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.studentService.getAll().subscribe(students => {
      this.courses = [...new Set(students.map(s => s.course))].sort();
    });
  }

  loadStudents() {
    if (!this.selectedDate || !this.selectedCourse) return;
    forkJoin({
      students:   this.studentService.getAll(),
      attendance: this.attendanceService.getAll(),
    }).subscribe(({ students, attendance }) => {
      const filtered = students.filter(s => s.course === this.selectedCourse && s.status === 'Active');
      this.rows = filtered.map(s => ({
        student: s,
        status: 'Present' as const,
        alreadyMarked: attendance.some(r => r.studentId === s.id && r.date === this.selectedDate),
      }));
      this.submitted = false;
      this.saved = false;
    });
  }

  markAll(status: 'Present' | 'Absent' | 'Late') {
    this.rows.filter(r => !r.alreadyMarked).forEach(r => r.status = status);
  }

  submit() {
    const toSave = this.rows.filter(r => !r.alreadyMarked);
    if (!toSave.length) {
      this.submitted = true;
      this.saved = true;
      return;
    }
    forkJoin(toSave.map(r => this.attendanceService.add({
      schoolId:    r.student.schoolId,
      studentId:   r.student.id,
      studentName: r.student.name,
      course:      r.student.course,
      date:        this.selectedDate,
      status:      r.status,
    }))).subscribe(() => {
      this.submitted = true;
      this.saved = true;
      this.rows.forEach(r => r.alreadyMarked = true);
    });
  }

  goBack() { this.router.navigate(['/attendance']); }
}
