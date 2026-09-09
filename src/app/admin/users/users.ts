import { Component, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../auth/core/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  // Admin users table state and data dependencies.
  users: User[] = [];

  loading = true;

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  constructor() {
    // Refresh the table whenever AuthService reports a user update.
    effect(() => {
      this.authService.usersVersion();
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    // Load the merged user collection for the admin table.
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      },
    });
  }

  getAdminCount(): number {
    return this.users.filter((user) => user.role === 'admin').length;
  }

  getUserCount(): number {
    return this.users.filter((user) => user.role === 'user').length;
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
