import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../login/auth';

@Component({
  selector: 'app-student-portal-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-portal-layout.html',
  styleUrl: './student-portal-layout.css',
})
export class StudentPortalLayout {
  isMobileOpen = false;

  navItems = [
    { label: 'My Dashboard', icon: '🏠', route: '/student-portal' },
  ];

  constructor(public authService: Auth, private router: Router) {}

  toggleMobile() { this.isMobileOpen = !this.isMobileOpen; }
  closeMobile()  { this.isMobileOpen = false; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
