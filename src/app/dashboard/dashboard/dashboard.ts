import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../students/student';
import { CourseService } from '../../courses/course';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = [
    { label: 'Total Students',  value: 0, icon: '🎓', color: '#1976d2', route: '/students' },
    { label: 'Active Students', value: 0, icon: '✅', color: '#2e7d32', route: '/students' },
    { label: 'Total Courses',   value: 0, icon: '📚', color: '#f57c00', route: '/courses' },
    { label: 'Active Courses',  value: 0, icon: '🟢', color: '#6a1b9a', route: '/courses' },
  ];

  recentStudents: any[] = [];
  recentCourses:  any[] = [];

  constructor(
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const students = this.studentService.getAll();
    const courses  = this.courseService.getAll();

    this.stats[0].value = students.length;
    this.stats[1].value = students.filter(s => s.status === 'Active').length;
    this.stats[2].value = courses.length;
    this.stats[3].value = courses.filter(c => c.status === 'Active').length;

    this.recentStudents = students.slice(0, 5);
    this.recentCourses  = courses.slice(0, 5);
  }
}
