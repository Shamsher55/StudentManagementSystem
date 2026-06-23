import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttendanceService } from '../attendance';
import { AttendanceRecord } from '../attendance.model';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css',
})
export class AttendanceList implements OnInit {
  records: AttendanceRecord[] = [];
  filtered: AttendanceRecord[] = [];
  filterDate   = '';
  filterCourse = '';
  filterStatus = '';
  courses: string[] = [];

  constructor(private attendanceService: AttendanceService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.records = this.attendanceService.getAll();
    this.courses = this.attendanceService.getUniqueCourses();
    this.applyFilter();
  }

  applyFilter() {
    this.filtered = this.records.filter(r => {
      const matchDate   = !this.filterDate   || r.date === this.filterDate;
      const matchCourse = !this.filterCourse || r.course === this.filterCourse;
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      return matchDate && matchCourse && matchStatus;
    });
  }

  clearFilters() {
    this.filterDate = '';
    this.filterCourse = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  markAttendance() { this.router.navigate(['/attendance/mark']); }

  updateStatus(id: number, status: 'Present' | 'Absent' | 'Late') {
    this.attendanceService.update(id, status);
    this.load();
  }

  delete(id: number) {
    if (confirm('Delete this attendance record?')) {
      this.attendanceService.delete(id);
      this.load();
    }
  }

  get stats() { return this.attendanceService.getStats(); }
}
