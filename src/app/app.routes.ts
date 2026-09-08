import { Routes } from '@angular/router';


export const routes: Routes = [
    
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.Home)
  },

  {
    path: 'books',
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
    loadComponent: () =>
      import('./cart/cart').then(m => m.Cart)
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout').then(m => m.Checkout)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.Profile)
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders').then(m => m.Orders)
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist').then(m => m.Wishlist)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
  path: 'about',
  loadComponent: () =>
    import('./about/about').then(m => m.About)
    },

  {
    path: '**',
    redirectTo: ''
  }
];