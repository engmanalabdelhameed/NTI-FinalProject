import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'Assets/data/users.json';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUserById(id: number): Observable<User | undefined> {
    return new Observable(observer => {
      this.getUsers().subscribe({
        next: (users) => {
          const user = users.find(u => u.id === id);

          observer.next(user);
          observer.complete();
        },

        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}