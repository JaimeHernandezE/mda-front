import { Project } from './project.types';

export interface ArchitectureProject {
  id: number;
  created: string;
  modified: string;
  project: number;
  architecture_project_name: string | null;
  architecture_project_description: string | null;
  is_active: boolean;
  start_date: string | null;
  permit_subtype: number | null;
  permit_subtype_name: string | null;
}

export interface CreateArchitectureProjectDto {
  project: number;
  architecture_project_name?: string;
  architecture_project_description?: string;
  is_active?: boolean;
  start_date?: string;
  permit_subtype?: number;
}

export interface UpdateArchitectureProjectDto extends Partial<CreateArchitectureProjectDto> {}

// Tipos para los permisos
export interface PermitSubTypeItem {
  id: number;
  permit_sub_type: string;
}

export interface PermitTypeSubtypes {
  [group: string]: PermitSubTypeItem[];
}

export interface PermitType {
  id: number;
  permit_type: string;
  subtypes: PermitTypeSubtypes;
} 