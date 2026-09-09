import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'Assets/data/users.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Merge bundled users with client-created users and profile overrides.
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users) => {
        const localUsers = this.readLocalUsers();
        const overrides = this.readProfileOverrides();

        return [...users, ...localUsers].map((user) => ({
          ...user,
          ...overrides[String(user.id)],
        }));
      }),
    );
  }

  getUserById(id: number): Observable<User | undefined> {
    return new Observable((observer) => {
      this.getUsers().subscribe({
        next: (users) => {
          const user = users.find((u) => u.id === id);

          observer.next(user);
          observer.complete();
        },

        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  private readLocalUsers(): User[] {
    // Read users created through registration.
    try {
      return JSON.parse(localStorage.getItem('booknest_registered_users') ?? '[]') as User[];
    } catch {
      return [];
    }
  }

  private readProfileOverrides(): Record<string, Partial<User>> {
    // Read profile updates stored by AuthService.
    try {
      return JSON.parse(localStorage.getItem('booknest_profile_overrides') ?? '{}') as Record<
        string,
        Partial<User>
      >;
    } catch {
      return {};
    }
  }
}
