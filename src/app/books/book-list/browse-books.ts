import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { books ,book} from './book';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-browse-books',
  standalone:true,
  imports: [RouterLink,CommonModule],
  templateUrl: './browse-books.html',
  styleUrl: './browse-books.css',
})
export class browsebooks {
books:book[]=books;
filteredbooks:book[]=books;
selectedcategory='';
selectedprice='';

showbook1=true;
showbook2=true;
showbook3=true;
showbook4=true;
showbook5=true;
showbook6=true;

selectcategory(category:string){
  this.selectedcategory=category;
}
selectprice(price:string){
  this.selectedprice=price;
}

applyfilter(){
this.showbook1=this.checkbook(1);
this.showbook2=this.checkbook(2)
this.showbook3=this.checkbook(3);
this.showbook4=this.checkbook(4);
this.showbook5=this.checkbook(5);
this.showbook6=this.checkbook(6);


}
checkbook(id:number):boolean{
  const book=this.books.find(b=>b.id===id);
  if(!book){return false;}
let categorymatch=this.selectedcategory===''||book.category===this.selectedcategory;
    let pricematch=true;
    if(this.selectedprice==='200-400'){
      pricematch=book.price >=200 && book.price<=400;

    }
    if(this.selectedprice==='400-600'){
    pricematch=book.price>=400&&book.price <=600;
    }
    if(this.selectedprice==='600-800'){
      pricematch=book.price >=600&&book.price<=800;
    }
    return categorymatch && pricematch;
  };
}


