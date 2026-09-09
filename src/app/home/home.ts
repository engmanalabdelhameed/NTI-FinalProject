import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../core/services/book.service';
import { Book } from '../core/models/book.model';
import { BookCard } from '../shared/book-card/book-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featuredBooks: Book[] = [];
  bestSellers: Book[] = [];
  newArrivals: Book[] = [];

  categories = [
    { name: 'Fiction' },
    { name: 'Programming' },
    { name: 'Self Development' },
    { name: 'Business' },
    { name: 'Science' },
    { name: 'Romance' }
  ];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books.slice(0, 4);
        this.bestSellers = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
        this.newArrivals = [...books].sort((a, b) => b.publishedYear - a.publishedYear).slice(0, 4);
      },
      error: (err) => {
        console.error('Failed to load books:', err);
      }
    });
  }
}
