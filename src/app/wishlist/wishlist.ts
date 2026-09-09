import { Component } from '@angular/core';
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

  constructor(private wishlistService: WishlistService) {}

 ngOnInit() {
  console.log('Wishlist component loaded');

  this.wishlistService.getWishlistBooks(2).subscribe(data => {
    console.log('Wishlist data:', data);

    this.books = data;

    console.log('Length:', this.books.length);

    console.log('Books after update:', this.books);
  });
}

removeBook(bookId: number) {
  this.books = this.books.filter(book => book.id !== bookId);
}

clearWishlist() {
  this.books = [];
}

}
