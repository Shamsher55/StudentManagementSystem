import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    this.students = this.studentService.getAll().map(s => ({ id: s.id, name: s.name }));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      const g = this.gradeService.getById(+id);
      if (g) {
        this.editSchoolId = g.schoolId;
        this.form.patchValue({ studentId: g.studentId, subject: g.subject, score: g.score, semester: g.semester, date: g.date });
      }
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
      this.gradeService.update(this.editId, record);
    } else {
      this.gradeService.add(record);
    }
    this.router.navigate(['/grades']);
  }

  cancel() { this.router.navigate(['/grades']); }
}
