// src/hooks/useProjectNodes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { mapProjectNode } from '../mappers/project_node_mapper';
import { ProjectNode, CreateProjectNodeDto, UpdateProjectNodeDto, NodeType } from '../types/project_nodes.types';

const API_URL = process.env.REACT_APP_API_URL;

interface ProjectNodesFilters {
  parent?: number;
  type?: NodeType;
}

export const useProjectNodes = <T extends ProjectNode = ProjectNode>(filters?: ProjectNodesFilters) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const getProjects = useQuery<T[]>({
    queryKey: ['projectNodes', filters],
    queryFn: async (): Promise<T[]> => {
      const params = new URLSearchParams();
      if (filters?.parent) params.append('parent', filters.parent.toString());
      if (filters?.type) params.append('type', filters.type);
      const response = await axios.get(`${API_URL}/project-nodes/?${params.toString()}`, axiosConfig);
      return Array.isArray(response.data) ? response.data.map(mapProjectNode) as T[] : [];
    },
    enabled: !!accessToken,
  });

  const createProject = useMutation({
    mutationFn: async (data: CreateProjectNodeDto) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axios.post(`${API_URL}/project-nodes/`, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectNodes'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData | UpdateProjectNodeDto }) => {
      const isFormData = data instanceof FormData;
      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        },
      };

      const response = await axios.put(`${API_URL}/project-nodes/${id}/`, data, config);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projectNodes'] });
      queryClient.invalidateQueries({ queryKey: ['projectNode', variables.id] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/project-nodes/${id}/`, axiosConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectNodes'] });
    },
  });

  return {
    projects: getProjects.data,
    isLoadingProjects: getProjects.isLoading,
    createProject,
    updateProject,
    deleteProject,
  };
};

export const useProjectNodeTree = (nodeId?: number | null) => {
  const { accessToken } = useAuth();
  const axiosConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return useQuery({
    queryKey: ['projectNodeTree', nodeId],
    queryFn: async () => {
      if (!nodeId) return null;
      const { data } = await axios.get(`${API_URL}/project-nodes/${nodeId}/tree/`, axiosConfig);
      return data;
    },
    enabled: !!nodeId && !!accessToken,
  });
};
