export interface Review {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  comment: string;
  date: string;
}