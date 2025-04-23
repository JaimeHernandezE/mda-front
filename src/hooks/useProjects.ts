import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types/project.types';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export const useProjects = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  // Configuración de axios con el token
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  // Obtener lista de proyectos
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/projects/`, axiosConfig);
      return response.data;
    },
  });

  // Obtener un proyecto específico
  const useProject = (id: number) => {
    return useQuery<Project>({
      queryKey: ['projects', id],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/projects/${id}/`, axiosConfig);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Crear un nuevo proyecto
  const createProject = useMutation({
    mutationFn: async (newProject: CreateProjectDto) => {
      const response = await axios.post(`${API_URL}/projects/`, newProject, axiosConfig);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Actualizar un proyecto
  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProjectDto }) => {
      const response = await axios.put(`${API_URL}/projects/${id}/`, data, axiosConfig);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });

  // Actualización parcial de un proyecto
  const patchProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProjectDto }) => {
      const response = await axios.patch(`${API_URL}/projects/${id}/`, data, axiosConfig);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });

  // Eliminar un proyecto
  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/projects/${id}/`, axiosConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    // Queries
    projects,
    isLoadingProjects,
    useProject,

    // Mutations
    createProject,
    updateProject,
    patchProject,
    deleteProject,
  };
}; 