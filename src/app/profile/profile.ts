import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from '../auth/core/auth.service';
import { Book } from '../core/models/book.model';
import { Order } from '../core/models/order.model';

interface WishlistEntry {
  userId: number;
  bookIds: number[];
}

interface ProfileStats {
  first: number;
  second: number;
  third: number;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // Profile dependencies and reactive dashboard state.
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly currentUser = this.authService.user;
  readonly books = signal<Book[]>([]);
  readonly stats = signal<ProfileStats>({ first: 0, second: 0, third: 0 });
  readonly featuredBooks = signal<Book[]>([]);
  readonly editing = signal(false);
  readonly saveMessage = signal('');

  draft = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: '',
  };

  constructor() {
    // Prepare the form and load activity data for the current user.
    this.resetDraft();
    this.loadProfileActivity();
  }

  startEditing(): void {
    // Copy the saved profile into the editable draft.
    this.resetDraft();
    this.saveMessage.set('');
    this.editing.set(true);
  }

  cancelEditing(): void {
    // Discard unsaved changes and restore the saved profile.
    this.resetDraft();
    this.editing.set(false);
    this.saveMessage.set('');
  }

  saveProfile(): void {
    // Validate and persist profile changes through AuthService.
    if (!this.draft.firstName.trim() || !this.draft.username.trim() || !this.draft.email.trim()) {
      this.saveMessage.set('First name, username, and email are required.');
      return;
    }

    const updatedUser = this.authService.updateProfile({
      firstName: this.draft.firstName.trim(),
      lastName: this.draft.lastName.trim(),
      username: this.draft.username.trim(),
      email: this.draft.email.trim(),
      phone: this.draft.phone.trim(),
      address:
        this.draft.street.trim() ||
        this.draft.city.trim() ||
        this.draft.state.trim() ||
        this.draft.country.trim()
          ? {
              street: this.draft.street.trim(),
              city: this.draft.city.trim(),
              state: this.draft.state.trim(),
              country: this.draft.country.trim(),
            }
          : undefined,
    });

    if (updatedUser) {
      this.editing.set(false);
      this.saveMessage.set('Profile updated successfully.');
    }
  }

  private resetDraft(): void {
    // Synchronize the form draft with the active session.
    const user = this.currentUser();
    if (!user) return;
    this.draft = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone ?? '',
      street: user.address?.street ?? '',
      city: user.address?.city ?? '',
      state: user.address?.state ?? '',
      country: user.address?.country ?? '',
    };
  }

  get initials(): string {
    const user = this.currentUser();
    return `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  }

  get fullName(): string {
    const user = this.currentUser();
    return (
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.username ||
      'BookNest reader'
    );
  }

  get isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  get statLabels(): [string, string, string] {
    return this.isAdmin
      ? ['Total books', 'Total orders', 'Users']
      : ['Books in orders', 'Total orders', 'Wishlist'];
  }

  private loadProfileActivity(): void {
    // Load catalog data used by the profile dashboard.
    this.http
      .get<Book[]>('Assets/data/books.json')
      .pipe(catchError(() => of([])))
      .subscribe((books) => {
        this.books.set(books);
        this.loadActivity(books);
      });
  }

  private loadActivity(books: Book[]): void {
    // Build user or admin statistics from project data files.
    this.http
      .get<Order[]>('Assets/data/orders.json')
      .pipe(catchError(() => of([])))
      .subscribe((orders) => {
        this.http
          .get<WishlistEntry[]>('Assets/data/wishlist.json')
          .pipe(catchError(() => of([])))
          .subscribe((wishlists) => {
            const userId = this.currentUser()?.id;
            const userOrders = this.isAdmin
              ? orders
              : orders.filter((order) => order.userId === userId);
            const wishlist = wishlists.find((entry) => entry.userId === userId)?.bookIds ?? [];
            const bookIds = this.isAdmin
              ? books.slice(0, 6).map((book) => book.id)
              : [...new Set(userOrders.flatMap((order) => order.items.map((item) => item.bookId)))];

            if (this.isAdmin) {
              this.http
                .get<unknown[]>('Assets/data/users.json')
                .pipe(catchError(() => of([])))
                .subscribe((users) => {
                  this.stats.set({
                    first: books.length,
                    second: orders.length,
                    third: users.length,
                  });
                });
            } else {
              this.stats.set({
                first: userOrders.reduce(
                  (total, order) =>
                    total + order.items.reduce((sum, item) => sum + item.quantity, 0),
                  0,
                ),
                second: userOrders.length,
                third: wishlist.length,
              });
            }
            this.featuredBooks.set(books.filter((book) => bookIds.includes(book.id)).slice(0, 6));
          });
      });
  }
}
