import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../course';
import { Course } from '../course.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  courses: Course[] = [];
  filtered: Course[] = [];
  searchTerm = '';

  get isAdmin() { return this.authService.isAdmin(); }

  constructor(private courseService: CourseService, private router: Router, private authService: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.courses = this.courseService.getAll();
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.courses.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.instructor.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }

  addCourse() { this.router.navigate(['/courses/add']); }

  editCourse(id: number) { this.router.navigate(['/courses/edit', id]); }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.delete(id);
      this.load();
    }
  }

  levelClass(level: string): string {
    return { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced' }[level] ?? '';
  }
}
