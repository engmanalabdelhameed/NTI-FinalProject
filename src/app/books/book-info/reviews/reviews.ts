import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../../services/reviews.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit {

  @Input() bookId!: number;

  reviews: any[] = [];

  selectedRating = 0;
  reviewText = '';

  constructor(
    private reviewsService: ReviewsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    console.log('BOOK ID:', this.bookId);

    this.loadReviews();
  }

  loadReviews() {

    this.reviewsService.getBookReviews(this.bookId).subscribe({
      next: (data) => {

        console.log('REVIEWS FROM SERVICE:', data);

        this.reviews = data;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('REVIEWS ERROR:', error);
      }
    });
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  submitReview() {

    const newReview = {
      bookId: this.bookId,
      userId: 2,
      rating: this.selectedRating,
      comment: this.reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    this.reviewsService.addReview(newReview).subscribe({
      next: (review) => {

        this.reviews.push(review);

        this.selectedRating = 0;
        this.reviewText = '';

        this.cdr.detectChanges();

        console.log('Review added:', review);
      },

      error: (error) => {
        console.error('ADD REVIEW ERROR:', error);
      }
    });
  }
}