import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../login/auth';
import { NotificationBell } from '../../notifications/notification-bell/notification-bell';

@Component({
  selector: 'app-schools-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBell],
  templateUrl: './schools-layout.html',
  styleUrl: './schools-layout.css',
})
export class SchoolsLayout {
  isSidebarCollapsed = false;
  isMobileOpen = false;

  get navItems() {
    return [
      { label: 'Schools',    icon: '🏫', route: '/schools' },
      { label: 'Add School', icon: '➕', route: '/schools/add' },
    ];
  }

  get userLabel() { return 'Super Admin'; }

  constructor(public auth: Auth, private router: Router) {}

  toggleSidebar() { this.isSidebarCollapsed = !this.isSidebarCollapsed; }
  toggleMobile()  { this.isMobileOpen = !this.isMobileOpen; }
  closeMobile()   { this.isMobileOpen = false; }
  logout()        { this.auth.logout(); this.router.navigate(['/login']); }
}
