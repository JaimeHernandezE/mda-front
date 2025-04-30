import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProjectNode, CreateProjectNodeDto } from '../types/project_nodes.types';

const API_URL = process.env.REACT_APP_API_URL;

interface CreateArchitectureNodeDto {
  name: string;
  description: string;
  type: 'project' | 'architecture_subproject' | 'budget' | 'document' | 'form' | 'certificate' | 'construction_solution' | 'layer' | 'external_link' | 'list';
  is_active?: boolean;
  file_type_id?: number;
}

export const useArchitectureProjectNodes = (architectureId?: number) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  // Get nodes for an architecture project
  const getNodes = useQuery<ProjectNode[]>({
    queryKey: ['architectureProjectNodes', architectureId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/architecture-projects/${architectureId}/nodes/`,
        axiosConfig
      );
      return response.data;
    },
    enabled: !!accessToken && !!architectureId,
  });

  // Add a node to an architecture project
  const addNode = useMutation({
    mutationFn: async (data: CreateArchitectureNodeDto) => {
      const response = await axios.post(
        `${API_URL}/architecture-projects/${architectureId}/add_node/`,
        data,
        axiosConfig
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectureProjectNodes', architectureId] });
    },
  });

  // Get the node tree for an architecture project
  const getNodeTree = useQuery<ProjectNode[]>({
    queryKey: ['architectureProjectNodeTree', architectureId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/architecture-projects/${architectureId}/node_tree/`,
        axiosConfig
      );
      return response.data;
    },
    enabled: !!accessToken && !!architectureId,
  });

  return {
    nodes: getNodes.data,
    isLoadingNodes: getNodes.isLoading,
    addNode,
    nodeTree: getNodeTree.data,
    isLoadingNodeTree: getNodeTree.isLoading,
  };
}; 