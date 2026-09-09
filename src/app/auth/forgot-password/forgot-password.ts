import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly step = signal<1 | 2>(1);
  readonly loading = signal(false);
  readonly message = signal('');
  readonly messageType = signal<'error' | 'success' | ''>('');
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  email = '';
  newPassword = '';
  confirmPassword = '';

  // Find the account before showing the password form.
  continueToReset(): void {
    this.clearMessage();

    if (!/^[a-z0-9._%+-]+@gmail\.com$/i.test(this.email.trim())) {
      this.showMessage('Enter the Gmail address used for your account.', 'error');
      return;
    }

    this.loading.set(true);
    this.authService.accountExists(this.email).subscribe({
      next: (exists) => {
        this.loading.set(false);
        if (!exists) {
          this.showMessage('No account was found for this Gmail address.', 'error');
          return;
        }
        this.step.set(2);
      },
      error: (error: Error) => {
        this.loading.set(false);
        this.showMessage(error.message, 'error');
      },
    });
  }

  // Validate and save the new password.
  savePassword(): void {
    this.clearMessage();

    if (
      this.newPassword.length < 5 ||
      !/[A-Za-z]/.test(this.newPassword) ||
      !/\d/.test(this.newPassword)
    ) {
      this.showMessage(
        'Password must be at least 5 characters and contain a letter and a number.',
        'error',
      );
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showMessage('Passwords do not match.', 'error');
      return;
    }

    this.loading.set(true);
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/auth/login'], { queryParams: { reset: 'success' } });
      },
      error: (error: Error) => {
        this.loading.set(false);
        this.showMessage(error.message, 'error');
      },
    });
  }

  goBack(): void {
    this.step.set(1);
    this.clearMessage();
  }

  togglePassword(field: 'new' | 'confirm'): void {
    if (field === 'new') {
      this.showNewPassword.update((value) => !value);
    } else {
      this.showConfirmPassword.update((value) => !value);
    }
  }

  private clearMessage(): void {
    this.message.set('');
    this.messageType.set('');
  }

  private showMessage(message: string, type: 'error' | 'success'): void {
    this.message.set(message);
    this.messageType.set(type);
  }
}
