// src/types/project_nodes.types.ts

export type NodeType =
  | 'project'
  | 'architecture_subproject'
  | 'budget'
  | 'document'
  | 'form'
  | 'certificate'
  | 'construction_solution'
  | 'layer';

export type NodeStatus = 'en_estudio' | 'pendiente' | 'finalizado';

export interface ProjectNode {
  id: number;
  name: string;
  description: string;
  type: NodeType;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  status: NodeStatus;
  progress_percent: number;
  parent: number | null;
  children: ProjectNode[];
  created: string;
  modified: string;
}

export interface CreateProjectNodeDto {
  name: string;
  description: string;
  type: NodeType;
  is_active?: boolean;
  status?: NodeStatus;
  start_date?: string | null;
  end_date?: string | null;
  parent?: number | null;
}

export interface UpdateProjectNodeDto {
  name?: string;
  description?: string;
  is_active?: boolean;
  status?: NodeStatus;
  start_date?: string | null;
  end_date?: string | null;
}

