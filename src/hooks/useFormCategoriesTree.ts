import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export interface FormType {
  id: number;
  name: string;
  description: string | null;
  model_name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  children: Category[];
  form_types: FormType[];
  parent_name?: string;
}

export const useFormCategoriesTree = (search?: string) => {
  const { accessToken } = useAuth();
  const axiosConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const query = useQuery({
    queryKey: ['formCategoriesTree', search, accessToken],
    queryFn: async () => {
      const url = search
        ? `${API_URL}/categories/search/?q=${encodeURIComponent(search)}`
        : `${API_URL}/categories/tree/`;
      const response = await axios.get<Category[]>(url, axiosConfig);
      return response.data;
    },
    enabled: !!accessToken,
  });

  return {
    categories: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}; 