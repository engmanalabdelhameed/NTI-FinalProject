import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Book } from '../../core/models/book.model';
import { Order } from '../../core/models/order.model';

import { BookService } from '../../core/services/book.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [CurrencyPipe, DatePipe],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  books: Book[] = [];

  orders: Order[] = [];

  totalUsers = 0;
  totalBooks = 0;
  totalOrders = 0;
  totalSales = 0;

  deliveredOrders = 0;
  processingOrders = 0;
  shippedOrders = 0;
  cancelledOrders = 0;

  salesByMonth: {
    month: string;
    sales: number;
  }[] = [];

  topBooks: {
    title: string;
    quantity: number;
  }[] = [];

  maxMonthlySales = 0;
  maxBookSales = 0;

  loading = true;

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;

        this.totalBooks = books.length;

        this.calculateTopBooks();
      },

      error: (error) => {
        console.error('Error loading books:', error);
      },
    });

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },

      error: (error) => {
        console.error('Error loading users:', error);
      },
    });

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.totalOrders = orders.length;

        this.calculateSales();
        this.calculateOrderStatuses();
        this.calculateMonthlySales();
        this.calculateTopBooks();

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  calculateSales(): void {
    this.totalSales = this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  calculateOrderStatuses(): void {
    this.deliveredOrders = this.orders.filter((order) => order.status === 'Delivered').length;

    this.processingOrders = this.orders.filter((order) => order.status === 'Processing').length;

    this.shippedOrders = this.orders.filter((order) => order.status === 'Shipped').length;

    this.cancelledOrders = this.orders.filter((order) => order.status === 'Cancelled').length;
  }

  calculateMonthlySales(): void {
    const monthlySales: {
      [key: string]: number;
    } = {};

    this.orders.forEach((order) => {
      const date = new Date(order.date);

      if (isNaN(date.getTime())) {
        return;
      }

      const month = date.toLocaleString('en-US', { month: 'short' });

      monthlySales[month] = (monthlySales[month] || 0) + order.total;
    });

    this.salesByMonth = Object.entries(monthlySales).map(([month, sales]) => ({
      month,
      sales,
    }));

    this.salesByMonth.sort((a, b) => {
      const monthA = new Date(`${a.month} 1, 2026`).getMonth();

      const monthB = new Date(`${b.month} 1, 2026`).getMonth();

      return monthA - monthB;
    });

    this.maxMonthlySales = Math.max(...this.salesByMonth.map((item) => item.sales), 1);
  }

  calculateTopBooks(): void {
    const bookSales: {
      [key: number]: number;
    } = {};

    this.orders.forEach((order) => {
      order.items.forEach((item) => {
        bookSales[item.bookId] = (bookSales[item.bookId] || 0) + item.quantity;
      });
    });

    this.topBooks = Object.entries(bookSales)

      .map(([bookId, quantity]) => {
        const book = this.books.find((b) => b.id === Number(bookId));

        return {
          title: book ? book.title : `Book #${bookId}`,

          quantity,
        };
      })

      .sort((a, b) => b.quantity - a.quantity)

      .slice(0, 5);

    this.maxBookSales = Math.max(...this.topBooks.map((book) => book.quantity), 1);
  }

  getBarHeight(value: number): number {
    if (this.maxMonthlySales === 0) {
      return 0;
    }

    return Math.max(5, (value / this.maxMonthlySales) * 100);
  }

  getBookBarWidth(value: number): number {
    if (this.maxBookSales === 0) {
      return 0;
    }

    return (value / this.maxBookSales) * 100;
  }

  getRecentOrders(): Order[] {
    return [...this.orders]

      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      .slice(0, 5);
  }

  getLowStockBooks(): Book[] {
    return this.books

      .filter((book) => book.stock <= 5)

      .sort((a, b) => a.stock - b.stock)

      .slice(0, 5);
  }
}
