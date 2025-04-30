// src/hooks/useProjectNodes.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProjectNode, CreateProjectNodeDto, UpdateProjectNodeDto } from '../types/project_nodes.types';

const API_URL = process.env.REACT_APP_API_URL;

interface ProjectNodesFilters {
  node_parent?: number;
}

export const useProjectNodes = (filters?: ProjectNodesFilters) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const getProjects = useQuery<ProjectNode[]>({
    queryKey: ['projectNodes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.node_parent) {
        params.append('node_parent', filters.node_parent.toString());
      }
      const response = await axios.get(`${API_URL}/project-nodes/?${params.toString()}`, axiosConfig);
      return response.data;
    },
    enabled: !!accessToken,
  });

  const getProjectsByArchitecture = async (architectureId: number) => {
    const response = await axios.get(
      `${API_URL}/project-nodes/by_architecture_project/${architectureId}/`,
      axiosConfig
    );
    return response.data;
  };

  const useArchitectureNodes = (architectureId?: number) => {
    return useQuery<ProjectNode[]>({
      queryKey: ['architectureNodes', architectureId],
      queryFn: () => getProjectsByArchitecture(architectureId!),
      enabled: !!accessToken && !!architectureId,
    });
  };

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
      queryClient.invalidateQueries({ queryKey: ['architectureNodes'] });
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
      queryClient.invalidateQueries({ queryKey: ['architectureNodes'] });
      queryClient.invalidateQueries({ queryKey: ['projectNode', variables.id] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/project-nodes/${id}/`, axiosConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectNodes'] });
      queryClient.invalidateQueries({ queryKey: ['architectureNodes'] });
    },
  });

  return {
    projects: getProjects.data,
    isLoadingProjects: getProjects.isLoading,
    useArchitectureNodes,
    createProject,
    updateProject,
    deleteProject,
  };
};
