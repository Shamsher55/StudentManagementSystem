import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SchoolService } from '../school';
import { School } from '../school.model';
import { Auth } from '../../login/auth';
import { StudentService } from '../../students/student';
import { TeacherService } from '../../teachers/teacher';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './school-list.html',
  styleUrl: './school-list.css',
})
export class SchoolList implements OnInit {
  private service        = inject(SchoolService);
  private auth           = inject(Auth);
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private router         = inject(Router);
  private fb             = inject(FormBuilder);

  schools: School[] = [];
  stats: Record<number, { students: number; teachers: number }> = {};

  adminModal: School | null = null;
  adminError = '';
  adminSuccess = '';
  adminLoading = false;

  adminForm = this.fb.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(schools => {
      this.schools = schools;
      this.stats = {};
      if (!schools.length) return;
      const calls = schools.map(s =>
        forkJoin({
          students: this.studentService.getAllBySchool(s.id),
          teachers: this.teacherService.getAllBySchool(s.id),
        })
      );
      forkJoin(calls).subscribe(results => {
        schools.forEach((s, i) => {
          this.stats[s.id] = { students: results[i].students.length, teachers: results[i].teachers.length };
        });
      });
    });
  }

  openSchool(school: School) {
    this.auth.setSchoolContext(school.id, school.name);
    this.router.navigate(['/dashboard']);
  }

  delete(id: number) {
    if (confirm('Delete this school? This cannot be undone.')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

  openAdminModal(school: School) {
    this.adminModal = school;
    this.adminForm.reset();
    this.adminError = '';
    this.adminSuccess = '';
  }

  closeAdminModal() { this.adminModal = null; }

  createAdmin() {
    if (this.adminForm.invalid) { this.adminForm.markAllAsTouched(); return; }
    const { name, email, password } = this.adminForm.value;
    this.adminLoading = true;
    this.adminError = '';
    this.adminSuccess = '';
    this.auth.register(name!, email!, password!, 'admin', this.adminModal!.id).subscribe({
      next: () => {
        this.adminSuccess = `Admin account created for ${email}`;
        this.adminLoading = false;
        this.adminForm.reset();
      },
      error: err => {
        this.adminError = err?.error?.message ?? 'Failed to create admin.';
        this.adminLoading = false;
      }
    });
  }

  invalid(f: string) { const c = this.adminForm.get(f); return c?.invalid && c?.touched; }
}
