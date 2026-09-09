import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [

  {
    path: '',

    loadComponent: () =>
      import('./admin')
        .then(m => m.Admin),

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',

        loadComponent: () =>
          import('./dashboard/dashboard')
            .then(m => m.Dashboard)
      },

      {
        path: 'books',

        loadComponent: () =>
          import('./books/books')
            .then(m => m.Books)
      },

      {
        path: 'users',

        loadComponent: () =>
          import('./users/users')
            .then(m => m.Users)
      },

      {
        path: 'orders',

        loadComponent: () =>
          import('./orders/orders')
            .then(m => m.Orders)
      }

    ]
  }

];