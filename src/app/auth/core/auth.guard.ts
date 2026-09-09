import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  // Protect routes that require an authenticated session.
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : new RedirectCommand(router.parseUrl('/auth/login'));
};

export const guestGuard: CanActivateFn = () => {
  // Keep authenticated users out of login and registration pages.
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return new RedirectCommand(router.parseUrl(authService.isAdmin() ? '/admin/dashboard' : '/home'));
};

export const adminGuard: CanActivateFn = () => {
  // Restrict admin routes to administrator accounts.
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin() ? true : new RedirectCommand(router.parseUrl('/home'));
};
