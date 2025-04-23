import { Region, Comuna } from './region.types';

export interface University {
  id: number;
  name: string;
  region: Region;
  type: 'publica' | 'privada';
}

export interface Profession {
  id: number;
  profession: string;
  university: University;
}

export interface User {
  identifier: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  rut: string | null;
  score: number;
  profession: Profession[];
  address: string | null;
  address_number: string | null;
  comuna: Comuna | null;
  region: Region | null;
  phone: number | null;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  mail: string | null;
  owner: User;
  partner: User[];
  rut: string | null;
  address: string | null;
  address_number: string | null;
  comuna: Comuna | null;
  region: Region | null;
  phone: number | null;
}

export interface Score {
  id: number;
  score: number;
  comment: string;
  user_owner: User;
  user_writer: User;
}

export interface Patent {
  id: number;
  name: string;
  description: string | null;
  profession: Profession;
  user_owner: User;
  number: number;
  category: string;
  validity_date: string | null;
  comuna: Comuna;
  document: string | null;
}

export interface Role {
  id: number;
  role: 'Propietario/a' | 'Arquitecto' | 'Constructor' | 'Revisor independiente' | 'Calculista' | 'Revisor de Cálculo' | 'Coordinador';
} 