import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StudentService } from '../../students/student';
import { GradeService } from '../../grades/grade';
import { AttendanceService } from '../../attendance/attendance';
import { Student } from '../../students/student.model';
import { Grade } from '../../grades/grade.model';

const GPA_POINTS: Record<string, number> = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };

interface SubjectBar { subject: string; score: number; letter: string; color: string; pct: number; }

@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-progress.html',
  styleUrl: './student-progress.css',
})
export class StudentProgress implements OnInit {
  students: Student[] = [];
  selectedStudentId: number | null = null;

  student: Student | null = null;
  grades: Grade[] = [];
  gpa = 0;
  passRate = 0;
  attendanceRate = 0;
  attendancePresent = 0;
  attendanceAbsent = 0;
  attendanceLate = 0;
  subjectBars: SubjectBar[] = [];
  performanceStatus: 'Excellent' | 'Good' | 'Needs Improvement' | 'At Risk' = 'Good';

  get performanceStatusClass(): string {
    return this.performanceStatus.toLowerCase().replace(/ /g, '-');
  }

  private gradeColors: Record<string, string> = {
    A: '#43a047', B: '#1976d2', C: '#fb8c00', D: '#9c27b0', F: '#e53935',
  };

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit() {
    this.studentService.getAll().subscribe(students => {
      this.students = students;
      if (students.length) {
        this.selectedStudentId = students[0].id;
        this.loadReport();
      }
    });
  }

  onStudentChange() { this.loadReport(); }

  loadReport() {
    if (!this.selectedStudentId) return;
    const id = +this.selectedStudentId;

    forkJoin({
      student:    this.studentService.getById(id),
      grades:     this.gradeService.getAll(),
      attendance: this.attendanceService.getAll(),
    }).subscribe(({ student, grades, attendance }) => {
      this.student = student;
      this.grades  = grades.filter(g => g.studentId === id);

      const studentGrades = this.grades;
      const gpaTotal = studentGrades.reduce((s, g) => s + (GPA_POINTS[g.letterGrade] ?? 0), 0);
      this.gpa = studentGrades.length ? Math.round((gpaTotal / studentGrades.length) * 100) / 100 : 0;

      const passed = studentGrades.filter(g => g.letterGrade !== 'F').length;
      this.passRate = studentGrades.length ? Math.round((passed / studentGrades.length) * 100) : 0;

      const records = attendance.filter(r => r.studentId === id);
      const total = records.length;
      this.attendancePresent = records.filter(r => r.status === 'Present').length;
      this.attendanceAbsent  = records.filter(r => r.status === 'Absent').length;
      this.attendanceLate    = records.filter(r => r.status === 'Late').length;
      this.attendanceRate    = total ? Math.round((this.attendancePresent / total) * 100) : 0;

      const maxScore = Math.max(...studentGrades.map(g => g.score), 1);
      this.subjectBars = studentGrades.map(g => ({
        subject: g.subject,
        score:   g.score,
        letter:  g.letterGrade,
        color:   this.gradeColors[g.letterGrade] ?? '#888',
        pct:     Math.round((g.score / maxScore) * 100),
      }));

      if (this.gpa >= 3.5 && this.attendanceRate >= 85) {
        this.performanceStatus = 'Excellent';
      } else if (this.gpa >= 2.5 && this.attendanceRate >= 70) {
        this.performanceStatus = 'Good';
      } else if (this.gpa >= 1.5) {
        this.performanceStatus = 'Needs Improvement';
      } else {
        this.performanceStatus = 'At Risk';
      }
    });
  }
}
