import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { books, book } from './book';

@Component({
  selector: 'app-browse-books',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css'
})
export class browsebooks {

  books: book[] = books;

  // Books currently shown on the page
  filteredbooks: book[] = books;

  searchText = '';

  selectedcategory = '';
  selectedprice = '';

  selectcategory(category: string) {
    this.selectedcategory = category;
  }

  selectprice(price: string) {
    this.selectedprice = price;
  }

  applyfilter() {

    this.filteredbooks = this.books.filter(book => {

      // Category filter
      const categoryMatch =
        this.selectedcategory === '' ||
        book.category === this.selectedcategory;

      // Price filter
      let priceMatch = true;

      if (this.selectedprice === '200-400') {
        priceMatch = book.price >= 200 && book.price <= 400;
      }

      if (this.selectedprice === '400-600') {
        priceMatch = book.price >= 400 && book.price <= 600;
      }

      if (this.selectedprice === '600-800') {
        priceMatch = book.price >= 600 && book.price <= 800;
      }

      // Search filter
      const searchMatch =
        this.searchText === '' ||
        book.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.category.toLowerCase().includes(this.searchText.toLowerCase());

      return categoryMatch && priceMatch && searchMatch;
    });
  }

  searchBooks() {
    this.applyfilter();
  }

  clearFilters() {
    this.selectedcategory = '';
    this.selectedprice = '';
    this.searchText = '';

    this.filteredbooks = this.books;
  }
}
