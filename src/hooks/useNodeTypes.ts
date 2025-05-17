import { useQuery } from '@tanstack/react-query';
import { NodeTypeModel } from '../types/project_nodes.types';
import { api } from '../utils/api';

export function useNodeTypes() {
  return useQuery<NodeTypeModel[]>({
    queryKey: ['nodeTypes'],
    queryFn: async () => {
      const response = await api.get('/api/node-types/');
      return response.data;
    },
  });
}

export function useNodeTypeByName(name: string) {
  const { data: nodeTypes } = useNodeTypes();
  return nodeTypes?.find(type => type.name === name);
} 