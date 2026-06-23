import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, AppUser } from '../../login/auth';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  user: AppUser | null = null;
  editName = '';
  editMode = false;
  savedMsg = '';

  currentPw = '';
  newPw     = '';
  confirmPw = '';
  pwError   = '';
  pwSuccess  = '';

  constructor(private authService: Auth) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.editName = this.user?.name ?? '';
  }

  saveProfile() {
    if (this.user) { this.user.name = this.editName; this.savedMsg = 'Profile updated!'; this.editMode = false; setTimeout(() => this.savedMsg = '', 3000); }
  }

  changePassword() {
    this.pwError = ''; this.pwSuccess = '';
    if (!this.currentPw || !this.newPw || !this.confirmPw) { this.pwError = 'All fields are required.'; return; }
    if (this.newPw.length < 6) { this.pwError = 'New password must be at least 6 characters.'; return; }
    if (this.newPw !== this.confirmPw) { this.pwError = 'Passwords do not match.'; return; }
    this.pwSuccess = 'Password changed successfully!';
    this.currentPw = ''; this.newPw = ''; this.confirmPw = '';
    setTimeout(() => this.pwSuccess = '', 3000);
  }

  roleColor(): string {
    const colors: Record<string, string> = { admin: '#1976d2', teacher: '#43a047', student: '#e65100' };
    return colors[this.user?.role ?? ''] ?? '#555';
  }
}
