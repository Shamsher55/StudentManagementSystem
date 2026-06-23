import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GradeService } from '../grade';
import { Grade } from '../grade.model';
import { Auth } from '../../login/auth';

interface StudentGPA { studentId: number; studentName: string; gpa: number; total: number; }

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grade-list.html',
  styleUrl: './grade-list.css',
})
export class GradeList implements OnInit {
  grades: Grade[] = [];
  filtered: Grade[] = [];
  studentGPAs: StudentGPA[] = [];
  filterStudent = '';
  filterSubject = '';
  filterLetter  = '';
  students: string[] = [];
  subjects: string[] = [];

  get isAdmin() { return this.authService.isAdmin(); }

  constructor(private gradeService: GradeService, private router: Router, private authService: Auth) {}

  ngOnInit() { this.load(); }

  load() {
    this.grades   = this.gradeService.getAll();
    this.students = [...new Set(this.grades.map(g => g.studentName))].sort();
    this.subjects = [...new Set(this.grades.map(g => g.subject))].sort();
    this.computeGPAs();
    this.applyFilter();
  }

  computeGPAs() {
    const map = new Map<number, { name: string; ids: number[] }>();
    this.grades.forEach(g => {
      if (!map.has(g.studentId)) map.set(g.studentId, { name: g.studentName, ids: [] });
      map.get(g.studentId)!.ids.push(g.id);
    });
    this.studentGPAs = [...map.entries()].map(([id, v]) => ({
      studentId: id,
      studentName: v.name,
      gpa: this.gradeService.getGPA(id),
      total: v.ids.length,
    }));
  }

  applyFilter() {
    this.filtered = this.grades.filter(g => {
      const ms = !this.filterStudent || g.studentName === this.filterStudent;
      const mj = !this.filterSubject || g.subject === this.filterSubject;
      const ml = !this.filterLetter  || g.letterGrade === this.filterLetter;
      return ms && mj && ml;
    });
  }

  clearFilters() { this.filterStudent = ''; this.filterSubject = ''; this.filterLetter = ''; this.applyFilter(); }

  addGrade()         { this.router.navigate(['/grades/add']); }
  editGrade(id: number) { this.router.navigate(['/grades/edit', id]); }

  deleteGrade(id: number) {
    if (confirm('Delete this grade record?')) { this.gradeService.delete(id); this.load(); }
  }

  gpaColor(gpa: number): string {
    if (gpa >= 3.5) return '#2e7d32';
    if (gpa >= 2.5) return '#1976d2';
    if (gpa >= 1.5) return '#f57c00';
    return '#c62828';
  }
}
