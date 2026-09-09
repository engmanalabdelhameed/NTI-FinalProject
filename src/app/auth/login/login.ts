import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Authentication dependencies and page state.
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly message = signal('');
  readonly messageType = signal<'error' | 'success' | ''>('');
  readonly showPassword = signal(false);

  form = {
    username: '',
    password: '',
  };

  constructor() {
    // Show a confirmation when registration redirects here.
    if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
      this.showMessage('Account created. Sign in to continue.', 'success');
    }
    if (this.route.snapshot.queryParamMap.get('reset') === 'success') {
      this.showMessage('Password updated successfully. Sign in with your new password.', 'success');
    }
  }

  switchMode(mode: 'login' | 'register'): void {
    // Switch between the separate auth screens.
    this.router.navigate(['/auth', mode]);
  }

  togglePassword(): void {
    // Toggle password visibility.
    this.showPassword.update((value) => !value);
  }

  validatePassword(value: string): boolean {
    return value.trim().length > 0;
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  showMessage(message: string, type: 'error' | 'success'): void {
    this.message.set(message);
    this.messageType.set(type);
  }

  handleLogin(): void {
    // Validate credentials, create a session, and route by role.
    this.showMessage('', 'success');

    if (!this.form.username.trim() || !this.validatePassword(this.form.password)) {
      this.showMessage('Enter your username and password.', 'error');
      return;
    }

    this.setLoading(true);
    this.authService.login(this.form).subscribe({
      next: (user) => {
        this.showMessage('Signed in successfully.', 'success');
        this.setLoading(false);
        this.router.navigate([user.role === 'admin' ? '/admin/dashboard' : '/home']);
      },
      error: (error: Error) => {
        this.setLoading(false);
        this.showMessage(error.message, 'error');
      },
    });
  }

  handleForgotPassword(event: Event): void {
    // Open the password reset flow.
    event.preventDefault();
    this.router.navigate(['/auth/forgot-password']);
  }
}
