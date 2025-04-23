import { User } from './user.types';
import { Property } from './property.types';

export interface Project {
  id: number;
  project_name: string;
  project_description: string;
  property?: Property;
  project_owner: User;
  is_active: boolean;
  created: string;
  modified: string;
}

export interface CreateProjectDto {
  project_name: string;
  project_description: string;
  property?: number;
  is_active?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface ProjectCollaborator {
  id: number;
  project: number;
  collaborator: User;
  role?: number;
  can_edit: boolean;
  company?: number;
  is_legal_rep: boolean;
  created: string;
  modified: string;
}

export interface CreateProjectCollaboratorDto {
  project: number;
  collaborator: number;
  role?: number;
  can_edit?: boolean;
  company?: number;
  is_legal_rep?: boolean;
}

export interface UpdateProjectCollaboratorDto extends Partial<CreateProjectCollaboratorDto> {}

export interface ArchitectureProject {
  id: number;
  project: number;
  architecture_project_name?: string;
  architecture_project_description?: string;
  is_active: boolean;
  start_date?: string;
  created: string;
  modified: string;
}

export interface CreateArchitectureProjectDto {
  project: number;
  architecture_project_name?: string;
  architecture_project_description?: string;
  is_active?: boolean;
  start_date?: string;
}

export interface UpdateArchitectureProjectDto extends Partial<CreateArchitectureProjectDto> {} 