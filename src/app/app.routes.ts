import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './auth/core/auth.guard';


export const routes: Routes = [
    
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home').then(m => m.Home)
  },

  {
    path: 'books',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./books/books.routes').then(m => m.BOOKS_ROUTES)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./cart/cart').then(m => m.Cart)
  },

  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./checkout/checkout').then(m => m.Checkout)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  },

  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./orders/orders').then(m => m.Orders)
  },

  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./wishlist/wishlist').then(m => m.Wishlist)
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
  path: 'about',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./about/about').then(m => m.About)
    },

  {
    path: '**',
    redirectTo: ''
  }
];