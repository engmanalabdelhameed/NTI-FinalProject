export interface User {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'admin';

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  profileImage: string;

  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };

  createdAt: string;
}