import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AttendanceService } from '../../attendance/attendance';
import { GradeService } from '../../grades/grade';
import { StudentService } from '../../students/student';

interface Notification { id: number; type: 'attendance' | 'grade'; message: string; isRead: boolean; }

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell implements OnInit {
  notifications: Notification[] = [];
  isOpen = false;
  private nextId = 1;

  get unreadCount() { return this.notifications.filter(n => !n.isRead).length; }

  constructor(
    private attendanceService: AttendanceService,
    private gradeService: GradeService,
    private studentService: StudentService,
  ) {}

  ngOnInit() { this.generateNotifications(); }

  generateNotifications() {
    forkJoin({
      students:   this.studentService.getAll(),
      attendance: this.attendanceService.getAll(),
      grades:     this.gradeService.getAll(),
    }).subscribe(({ students, attendance, grades }) => {
      const notifications: Notification[] = [];

      const active = students.filter((s: any) => s.status === 'Active');
      for (const s of active) {
        const records = attendance.filter((r: any) => r.studentId === s.id);
        if (records.length > 0) {
          const present = records.filter((r: any) => r.status === 'Present').length;
          const rate = Math.round((present / records.length) * 100);
          if (rate < 75) {
            notifications.push({ id: this.nextId++, type: 'attendance', isRead: false,
              message: `${(s as any).name}'s attendance is ${rate}% — below 75% threshold` });
          }
        }
      }

      const failing = grades.filter((g: any) => g.letterGrade === 'F');
      for (const g of failing) {
        const student = students.find((s: any) => s.id === g.studentId);
        if (student) {
          notifications.push({ id: this.nextId++, type: 'grade', isRead: false,
            message: `${(student as any).name} scored ${g.score}% in ${(g as any).subject} — failing grade` });
        }
      }

      this.notifications = notifications;
    });
  }

  toggle() { this.isOpen = !this.isOpen; }

  markRead(id: number) {
    const n = this.notifications.find(x => x.id === id);
    if (n) n.isRead = true;
  }

  markAllRead() { this.notifications.forEach(n => n.isRead = true); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const el = e.target as HTMLElement;
    if (!el.closest('.bell-wrapper')) this.isOpen = false;
  }
}
