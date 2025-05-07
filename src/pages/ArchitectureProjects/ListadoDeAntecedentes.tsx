import React, { useState } from 'react';
import { useProjectNodeTree } from '../../hooks/useProjectNodes';
import { ArchitectureProjectNode } from '../../types/architecture.types';
import { NodeType } from '../../types/project_nodes.types';
import { Accordion, AccordionSummary, AccordionDetails, Button, Menu, MenuItem, TextField, Typography, IconButton, Box, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useQueryClient } from '@tanstack/react-query';

interface ListadoDeAntecedentesProps {
  stageId: number;
}

const ListadoDeAntecedentes: React.FC<ListadoDeAntecedentesProps> = ({ stageId }) => {
  const queryClient = useQueryClient();
  // Usar el árbol completo del stage
  const { data: tree, isLoading } = useProjectNodeTree(stageId);
  // State for which accordions are open
  const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({});
  // State for add antecedent menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editListName, setEditListName] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);

  // For creating lists and antecedentes, fallback to useProjectNodes for mutations
  const { createProject: createList, updateProject } = require('../../hooks/useProjectNodes').useProjectNodes();
  const { createProject: createAntecedent } = require('../../hooks/useProjectNodes').useProjectNodes();

  if (isLoading) return <Typography>Cargando...</Typography>;
  if (!tree) return <Typography>No hay datos.</Typography>;

  // Obtener los lists hijos del stage
  const lists = (tree.children || []).filter((n: any) => n.type === 'list');

  const handleAccordionToggle = (listId: number) => {
    setOpenAccordions(prev => ({ ...prev, [listId]: !prev[listId] }));
  };

  const handleAddAntecedentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setSelectedListId(null);
    setNewListName('');
    setCreatingList(false);
    setError(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListId(null);
    setNewListName('');
    setCreatingList(false);
    setError(null);
  };

  const handleSelectList = (listId: number) => {
    setSelectedListId(listId);
    setCreatingList(false);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      setError('El nombre del listado es obligatorio');
      return;
    }
    setError(null);
    try {
      const result = await createList.mutateAsync({
        parent: stageId,
        name: newListName,
        description: '',
        is_active: true,
        type: 'list' as NodeType,
      });
      setSelectedListId(result.id);
      setCreatingList(false);
      setNewListName('');
      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
    } catch (err: any) {
      setError('Error al crear el listado');
    }
  };

  const handleCreateAntecedent = async (type: NodeType) => {
    if (!selectedListId) {
      setError('Selecciona un listado');
      return;
    }
    setError(null);
    try {
      await createAntecedent.mutateAsync({
        parent: selectedListId,
        name: `Nuevo ${type}`,
        description: '',
        is_active: true,
        type,
      });
      handleMenuClose();
      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
    } catch (err: any) {
      setError('Error al crear el antecedente');
    }
  };

  const handleEditList = (list: any) => {
    setEditingListId(list.id);
    setEditListName(list.name);
  };

  const handleSaveListName = async (list: any) => {
    if (!editListName.trim()) return;
    setSavingEdit(true);
    try {
      await updateProject.mutateAsync({
        id: list.id,
        data: { name: editListName, type: 'list' },
      });
      setEditingListId(null);
      setEditListName('');
      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
    } catch (err) {
      setError('Error al actualizar el nombre del listado');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Listado de antecedentes</Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddAntecedentClick}>
        Agregar Antecedente
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {lists.map((list: any) => (
          <MenuItem key={list.id} onClick={() => handleSelectList(list.id)} selected={selectedListId === list.id}>
            {list.name}
          </MenuItem>
        ))}
        <MenuItem divider />
        {creatingList ? (
          <div style={{ padding: 8, width: 200 }}>
            <TextField
              label="Nombre del listado"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              size="small"
              fullWidth
              autoFocus
            />
            <Button onClick={handleCreateList} variant="contained" color="primary" size="small" style={{ marginTop: 8 }}>
              Crear Listado
            </Button>
          </div>
        ) : (
          <MenuItem onClick={() => setCreatingList(true)}>
            <AddIcon fontSize="small" /> Crear nuevo listado
          </MenuItem>
        )}
        {selectedListId && !creatingList && (
          <>
            <MenuItem disabled>Selecciona el tipo de antecedente a crear:</MenuItem>
            <MenuItem onClick={() => handleCreateAntecedent('document')}>Documento</MenuItem>
            <MenuItem onClick={() => handleCreateAntecedent('form')}>Formulario</MenuItem>
            <MenuItem onClick={() => handleCreateAntecedent('certificate')}>Certificado</MenuItem>
            <MenuItem onClick={() => handleCreateAntecedent('construction_solution')}>Solución Constructiva</MenuItem>
            <MenuItem onClick={() => handleCreateAntecedent('external_link')}>Enlace Externo</MenuItem>
          </>
        )}
        {error && <MenuItem disabled style={{ color: 'red' }}>{error}</MenuItem>}
      </Menu>
      <div style={{ marginTop: 24 }}>
        {lists.map((list: any) => (
          <Accordion key={list.id} expanded={!!openAccordions[list.id]} onChange={() => handleAccordionToggle(list.id)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  {editingListId === list.id ? (
                    <TextField
                      value={editListName}
                      onChange={e => setEditListName(e.target.value)}
                      size="small"
                      variant="standard"
                      disabled={savingEdit}
                      onClick={e => e.stopPropagation()}
                      onFocus={e => e.stopPropagation()}
                      sx={{ minWidth: 120 }}
                    />
                  ) : (
                    <Typography variant="subtitle1" fontWeight={600}>{list.name}</Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Estado: {list.status || '-'} | Progreso: {list.progress_percent ?? 0}%
                  </Typography>
                </Box>
                <Box>
                  {editingListId === list.id ? (
                    <IconButton size="small" onClick={e => { e.stopPropagation(); handleSaveListName(list); }} disabled={savingEdit}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={e => { e.stopPropagation(); handleEditList(list); }}>
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {(!list.children || list.children.length === 0) ? (
                <Typography color="textSecondary">No hay antecedentes en este listado.</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
                        <th style={{ textAlign: 'left', padding: 8 }}>Tipo</th>
                        <th style={{ textAlign: 'left', padding: 8 }}>Fecha inicio</th>
                        <th style={{ textAlign: 'left', padding: 8 }}>Fecha fin</th>
                        <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
                        <th style={{ textAlign: 'left', padding: 8 }}>Progreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.children.map((node: any) => (
                        <tr key={node.id}>
                          <td style={{ padding: 8 }}>{node.name}</td>
                          <td style={{ padding: 8 }}>{node.type}</td>
                          <td style={{ padding: 8 }}>{node.start_date ? new Date(node.start_date).toLocaleDateString() : '-'}</td>
                          <td style={{ padding: 8 }}>{node.end_date ? new Date(node.end_date).toLocaleDateString() : '-'}</td>
                          <td style={{ padding: 8 }}>{node.status}</td>
                          <td style={{ padding: 8 }}>{node.progress_percent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default ListadoDeAntecedentes; 