import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthUser, LoginRequest, RegisterRequest, StoredUser } from './models/auth.model';

const TOKEN_KEY = 'booknest_auth_token';
const USER_KEY = 'booknest_auth_user';
const REGISTERED_USERS_KEY = 'booknest_registered_users';
const PROFILE_OVERRIDES_KEY = 'booknest_profile_overrides';
const PASSWORD_OVERRIDES_KEY = 'booknest_password_overrides';
const LAST_ACTIVITY_KEY = 'booknest_last_activity';
const USERS_URL = 'Assets/data/users.json';
const IDLE_TIMEOUT = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Core authentication dependencies and reactive session state.
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentUser = signal<AuthUser | null>(this.loadUser());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly usersVersion = signal(0);

  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private activityHandler: (() => void) | null = null;

  constructor() {
    this.startSessionMonitor();
  }

  // Authenticate an existing user and create a session.
  login(credentials: LoginRequest): Observable<AuthUser> {
    return this.loadUsers().pipe(
      map((users) =>
        users.find(
          (user) =>
            (user.username.toLowerCase() === credentials.username.trim().toLowerCase() ||
              user.email.toLowerCase() === credentials.username.trim().toLowerCase()) &&
            user.password === credentials.password,
        ),
      ),
      switchMap((user) =>
        user
          ? this.startSession(user)
          : throwError(() => new Error('Username or password is incorrect.')),
      ),
      catchError((error) =>
        throwError(
          () =>
            new Error(
              error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
            ),
        ),
      ),
    );
  }

  // Create a regular user without logging them in automatically.
  register(request: RegisterRequest): Observable<AuthUser> {
    return this.loadUsers().pipe(
      switchMap((users) => {
        const usernameTaken = users.some(
          (user) => user.username.toLowerCase() === request.username.trim().toLowerCase(),
        );
        const emailTaken = users.some(
          (user) => user.email.toLowerCase() === request.email.trim().toLowerCase(),
        );

        if (usernameTaken) {
          return throwError(() => new Error('This username is already in use.'));
        }
        if (emailTaken) {
          return throwError(() => new Error('This email is already registered.'));
        }

        if (request.username.trim().toLowerCase() === 'admin') {
          return throwError(
            () => new Error('The admin account can only be created by the system.'),
          );
        }

        const names = request.fullName.trim().split(/\s+/);
        const newUser: StoredUser = {
          id: Math.max(0, ...users.map((user) => user.id)) + 1,
          username: request.username.trim(),
          password: request.password,
          role: 'user',
          firstName: names[0] ?? '',
          lastName: names.slice(1).join(' '),
          email: request.email.trim(),
        };

        const registeredUsers = this.readRegisteredUsers();
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...registeredUsers, newUser]));
        this.usersVersion.update((version) => version + 1);
        return new Observable<AuthUser>((subscriber) => {
          subscriber.next(this.toAuthUser(newUser));
          subscriber.complete();
        });
      }),
    );
  }

  // Check whether an account exists for password recovery.
  forgotPassword(identifier: string): Observable<string> {
    return this.loadUsers().pipe(
      map((users) =>
        users.some(
          (user) =>
            user.username.toLowerCase() === identifier.trim().toLowerCase() ||
            user.email.toLowerCase() === identifier.trim().toLowerCase(),
        ),
      ),
      switchMap((found) =>
        found
          ? new Observable<string>((subscriber) => {
              subscriber.next('If the account exists, reset instructions are ready to be sent.');
              subscriber.complete();
            })
          : throwError(() => new Error('No account was found for that username or email.')),
      ),
    );
  }

  // Find an account by Gmail and save its new password locally.
  accountExists(email: string): Observable<boolean> {
    return this.loadUsers().pipe(
      map((users) => users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())),
    );
  }

  // Replace an existing password in the local data source.
  resetPassword(email: string, newPassword: string): Observable<void> {
    return this.loadUsers().pipe(
      map((users) => users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase())),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('No account was found for this Gmail address.'));
        }

        const registeredUsers = this.readRegisteredUsers();
        const registeredIndex = registeredUsers.findIndex((item) => item.id === user.id);

        if (registeredIndex >= 0) {
          registeredUsers[registeredIndex] = {
            ...registeredUsers[registeredIndex],
            password: newPassword,
          };
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
        } else {
          const passwordOverrides = this.readPasswordOverrides();
          passwordOverrides[String(user.id)] = newPassword;
          localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(passwordOverrides));
        }

        this.usersVersion.update((version) => version + 1);
        return new Observable<void>((subscriber) => {
          subscriber.next();
          subscriber.complete();
        });
      }),
    );
  }

  // Clear the current session and return to login.
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    this.stopSessionMonitor();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  // Persist editable profile fields and notify dependent screens.
  updateProfile(
    changes: Partial<
      Pick<AuthUser, 'firstName' | 'lastName' | 'username' | 'email' | 'phone' | 'address'>
    >,
  ): AuthUser | null {
    const user = this.currentUser();
    if (!user) return null;

    const updatedUser: AuthUser = { ...user, ...changes };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    this.currentUser.set(updatedUser);

    const registeredUsers = this.readRegisteredUsers();
    const registeredIndex = registeredUsers.findIndex((item) => item.id === user.id);
    if (registeredIndex >= 0) {
      registeredUsers[registeredIndex] = { ...registeredUsers[registeredIndex], ...changes };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    } else {
      const overrides = this.readProfileOverrides();
      overrides[String(user.id)] = { ...overrides[String(user.id)], ...changes };
      localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    this.usersVersion.update((version) => version + 1);
    this.touchSession();
    return updatedUser;
  }

  // Expose the current token to the HTTP interceptor.
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Merge bundled users, registered users, and profile overrides.
  private loadUsers(): Observable<StoredUser[]> {
    return this.http.get<StoredUser[]>(USERS_URL).pipe(
      map((users) =>
        [...users, ...this.readRegisteredUsers()].map((user) => ({
          ...user,
          password: this.readPasswordOverrides()[String(user.id)] ?? user.password,
          ...this.readProfileOverrides()[String(user.id)],
        })),
      ),
      catchError(() => throwError(() => new Error('Could not load the user database.'))),
    );
  }

  // Store a safe user session without persisting the password.
  private startSession(user: StoredUser): Observable<AuthUser> {
    const safeUser = this.toAuthUser(user);
    localStorage.setItem(TOKEN_KEY, this.createToken(safeUser));
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    this.currentUser.set(safeUser);
    this.touchSession();
    this.stopSessionMonitor();
    this.startSessionMonitor();
    return new Observable<AuthUser>((subscriber) => {
      subscriber.next(safeUser);
      subscriber.complete();
    });
  }

  // Remove credentials before exposing the user to the app.
  private toAuthUser(user: StoredUser): AuthUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  // Read users created through the client-side registration flow.
  private readRegisteredUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) ?? '[]') as StoredUser[];
    } catch {
      return [];
    }
  }

  // Read profile changes that override bundled JSON data.
  private readProfileOverrides(): Record<string, Partial<AuthUser>> {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_OVERRIDES_KEY) ?? '{}') as Record<
        string,
        Partial<AuthUser>
      >;
    } catch {
      return {};
    }
  }

  // Read password changes for users defined in the bundled JSON file.
  private readPasswordOverrides(): Record<string, string> {
    try {
      return JSON.parse(localStorage.getItem(PASSWORD_OVERRIDES_KEY) ?? '{}') as Record<
        string,
        string
      >;
    } catch {
      return {};
    }
  }

  // Restore a session only while its activity window is valid.
  private loadUser(): AuthUser | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as AuthUser | null;
      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
      return token && user && lastActivity && Date.now() - lastActivity < IDLE_TIMEOUT
        ? user
        : null;
    } catch {
      return null;
    }
  }

  // Create the local mock token used by the interceptor.
  private createToken(user: AuthUser): string {
    return `mock.${btoa(JSON.stringify({ sub: user.id, role: user.role }))}.${Date.now()}`;
  }

  // Start inactivity tracking for an active session.
  private startSessionMonitor(): void {
    if (!this.currentUser()) return;

    this.activityHandler = () => this.touchSession();
    for (const eventName of ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']) {
      window.addEventListener(eventName, this.activityHandler, { passive: true });
    }
    this.scheduleIdleLogout();
  }

  // Remove inactivity listeners and timers.
  private stopSessionMonitor(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.activityHandler) {
      for (const eventName of ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']) {
        window.removeEventListener(eventName, this.activityHandler);
      }
    }
    this.idleTimer = null;
    this.activityHandler = null;
  }

  // Refresh the inactivity window after user activity.
  private touchSession(): void {
    if (!this.currentUser()) return;
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    this.scheduleIdleLogout();
  }

  // Schedule automatic logout after five minutes of inactivity.
  private scheduleIdleLogout(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.logout(), IDLE_TIMEOUT);
  }
}
