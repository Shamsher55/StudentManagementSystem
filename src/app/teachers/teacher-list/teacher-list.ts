import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../teacher';
import { Teacher } from '../teacher.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css',
})
export class TeacherList implements OnInit {
  teachers: Teacher[] = [];
  stats = { total: 0, active: 0, inactive: 0 };

  get isAdmin() { return this.auth.isAdmin(); }

  constructor(private service: TeacherService, private auth: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(teachers => {
      this.teachers = teachers;
      this.stats = {
        total:    teachers.length,
        active:   teachers.filter(t => t.status === 'active').length,
        inactive: teachers.filter(t => t.status === 'inactive').length,
      };
    });
  }

  delete(id: number) {
    if (confirm('Delete this teacher?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
