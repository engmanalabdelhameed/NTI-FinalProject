import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewsService } from '../../../services/reviews.service';


@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit {

  reviews: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewsService: ReviewsService
  ) {}

 ngOnInit() {

  console.log('REVIEWS LOADED');

  console.log('CURRENT ROUTE:', this.route);
  console.log('PARENT ROUTE:', this.route.parent);
  console.log('PARENT ID:', this.route.parent?.snapshot.paramMap.get('id'));

  const bookId = Number(
    this.route.parent?.snapshot.paramMap.get('id')
  );

  console.log('BOOK ID:', bookId);

  this.reviewsService.getBookReviews(bookId).subscribe({
    next: data => {
      console.log('REVIEWS FROM SERVICE:', data);
      this.reviews = data;
      console.log('REVIEWS ARRAY:', this.reviews);
    },

    error: error => {
      console.error('REVIEWS ERROR:', error);
    }
  });

}

}