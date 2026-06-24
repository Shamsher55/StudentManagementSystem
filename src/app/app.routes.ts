import { Routes } from '@angular/router';
import { authGuard, superAdminGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'schools',
    loadChildren: () => import('./schools/schools-module').then(m => m.SchoolsModule),
    canActivate: [superAdminGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users-module').then(m => m.UsersModule),
    canActivate: [authGuard],
    data: { roles: ['superadmin', 'admin'] },
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login-module').then(m => m.LoginModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'students',
    loadChildren: () => import('./students/students-module').then(m => m.StudentsModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses-module').then(m => m.CoursesModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'admissions',
    loadChildren: () => import('./admissions/admissions-module').then(m => m.AdmissionsModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'fees',
    loadChildren: () => import('./fees/fees-module').then(m => m.FeesModule),
    canActivate: [authGuard], data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'timetable',
    loadChildren: () => import('./timetable/timetable-module').then(m => m.TimetableModule),
    canActivate: [authGuard], data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'exams',
    loadChildren: () => import('./exams/exams-module').then(m => m.ExamsModule),
    canActivate: [authGuard], data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'teachers',
    loadChildren: () => import('./teachers/teachers-module').then(m => m.TeachersModule),
    canActivate: [authGuard], data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events-module').then(m => m.EventsModule),
    canActivate: [authGuard], data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance-module').then(m => m.AttendanceModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports-module').then(m => m.ReportsModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'grades',
    loadChildren: () => import('./grades/grades-module').then(m => m.GradesModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile-module').then(m => m.ProfileModule),
    canActivate: [authGuard],
    data: { roles: ['admin', 'teacher'] },
  },
  {
    path: 'student-portal',
    loadChildren: () => import('./student-portal/student-portal-module').then(m => m.StudentPortalModule),
    canActivate: [authGuard],
    data: { roles: ['student'] },
  },
];
