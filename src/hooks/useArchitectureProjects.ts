import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArchitectureProject, CreateArchitectureProjectDto, UpdateArchitectureProjectDto } from '../types/architecture.types';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

// Hook para obtener los proyectos de arquitectura de un proyecto específico
export const useProjectArchitectureProjects = (projectId?: number) => {
  const { accessToken } = useAuth();
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  return useQuery<ArchitectureProject[]>({
    queryKey: ['architectureProjects', projectId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/architecture-projects/?project=${projectId}`, axiosConfig);
      return response.data;
    },
    enabled: !!projectId,
  });
};

// Hook para obtener un proyecto de arquitectura específico
export const useArchitectureProject = (architectureProjectId?: number) => {
  const { accessToken } = useAuth();
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  return useQuery<ArchitectureProject>({
    queryKey: ['architectureProject', architectureProjectId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/architecture-projects/${architectureProjectId}/`, axiosConfig);
      return response.data;
    },
    enabled: !!architectureProjectId,
  });
};

// Hook para las operaciones de mutación (crear, actualizar, eliminar)
export const useArchitectureProjectMutations = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  const createArchitectureProject = useMutation({
    mutationFn: async (newArchitectureProject: CreateArchitectureProjectDto) => {
      const response = await axios.post(`${API_URL}/architecture-projects/`, newArchitectureProject, axiosConfig);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjects', variables.project] });
    },
  });

  const updateArchitectureProject = useMutation({
    mutationFn: async ({ architectureProjectId, data }: { architectureProjectId: number; data: UpdateArchitectureProjectDto }) => {
      const response = await axios.put(`${API_URL}/architecture-projects/${architectureProjectId}/`, data, axiosConfig);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['architectureProject', variables.architectureProjectId] });
      queryClient.invalidateQueries({ queryKey: ['architectureProjects'] });
    },
  });

  const deleteArchitectureProject = useMutation({
    mutationFn: async (architectureProjectId: number) => {
      await axios.delete(`${API_URL}/architecture-projects/${architectureProjectId}/`, axiosConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjects'] });
    },
  });

  return {
    createArchitectureProject,
    updateArchitectureProject,
    deleteArchitectureProject,
  };
}; 