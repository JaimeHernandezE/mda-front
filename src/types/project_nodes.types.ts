export type NodeStatus = 'en_estudio' | 'pendiente' | 'finalizado';

export interface FileType {
  id: number;
  name: string;
  code: string;
  mime_types: string[];
  icon: string | null;
  is_active: boolean;
  metadata_schema: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface NodeTypeModel {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface ProjectNode {
  id: number;
  parent: number | null;
  name: string;
  description: string | null;
  is_active: boolean;
  type: number; // ID del tipo de nodo
  children: ProjectNode[];
  file_type: string | null;
  properties: any[];
  architecture_project: number | null;
  file: number | null;
  cover_image: number | null;
  external_url: string | null;
  external_file_name: string | null;
  external_file_id: string | null;
  metadata: Record<string, any>;
  start_date: string | null;
  end_date: string | null;
  status: NodeStatus;
  progress_percent: number;
  created_at: string;
  updated_at: string;
  file_url: string | null;
  cover_image_url: string | null;
}

export interface CreateProjectNodeDto {
  name: string;
  description?: string;
  type: number; // ID del tipo de nodo
  file_type?: number;
  parent?: number | null;
  properties?: number[];
  is_active?: boolean;
  architecture_project?: number;
  file?: File; // only in requests
  cover_image?: File; // only in requests
  external_url?: string;
  external_file_name?: string;
  external_file_id?: string;
  metadata?: Record<string, any>;
  start_date?: string | null;
  end_date?: string | null;
  status?: NodeStatus;
  progress_percent?: number;
}

export interface UpdateProjectNodeDto extends Partial<CreateProjectNodeDto> {}
