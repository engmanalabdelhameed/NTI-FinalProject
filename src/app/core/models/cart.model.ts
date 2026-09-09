export interface CartItem {
  bookId: number;
  quantity: number;
}

export interface Cart {
  userId: number;
  items: CartItem[];
}