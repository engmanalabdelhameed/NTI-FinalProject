import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookService } from './book.service';
import { switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http: HttpClient, private bookService: BookService) {}

   getWishlist() {
    return this.http.get<any[]>('assets/data/wishlist.json');
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

}



