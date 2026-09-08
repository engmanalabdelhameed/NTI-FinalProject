export interface OrderItem {
  bookId: number;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
}

export interface Order {
  id: number;
  userId: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}