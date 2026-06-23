import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../login/auth';
import { NotificationBell } from '../../notifications/notification-bell/notification-bell';
import { SchoolService } from '../../schools/school';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBell],
  templateUrl: './profile-layout.html',
  styleUrl: './profile-layout.css',
})
export class ProfileLayout {
  isSidebarCollapsed = false;
  isMobileOpen = false;

  get navItems() {
    const isAdmin = this.authService.isAdmin();
    const isSuperAdmin = this.authService.isSuperAdmin();
    return [
      ...(isSuperAdmin ? [{ label: 'Schools', icon: '🏫', route: '/schools' }] : []),
      { label: 'Dashboard',        icon: '🏠',  route: '/dashboard' },
      { label: 'Students',         icon: '🎓',  route: '/students' },
      ...(isAdmin || isSuperAdmin ? [{ label: 'Add Student',     icon: '➕', route: '/students/add' }] : []),
      { label: 'Admissions',       icon: '📝',  route: '/admissions' },
      ...(isAdmin || isSuperAdmin ? [{ label: 'New Application', icon: '➕', route: '/admissions/add' }] : []),
      { label: 'Teachers',         icon: '👨‍🏫', route: '/teachers' },
      { label: 'Courses',          icon: '📚',  route: '/courses' },
      { label: 'Timetable',        icon: '🗓️',  route: '/timetable' },
      { label: 'Exams',            icon: '📄',  route: '/exams' },
      { label: 'Grades',           icon: '🏅',  route: '/grades' },
      { label: 'Attendance',       icon: '📋',  route: '/attendance' },
      { label: 'Fees',             icon: '💰',  route: '/fees' },
      { label: 'Events',           icon: '📅',  route: '/events' },
      { label: 'Reports',          icon: '📊',  route: '/reports' },
      { label: 'Profile',          icon: '👤',  route: '/profile' },
    ];
  }

  get userLabel() { const u = this.authService.getUser(); return u ? `${u.name} (${u.role})` : 'User'; }

  get schoolName(): string {
    const id = this.authService.getSchoolId();
    if (!id) return '';
    return this.schoolService.getById(id)?.name ?? '';
  }

  constructor(public authService: Auth, private router: Router, private schoolService: SchoolService) {}
  toggleSidebar() { this.isSidebarCollapsed = !this.isSidebarCollapsed; }
  toggleMobile()  { this.isMobileOpen = !this.isMobileOpen; }
  closeMobile()   { this.isMobileOpen = false; }
  logout()     { this.authService.logout(); this.router.navigate(['/login']); }
  exitSchool() { this.authService.setSchoolContext(null); this.router.navigate(['/schools']); }
}
