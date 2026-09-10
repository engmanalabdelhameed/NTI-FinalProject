import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookService } from '../core/services/book.service';
import { Book } from '../core/models/book.model';
import { BookCard } from '../shared/book-card/book-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookCard
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  // First 4 books from books.json
  featuredBooks: Book[] = [];

  categories = [
    { name: 'Fiction' },
    { name: 'Programming' },
    { name: 'Self Development' },
    { name: 'Business' },
    { name: 'Science' },
    { name: 'Romance' }
  ];

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.bookService.getBooks().subscribe({

      next: (books) => {

        // Take the first 4 books
        this.featuredBooks = books.slice(0, 4);

        // Force the template to update
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load books:', err);

        this.cdr.detectChanges();
      }

    });

  }
}