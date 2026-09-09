import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Registration dependencies and form state.
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly message = signal('');
  readonly messageType = signal<'error' | 'success' | ''>('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  form = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  switchMode(mode: 'login' | 'register'): void {
    // Switch between the separate auth screens.
    this.router.navigate(['/auth', mode]);
  }

  togglePassword(field: 'password' | 'confirmPassword' = 'password'): void {
    // Toggle either password field.
    if (field === 'confirmPassword') {
      this.showConfirmPassword.update((value) => !value);
      return;
    }
    this.showPassword.update((value) => !value);
  }

  validateEmail(value: string): boolean {
    // Accept Gmail addresses only.
    return /^[a-z0-9._%+-]+@gmail\.com$/i.test(value.trim());
  }

  validatePassword(value: string): boolean {
    // Apply the account password policy.
    return value.length >= 5 && /[A-Za-z]/.test(value) && /\d/.test(value);
  }

  checkPasswordStrength(value: string): 'weak' | 'medium' | 'strong' {
    // Show simple feedback based on the required character types.
    if (!value || value.length < 5 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'weak';
    if (value.length < 8) return 'medium';
    return 'strong';
  }

  validateConfirmPassword(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  showMessage(message: string, type: 'error' | 'success'): void {
    this.message.set(message);
    this.messageType.set(type);
  }

  handleRegister(): void {
    // Validate the form, save the user, and return to login.
    this.showMessage('', 'success');

    const nameParts = this.form.fullName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      this.showMessage('Enter your first and last name.', 'error');
      return;
    }
    if (this.form.username.trim().length < 3) {
      this.showMessage('Username must be at least 3 characters.', 'error');
      return;
    }
    if (!this.validateEmail(this.form.email)) {
      this.showMessage('Use a valid Gmail address ending with @gmail.com.', 'error');
      return;
    }
    if (!this.validatePassword(this.form.password)) {
      this.showMessage(
        'Password must be at least 5 characters and contain a letter and a number.',
        'error',
      );
      return;
    }
    if (!this.validateConfirmPassword()) {
      this.showMessage('Passwords do not match.', 'error');
      return;
    }
    if (!this.form.terms) {
      this.showMessage('You must accept the terms to continue.', 'error');
      return;
    }

    this.setLoading(true);
    this.authService.register(this.form).subscribe({
      next: () => {
        this.showMessage('Account created successfully.', 'success');
        this.setLoading(false);
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error: Error) => {
        this.setLoading(false);
        this.showMessage(error.message, 'error');
      },
    });
  }
}
