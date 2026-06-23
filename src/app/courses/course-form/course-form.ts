import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css',
})
export class CourseForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  courseId: number | null = null;

  categories = ['Frontend', 'Backend', 'Database', 'Data', 'DevOps', 'Mobile', 'Design'];
  levels     = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title:      ['', [Validators.required, Validators.minLength(3)]],
      instructor: ['', Validators.required],
      duration:   ['', Validators.required],
      level:      ['', Validators.required],
      category:   ['', Validators.required],
      enrolled:   [0,  [Validators.required, Validators.min(0)]],
      status:     ['Active', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      const course = this.courseService.getById(this.courseId);
      if (course) this.form.patchValue(course);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEditMode && this.courseId !== null) {
      this.courseService.update(this.courseId, this.form.value);
    } else {
      this.courseService.add(this.form.value);
    }
    this.router.navigate(['/courses']);
  }

  cancel() { this.router.navigate(['/courses']); }
}
