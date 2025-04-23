import { User } from './user.types';
import { Region, Comuna } from './region.types';

export interface Property {
  id: number;
  name: string;
  rol: string;
  description: string;
  owner: User | null;
  address: string;
  region: Region | null;
  comuna: Comuna | null;
  localidad: string | null;
  block: string | null;
  allotment: string | null;
  neighborhood: string | null;
  subdivision_plan: string | null;
}

export interface BuildingPermit {
  id: number;
  property: Property;
  permit_date: string;
  permit_number: string;
  file: string | null;
  land_area: number | null;
  type: 'Obra Menor' | 'Anteproyecto' | 'Obra Nueva';
  permit_comment: string | null;
}

export interface BuildingReception {
  id: number;
  property: Property;
  reception_number: string;
  reception_date: string;
  partial_reception: boolean;
  building_permit: BuildingPermit | null;
  file: string | null;
  land_area: number | null;
  reception_comment: string | null;
}

export interface BaseCertificate {
  id: number;
  property: Property;
  certificate_number: string;
  certificate_date: string;
  file: string | null;
  certificate_comment: string | null;
}

export interface WaterCertificate extends BaseCertificate {}

export interface ElectricCertificate extends BaseCertificate {}

export interface GasCertificate extends BaseCertificate {}

export interface OtherCertificate extends BaseCertificate {
  certificate_name: string;
}

export interface CountyRecorder {
  id: number;
  name: string;
  comuna: Comuna;
}

export interface OwnershipCertificate {
  id: number;
  property: Property;
  county_recorder: CountyRecorder;
  type: 'Hipotecas y Gravámenes' | 'Propiedad' | 'Prohibiciones';
  leaves: string;
  number: string;
  year: string;
  file: string | null;
  certificate_comment: string | null;
} 