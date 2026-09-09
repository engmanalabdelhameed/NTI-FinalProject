export interface OrderItem {
  bookId: number;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface Order {
  id: number;
  userId: number;
  date: string;

  status:
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';

  paymentStatus:
    | 'Pending'
    | 'Paid'
    | 'Failed'
    | 'Refunded';

  paymentMethod: string;
  shippingMethod: string;

  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;

  trackingNumber: string | null;
  estimatedDelivery: string | null;

  items: OrderItem[];
  shippingAddress: ShippingAddress;
}