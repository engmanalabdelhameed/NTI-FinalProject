import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Reviews } from '../reviews/reviews';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RouterLink, Reviews],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  books: Book[] = [];
  book: any = null;

  count: number = 0;

  userId = 2;

  showReviews = false;
  wishlistAdded = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.bookService.getBooks().subscribe({
      next: (books) => {

        this.books = books;

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

  addToWishlist(): void {

    if (!this.book) {
      return;
    }

    this.wishlistService
      .addToWishlist(this.userId, this.book.id)
      .subscribe({
        next: (response) => {

          console.log('Book added to wishlist:', response);

          this.wishlistAdded = true;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('ADD TO WISHLIST ERROR:', error);
        }
      });
  }

  showBookReviews(): void {
    this.showReviews = true;
  }
}