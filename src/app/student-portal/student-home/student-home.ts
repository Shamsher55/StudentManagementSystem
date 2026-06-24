import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Auth } from '../../login/auth';
import { StudentService } from '../../students/student';
import { AttendanceService } from '../../attendance/attendance';
import { Student } from '../../students/student.model';
import { AttendanceRecord } from '../../attendance/attendance.model';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-home.html',
  styleUrl: './student-home.css',
})
export class StudentHome implements OnInit {
  student: Student | undefined;
  attendance: AttendanceRecord[] = [];
  present = 0; absent = 0; late = 0; rate = 0;

  constructor(
    private authService: Auth,
    private studentService: StudentService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit() {
    const studentId = this.authService.getUser()?.studentId;
    if (studentId) {
      forkJoin({
        student:    this.studentService.getById(studentId),
        attendance: this.attendanceService.getAll(),
      }).subscribe(({ student, attendance }) => {
        this.student    = student;
        this.attendance = attendance.filter(r => r.studentId === studentId);
        this.present    = this.attendance.filter(r => r.status === 'Present').length;
        this.absent     = this.attendance.filter(r => r.status === 'Absent').length;
        this.late       = this.attendance.filter(r => r.status === 'Late').length;
        this.rate       = this.attendance.length
          ? Math.round((this.present / this.attendance.length) * 100) : 0;
      });
    }
  }
}
