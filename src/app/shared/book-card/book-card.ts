import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  @Input() book!: Book;
  @Input() badge?: string;
  @Input() badgeType: 'normal' | 'new' | 'sale' = 'normal';
  @Input() isWishlisted: boolean = false;

  @Output() addToCart = new EventEmitter<Book>();
  @Output() wishlistClicked = new EventEmitter<Book>();

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  onAddToCart(): void {
    this.addToCart.emit(this.book);
  }

  onWishlistClick(): void {
    this.wishlistClicked.emit(this.book);
  }
}