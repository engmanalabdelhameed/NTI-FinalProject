import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksUrl = 'Assets/data/books.json';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl);
  }

  getBookById(id: number): Observable<Book | undefined> {
    return new Observable(observer => {

      this.getBooks().subscribe(books => {

        const book = books.find(b => b.id === id);

        observer.next(book);
        observer.complete();

      });

    });
  }
}