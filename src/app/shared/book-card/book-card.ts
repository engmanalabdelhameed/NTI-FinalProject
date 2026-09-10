import { Component, Input } from '@angular/core';
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

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}