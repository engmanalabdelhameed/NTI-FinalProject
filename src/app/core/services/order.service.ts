import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUrl = 'Assets/data/orders.json';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getOrderById(id: number): Observable<Order | undefined> {
    return new Observable(observer => {
      this.getOrders().subscribe({
        next: (orders) => {
          const order = orders.find(o => o.id === id);

          observer.next(order);
          observer.complete();
        },

        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}