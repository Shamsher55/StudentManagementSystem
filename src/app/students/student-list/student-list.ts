import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../student';
import { Student } from '../student.model';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: Student[] = [];
  filtered: Student[] = [];
  searchTerm = '';

  get isAdmin() { return this.authService.isAdmin(); }

  constructor(private studentService: StudentService, private router: Router, private authService: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.students = this.studentService.getAll();
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.students.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.course.toLowerCase().includes(term)
    );
  }

  addStudent() { this.router.navigate(['/students/add']); }

  editStudent(id: number) { this.router.navigate(['/students/edit', id]); }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id);
      this.load();
    }
  }
}
