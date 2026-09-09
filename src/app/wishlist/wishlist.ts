import { Component, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {

  books: any[] = [];

  userId = 2;

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    console.log('Wishlist component loaded');

    this.loadWishlist();

  }

  loadWishlist() {

    this.wishlistService.getWishlistBooks(this.userId).subscribe(data => {

      console.log('Wishlist data:', data);

      this.books = data;

      console.log('Length:', this.books.length);

      this.cdr.detectChanges();

    });

  }

  removeBook(bookId: number) {

    this.wishlistService
      .removeFromWishlist(this.userId, bookId)
      .subscribe(() => {

        this.books = this.books.filter(
          book => book.id !== bookId
        );

        this.cdr.detectChanges();

      });

  }

  clearWishlist() {

    this.wishlistService
      .clearWishlist(this.userId)
      .subscribe(() => {

        this.books = [];

        this.cdr.detectChanges();

      });

  }

}