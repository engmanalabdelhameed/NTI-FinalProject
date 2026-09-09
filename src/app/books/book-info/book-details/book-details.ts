import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  books: Book[] = [];
  book: any = null;

  count: number = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Load books from JSON
    this.bookService.getBooks().subscribe({
      next: (books) => {

        this.books = books;

        // The :id is in the PARENT route
        this.route.parent?.params.subscribe(params => {

          const id = Number(params['id']);

          console.log('Book ID:', id);

          this.book = this.books.find(
            book => book.id === id
          );

          console.log('Selected book:', this.book);

          this.cdr.detectChanges();
        });
      },

      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
}