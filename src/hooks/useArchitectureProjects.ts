import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArchitectureProject, CreateArchitectureProjectDto, UpdateArchitectureProjectDto } from '../types/project.types';

const API_URL = process.env.REACT_APP_API_URL;

export const useArchitectureProjects = (projectId?: number) => {
  const queryClient = useQueryClient();

  // Obtener proyectos de arquitectura de un proyecto
  const { data: architectureProjects, isLoading: isLoadingArchitectureProjects } = useQuery<ArchitectureProject[]>({
    queryKey: ['architectureProjects', projectId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/projects/${projectId}/architecture-projects/`);
      return response.data;
    },
    enabled: !!projectId,
  });

  // Obtener un proyecto de arquitectura específico
  const useArchitectureProject = (architectureProjectId: number) => {
    return useQuery<ArchitectureProject>({
      queryKey: ['architectureProjects', projectId, architectureProjectId],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/projects/${projectId}/architecture-projects/${architectureProjectId}/`);
        return response.data;
      },
      enabled: !!projectId && !!architectureProjectId,
    });
  };

  // Crear un nuevo proyecto de arquitectura
  const createArchitectureProject = useMutation({
    mutationFn: async (newArchitectureProject: CreateArchitectureProjectDto) => {
      const response = await axios.post(`${API_URL}/projects/${projectId}/architecture-projects/`, newArchitectureProject);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjects', projectId] });
    },
  });

  // Actualizar un proyecto de arquitectura
  const updateArchitectureProject = useMutation({
    mutationFn: async ({ architectureProjectId, data }: { architectureProjectId: number; data: UpdateArchitectureProjectDto }) => {
      const response = await axios.put(`${API_URL}/projects/${projectId}/architecture-projects/${architectureProjectId}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjects', projectId] });
      queryClient.invalidateQueries({ queryKey: ['architectureProjects', projectId, variables.architectureProjectId] });
    },
  });

  // Eliminar un proyecto de arquitectura
  const deleteArchitectureProject = useMutation({
    mutationFn: async (architectureProjectId: number) => {
      await axios.delete(`${API_URL}/projects/${projectId}/architecture-projects/${architectureProjectId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjects', projectId] });
    },
  });

  return {
    architectureProjects,
    isLoadingArchitectureProjects,
    useArchitectureProject,
    createArchitectureProject,
    updateArchitectureProject,
    deleteArchitectureProject,
  };
}; 