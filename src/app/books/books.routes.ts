import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [

  // /books
  {
    path: '',
    loadComponent: () =>
      import('./book-list/browse-books')
        .then(m => m.browsebooks)
  },

  // /books/:id
  {
    path: ':id',
    loadComponent: () =>
      import('./book-info/book-info')
        .then(m => m.BookInfo),

    children: [

      // /books/:id
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },

      // /books/:id/details
      {
        path: 'details',
        loadComponent: () =>
          import('./book-info/book-details/book-details')
            .then(m => m.BookDetails)
      },

      // /books/:id/reviews
      {
        path: 'reviews',
        loadComponent: () =>
          import('./book-info/reviews/reviews')
            .then(m => m.Reviews)
      }

    ]
  }

];
