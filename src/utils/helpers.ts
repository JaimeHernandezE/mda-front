import { ApiError } from '../types/common';

// Format error messages from API responses
export const formatApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { data: any; status: number } }).response;
    return {
      message: response.data.message || 'An error occurred',
      status: response.status,
      errors: response.data.errors,
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

// Format date to local string
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 