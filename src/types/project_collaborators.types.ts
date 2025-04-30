import { User } from './user.types';
import { ProjectNode } from './project_nodes.types';

export interface ProjectCollaborator {
  id: number;
  project: ProjectNode;
  collaborator: User;
  role: {
    id: number;
    role: 'Propietario/a' | 'Arquitecto' | 'Constructor' | 'Revisor independiente' | 'Calculista' | 'Revisor de Cálculo' | 'Coordinador';
  } | null;
  can_edit: boolean;
  company: {
    id: number;
    name: string;
    mail: string | null;
    owner: User;
    partner: User[];
    rut: string | null;
    address: string | null;
    address_number: string | null;
    comuna: {
      id: number;
      comuna: string;
      region: {
        id: number;
        region: string;
      };
    } | null;
    region: {
      id: number;
      region: string;
    } | null;
    phone: number | null;
  } | null;
  is_legal_rep: boolean;
  is_owner: boolean;
  created: string;
  modified: string;
}

export interface CreateProjectCollaboratorDto {
  project: number;
  collaborator: number;
  role?: number | null;
  can_edit?: boolean;
  company?: number | null;
  is_legal_rep?: boolean;
  is_owner?: boolean;
}

export interface UpdateProjectCollaboratorDto {
  role?: number | null;
  can_edit?: boolean;
  company?: number | null;
  is_legal_rep?: boolean;
  is_owner?: boolean;
} 