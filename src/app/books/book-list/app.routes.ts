import { Routes } from '@angular/router';

export const routes: Routes = [{
path:"browse-books",
 loadComponent : ()=>
    import('./browse-books/browse-books').then(m=>m.browsebooks)
},
{
path:'book-details/:id',
loadComponent:()=>import('./book-details/book-details').then(m=>m.bookdetails)

},
{
    path:'',
    redirectTo:'browse-books',
    pathMatch:'full'
}
];
