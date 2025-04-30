// src/hooks/useProjectNodes.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProjectNode, CreateProjectNodeDto, UpdateProjectNodeDto } from '../types/project_nodes.types';

const API_URL = process.env.REACT_APP_API_URL;

export const useProjectNodes = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const getProjects = useQuery<ProjectNode[]>({
    queryKey: ['projectNodes'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/project-nodes/`, axiosConfig);
      return response.data;
    },
    enabled: !!accessToken,
  });

  const createProject = useMutation({
    mutationFn: async (data: CreateProjectNodeDto) => {
      const response = await axios.post(`${API_URL}/project-nodes/`, data, axiosConfig);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectNodes'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProjectNodeDto }) => {
      const response = await axios.put(`${API_URL}/project-nodes/${id}/`, data, axiosConfig);
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
