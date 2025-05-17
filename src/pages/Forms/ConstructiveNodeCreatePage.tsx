import React, { useState, useEffect } from 'react';
import { useFormNode } from '../../context/FormNodeContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, FormControlLabel, Switch } from '@mui/material';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { useNodeTypeByName } from '../../hooks/useNodeTypes';
import { NodeTypeModel } from '../../types/project_nodes.types';

export default function ConstructionSolutionCreatePage() {
  const { selectedForm, nodeData, setNodeData } = useFormNode();
  const navigate = useNavigate();
  const constructionSolutionType = useNodeTypeByName('construction_solution');
  const [form, setForm] = useState({
    name: nodeData?.name || '',
    description: nodeData?.description || '',
    is_active: nodeData?.is_active ?? true,
  });

  const { createProject, updateProject, isLoadingProjects } = useProjectNodes();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNodeData((prev: any) => ({ ...prev, ...form }));
  }, [form, setNodeData]);

  if (!selectedForm && !nodeData) {
    navigate('/constructive/select');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!constructionSolutionType) {
      setError('No se pudo determinar el tipo de nodo');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (nodeData?.isEditing) {
        // Si estamos editando, actualizamos el nodo existente
        await updateProject.mutateAsync({
          id: nodeData.id,
          data: {
            name: form.name,
            description: form.description,
            is_active: form.is_active,
          }
        });
      } else {
        // Si estamos creando, creamos un nuevo nodo
        await createProject.mutateAsync({
          name: form.name,
          description: form.description,
          is_active: form.is_active,
          type: constructionSolutionType.id,
          parent: nodeData?.parent,
        });
      }
      
      // Navegar de vuelta usando los IDs del proyecto y arquitectura
      if (nodeData?.project_id && nodeData?.architecture_project_id) {
        navigate(`/proyectos/${nodeData.project_id}/arquitectura/${nodeData.architecture_project_id}`);
      } else {
        navigate(-1); // Fallback a navegación hacia atrás si no hay IDs
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar la solución constructiva');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {nodeData?.isEditing ? 'Editar Solución Constructiva' : `Crear Solución Constructiva: ${selectedForm?.name}`}
      </Typography>
      <Box my={2} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Descripción"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
        />
        {!nodeData?.isEditing && (
          <Button 
            variant="outlined" 
            onClick={() => {
              setNodeData((prev: any) => ({
                ...prev,
                name: form.name,
                description: form.description,
                is_active: form.is_active,
              }));
              navigate('/constructive/select');
            }}
          >
            Volver a seleccionar formulario
          </Button>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={form.is_active}
              onChange={handleChange}
              name="is_active"
            />
          }
          label="Activo"
        />
        {error && <Typography color="error">{error}</Typography>}
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit} 
        disabled={saving || isLoadingProjects || !constructionSolutionType}
      >
        {saving ? 'Guardando...' : nodeData?.isEditing ? 'Actualizar' : 'Guardar'}
      </Button>
    </Box>
  );
} 