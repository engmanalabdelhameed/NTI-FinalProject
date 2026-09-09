// Credentials submitted by the login form.
export interface LoginRequest {
  username: string;
  password: string;
}

// Account data submitted by the registration form.
export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Safe user data exposed to the application session.
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  profileImage?: string;
  phone?: string;
  createdAt?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

// User data stored in the local mock data source.
export interface StoredUser extends AuthUser {
  password: string;
}
