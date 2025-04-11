// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Common Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  dateJoined: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 