import { Routes } from '@angular/router';
import { guestGuard } from './core/auth.guard';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Legal } from './legal/legal';
import { Login } from './login/login';
import { Register } from './register/register';

export const AUTH_ROUTES: Routes = [
  // Public authentication screens.
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },

  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: 'legal/:page',
    // Terms and privacy content used by registration.
    component: Legal,
  },
];
