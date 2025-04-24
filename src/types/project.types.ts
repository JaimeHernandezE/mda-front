// Project Types
import { User } from './user.types';
import { Property } from './property.types';

export interface Project {
  id: number;
  created: string;
  modified: string;
  project_name: string;
  project_description: string;
  is_active: boolean;
  property: Property | null;
  project_owner: number;
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