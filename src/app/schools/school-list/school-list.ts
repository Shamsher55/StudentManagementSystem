import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './school-list.html',
  styleUrl: './school-list.css',
})
export class SchoolList implements OnInit {
  private service        = inject(SchoolService);
  private auth           = inject(Auth);
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private router         = inject(Router);

  schools: School[] = [];
  stats: Record<number, { students: number; teachers: number }> = {};

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
}
