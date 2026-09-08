import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  currentUserId = 4;

  currentUser: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
  this.http.get<any[]>('Assets/data/users.json').subscribe({
    next: (users) => {
      console.log('Users loaded:', users);
      console.log('All IDs:', users.map(user => user.id));
      console.log('Current User ID:', this.currentUserId);

      this.currentUser = users.find(
        user => Number(user.id) === Number(this.currentUserId)
      );

      console.log('Current user:', this.currentUser);
    },

    error: (error) => {
      console.error('Error loading users:', error);
    }
  });
  }
}