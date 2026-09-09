import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',

  standalone: true,

  imports: [
    CurrencyPipe,
    DatePipe
  ],

  templateUrl: './orders.html',

  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: Order[] = [];

  loading = true;


  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.orderService.getOrders().subscribe({

      next: (orders) => {
        this.orders = [...orders].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;

        this.cdr.detectChanges();
      }
    });

  }


  getTotalSales(): number {

    return this.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

  }


  getStatusCount(
    status: Order['status']
  ): number {

    return this.orders.filter(
      order => order.status === status
    ).length;

  }


  getItemsCount(order: Order): number {

    return order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  }

}