import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookService } from './book.service';
import { switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  constructor(
    private http: HttpClient,
    private bookService: BookService
  ) {}

  getWishlist() {
    return this.http.get<any[]>(
      'http://localhost:3000/api/wishlist'
    );
  }

  getWishlistBooks(userId: number) {
    return this.getWishlist().pipe(
      switchMap(wishlists => {

        const userWishlist = wishlists.find(
          wishlist => wishlist.userId === userId
        );

        return this.bookService.getBooks().pipe(
          map(books =>
            books.filter(book =>
              userWishlist?.bookIds.includes(book.id)
            )
          )
        );
      })
    );
  }

  addToWishlist(userId: number, bookId: number) {
    return this.http.post(
      'http://localhost:3000/api/wishlist',
      {
        userId: userId,
        bookId: bookId
      }
    );
  }

  removeFromWishlist(userId: number, bookId: number) {
    return this.http.delete(
      `http://localhost:3000/api/wishlist/${userId}/${bookId}`
    );
  }

  clearWishlist(userId: number) {
    return this.http.delete(
      `http://localhost:3000/api/wishlist/${userId}`
    );
  }
}