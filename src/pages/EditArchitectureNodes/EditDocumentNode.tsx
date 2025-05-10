import React, { useState } from 'react';
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

interface EditDocumentNodeProps {
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

const EditDocumentNode: React.FC<EditDocumentNodeProps> = ({
  open,
  onClose,
  node,
  stageId,
}) => {
  const queryClient = useQueryClient();
  const { updateProject } = useProjectNodes();

  const [formData, setFormData] = useState({
    name: node?.name || '',
    description: node?.description || '',
    file_type: node?.file_type?.id || null,
    start_date: node?.start_date ? new Date(node.start_date).toISOString().split('T')[0] : '',
    end_date: node?.end_date ? new Date(node.end_date).toISOString().split('T')[0] : '',
    status: node?.status || 'pendiente',
    progress_percent: node?.progress_percent || 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!node) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
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

      // Add type
      formDataToSend.append('type', 'document');

      await updateProject.mutateAsync({
        id: node.id,
        data: formDataToSend,
      });

      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el documento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {node ? 'Editar Documento' : 'Nuevo Documento'}
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
                {selectedFile ? selectedFile.name : 'Seleccionar Archivo'}
              </Button>
            </label>
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
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDocumentNode; 