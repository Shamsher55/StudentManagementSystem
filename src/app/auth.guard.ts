import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, UserRole } from './login/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth   = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }

  // Superadmin bypasses all role checks
  if (auth.isSuperAdmin()) return true;

  const roles = route.data?.['roles'] as UserRole[] | undefined;
  if (roles && !roles.includes(auth.getRole()!)) {
    auth.isStudent()
      ? router.navigate(['/student-portal'])
      : router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

export const superAdminGuard: CanActivateFn = () => {
  const auth   = inject(Auth);
  const router = inject(Router);
  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }
  if (!auth.isSuperAdmin()) { router.navigate(['/dashboard']); return false; }
  return true;
};
