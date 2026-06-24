import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GradeService } from '../grade';
import { StudentService } from '../../students/student';

@Component({
  selector: 'app-grade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grade-form.html',
  styleUrl: './grade-form.css',
})
export class GradeForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId: number | null = null;
  editSchoolId = 1;
  students: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      studentId:   ['', Validators.required],
      subject:     ['', Validators.required],
      score:       ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      semester:    ['Fall 2026', Validators.required],
      date:        [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      forkJoin({
        students: this.studentService.getAll(),
        grade:    this.gradeService.getById(+id),
      }).subscribe(({ students, grade }) => {
        this.students = students.map(s => ({ id: s.id, name: s.name }));
        if (grade) {
          this.editSchoolId = grade.schoolId;
          this.form.patchValue({ studentId: grade.studentId, subject: grade.subject, score: grade.score, semester: grade.semester, date: grade.date });
        }
      });
    } else {
      this.studentService.getAll().subscribe(students => {
        this.students = students.map(s => ({ id: s.id, name: s.name }));
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const student = this.students.find(s => s.id === +v.studentId);
    const record = {
      schoolId:    this.editSchoolId,
      studentId:   +v.studentId,
      studentName: student?.name ?? '',
      subject:     v.subject,
      score:       +v.score,
      letterGrade: this.gradeService.scoreToLetter(+v.score),
      semester:    v.semester,
      date:        v.date,
    };
    if (this.isEdit && this.editId) {
      this.gradeService.update(this.editId, record).subscribe(() => this.router.navigate(['/grades']));
    } else {
      this.gradeService.add(record).subscribe(() => this.router.navigate(['/grades']));
    }
  }

  cancel() { this.router.navigate(['/grades']); }
}
