import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';

  demoUsers = [
    { role: 'Super Admin',      email: 'superadmin@sms.edu',       password: 'super123',    color: '#4a148c', school: 'All Schools' },
    { role: 'Admin (School 1)', email: 'admin@example.com',        password: 'password123', color: '#1976d2', school: 'Al-Faisal Academy' },
    { role: 'Admin (School 2)', email: 'admin@brightfuture.edu',   password: 'admin123',    color: '#0277bd', school: 'Bright Future School' },
    { role: 'Teacher',          email: 'teacher@example.com',      password: 'teacher123',  color: '#43a047', school: 'Al-Faisal Academy' },
    { role: 'Student',          email: 'student@example.com',      password: 'student123',  color: '#fb8c00', school: 'Al-Faisal Academy' },
  ];

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  fillDemo(email: string, password: string) {
    this.loginForm.setValue({ email, password });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.errorMessage = '';
    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user.role === 'superadmin') this.router.navigate(['/schools']);
        else if (user.role === 'student') this.router.navigate(['/student-portal']);
        else this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}
