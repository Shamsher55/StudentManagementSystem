import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    const notifications: Notification[] = [];
    const students = this.studentService.getAll().filter(s => s.status === 'Active');

    students.forEach(s => {
      const records = this.attendanceService.getByStudent(s.id);
      if (records.length > 0) {
        const present = records.filter(r => r.status === 'Present').length;
        const rate    = Math.round((present / records.length) * 100);
        if (rate < 75) {
          notifications.push({ id: this.nextId++, type: 'attendance', isRead: false,
            message: `${s.name}'s attendance is ${rate}% — below 75% threshold` });
        }
      }
    });

    this.gradeService.getStudentsWithLowGrades().forEach(g => {
      notifications.push({ id: this.nextId++, type: 'grade', isRead: false,
        message: `${g.studentName} scored ${g.score}% in ${g.subject} — failing grade` });
    });

    this.notifications = notifications;
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
