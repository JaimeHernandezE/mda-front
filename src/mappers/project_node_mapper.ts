// src/mappers/project_node_mapper.ts

import { ArchitectureProjectNode } from '../types/architecture.types';
import { ProjectNode } from '../types/project_nodes.types';

const BASE_MEDIA_URL = process.env.REACT_APP_MEDIA_URL || '';

export function mapProjectNode(raw: any): ProjectNode | ArchitectureProjectNode {
    return {
      ...raw,
      cover_image_url: raw.cover_image_url || (raw.cover_image ? `${BASE_MEDIA_URL}${raw.cover_image}` : null),
      file_url: raw.file_url || (raw.file ? `${BASE_MEDIA_URL}${raw.file}` : null),
      architecture_project_fields: raw.architecture_project_fields || null,
      description: raw.description || '',
      metadata: raw.metadata || {},
      children: raw.children ? raw.children.map(mapProjectNode) : [],
    };
  }
  
