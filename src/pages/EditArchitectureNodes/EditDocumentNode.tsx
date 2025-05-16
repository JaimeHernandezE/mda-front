import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { useQueryClient } from '@tanstack/react-query';
import { ProjectNode, NodeStatus } from '../../types/project_nodes.types';
import { CreateProjectNodeDto } from '../../types/project_nodes.types';

interface ModalDocumentNodeProps {
  open: boolean;
  onClose: () => void;
  node: ProjectNode | null;
  stageId: number;
}

const FILE_TYPES = [
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'DWG',
  'RVT',
  'IFC',
  'JPG',
  'PNG',
];

const STATUS_OPTIONS: NodeStatus[] = [
  'en_estudio',
  'pendiente',
  'finalizado',
];

const ModalDocumentNode: React.FC<ModalDocumentNodeProps> = ({
  open,
  onClose,
  node,
  stageId,
}) => {
  const queryClient = useQueryClient();
  const { updateProject, createProject } = useProjectNodes();

  const [formData, setFormData] = useState({
    name: node?.name || '',
    description: node?.description || '',
    file_type: node?.file_type?.id || null,
    start_date: node?.start_date ? new Date(node.start_date).toISOString().split('T')[0] : '',
    end_date: node?.end_date ? new Date(node.end_date).toISOString().split('T')[0] : '',
    status: node?.status || 'pendiente',
    progress_percent: node?.progress_percent || 0,
    file: node?.file || null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileMarkedForDelete, setFileMarkedForDelete] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({
        name: node.name || '',
        description: node.description || '',
        file_type: node.file_type?.id || null,
        start_date: node.start_date ? new Date(node.start_date).toISOString().split('T')[0] : '',
        end_date: node.end_date ? new Date(node.end_date).toISOString().split('T')[0] : '',
        status: node.status || 'pendiente',
        progress_percent: node.progress_percent || 0,
        file: node.file || null,
      });
      setSelectedFile(null);
      setFileMarkedForDelete(false);
    }
  }, [node]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // Set progress to 100% when a file is selected
      setFormData(prev => ({
        ...prev,
        progress_percent: 100,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (node && node.id !== -1) {
        // Actualizar nodo existente
        const formDataToSend = new FormData();
        
        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            formDataToSend.append(key, value.toString());
          }
        });

        // Add file if selected
        if (selectedFile) {
          formDataToSend.append('file', selectedFile);
        }

        // Si el usuario eliminó el archivo, agrega delete_file
        if (fileMarkedForDelete) {
          formDataToSend.append('delete_file', 'true');
        }

        // Add type
        formDataToSend.append('type', 'document');

        await updateProject.mutateAsync({
          id: node.id,
          data: formDataToSend,
        });
      } else {
        // Crear nuevo nodo
        const createData: CreateProjectNodeDto = {
          name: formData.name,
          description: formData.description || undefined,
          type: 'document',
          file_type: formData.file_type || undefined,
          parent: node?.parent || undefined,
          is_active: true,
          file: selectedFile || undefined,
          start_date: formData.start_date || undefined,
          end_date: formData.end_date || undefined,
          status: formData.status,
          progress_percent: formData.progress_percent,
        };
        await createProject.mutateAsync(createData);
      }

      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el documento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {node && node.id !== -1 ? 'Editar Documento' : 'Nuevo Documento'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nombre"
            value={formData.name}
            onChange={handleInputChange('name')}
            fullWidth
            required
          />

          <TextField
            label="Descripción"
            value={formData.description}
            onChange={handleInputChange('description')}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            select
            label="Tipo de Archivo"
            value={formData.file_type || ''}
            onChange={handleInputChange('file_type')}
            fullWidth
            required
          >
            {FILE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha de Inicio"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange('start_date')}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Fecha de Fin"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange('end_date')}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            select
            label="Estado"
            value={formData.status}
            onChange={handleInputChange('status')}
            fullWidth
            required
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Archivo
            </Typography>
            {node?.file_url && !selectedFile && !fileMarkedForDelete && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <a href={node.file_url} target="_blank" rel="noopener noreferrer">
                  {`Descargar ${node.file_url.split('/').pop()}`}
                </a>
                <Button
                  color="error"
                  size="small"
                  onClick={() => {
                    setFileMarkedForDelete(true);
                    setFormData(prev => ({ ...prev, file: null, progress_percent: 0 }));
                  }}
                >
                  Eliminar
                </Button>
              </Box>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Archivo seleccionado: {selectedFile.name}
              </Typography>
            )}
          </Box>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || !formData.name || !formData.file_type}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDocumentNode; 