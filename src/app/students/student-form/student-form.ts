import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  studentId: number | null = null;

  courses = ['Angular', 'React', 'Node.js', 'Python', 'Java', 'Vue.js'];
  grades  = ['A', 'B', 'C', 'D', 'F'];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name:   ['', [Validators.required, Validators.minLength(3)]],
      email:  ['', [Validators.required, Validators.email]],
      phone:  ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      course: ['', Validators.required],
      grade:  ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.studentService.getById(this.studentId).subscribe(student => {
        if (student) this.form.patchValue(student);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEditMode && this.studentId !== null) {
      this.studentService.update(this.studentId, this.form.value).subscribe(() => this.router.navigate(['/students']));
    } else {
      this.studentService.add(this.form.value).subscribe(() => this.router.navigate(['/students']));
    }
  }

  cancel() { this.router.navigate(['/students']); }
}
