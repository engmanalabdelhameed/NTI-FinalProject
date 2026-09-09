import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {

  constructor(private http: HttpClient) {}

  getReviews() {
    return this.http.get<any[]>('assets/data/reviews.json');
  }

  getBookReviews(bookId: number) {
    return this.getReviews().pipe(
      map(reviews =>
        reviews.filter(review => review.bookId === bookId)
      )
    );
  }

}