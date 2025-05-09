import React, { useState } from 'react';
import { useProjectNodeTree } from '../../hooks/useProjectNodes';
import { ArchitectureProjectNode } from '../../types/architecture.types';
import { NodeType } from '../../types/project_nodes.types';
import { Accordion, AccordionSummary, AccordionDetails, Button, Popover, MenuItem, TextField, Typography, IconButton, Box, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useQueryClient } from '@tanstack/react-query';

interface ListadoDeAntecedentesProps {
  stageId: number;
}

// Agregar función para extraer el error del backend
function extractBackendError(err: any): string {
  if (err?.response?.data && typeof err.response.data === 'object') {
    const values = Object.values(err.response.data);
    if (Array.isArray(values[0])) {
      return (values as any[]).flat().join(' ');
    }
    return values.join(' ');
  }
  return err?.response?.data?.detail || err?.message || 'Error desconocido';
}

// Nueva función recursiva para renderizar listados (acordeones)
interface RenderListAccordionProps {
  list: any;
  openAccordions: { [key: number]: boolean };
  handleAccordionToggle: (listId: number) => void;
  editingListId: number | null;
  editListName: string;
  setEditListName: React.Dispatch<React.SetStateAction<string>>;
  savingEdit: boolean;
  handleSaveListName: (list: any) => void;
  handleEditList: (list: any) => void;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  setSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
  setCreatingList: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isRoot?: boolean;
}

// Recopilar todos los documentos (antecedentes) de todos los niveles, con nivel de profundidad
function collectAllDocuments(list: any, depth = 0): any[] {
  let docs: any[] = [];
  (list.children || []).forEach((node: any) => {
    if (node.type === 'list') {
      docs = docs.concat(collectAllDocuments(node, depth + 1));
    } else {
      docs.push({ ...node, depth });
    }
  });
  return docs;
}

function renderListAccordion({
  list,
  openAccordions,
  handleAccordionToggle,
  editingListId,
  editListName,
  setEditListName,
  savingEdit,
  handleSaveListName,
  handleEditList,
  setAnchorEl,
  setSelectedListId,
  setCreatingList,
  setError,
  isRoot = false,
}: RenderListAccordionProps) {
  // Hijos de tipo 'list' (contenedores)
  const childLists = (list.children || []).filter((n: any) => n.type === 'list');
  // Hijos que no son listados (antecedentes)
  const childNodes = (list.children || []).filter((n: any) => n.type !== 'list');

  return (
    <Accordion
      key={list.id}
      expanded={!!openAccordions[list.id]}
      onChange={() => handleAccordionToggle(list.id)}
      TransitionProps={{ timeout: 0 }}
      sx={{ ml: isRoot ? 0 : 3 }} // solo indentación, sin borde
    >
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
            {editingListId === list.id ? (
              <IconButton size="small" onClick={e => { e.stopPropagation(); handleSaveListName(list); }} disabled={savingEdit}>
                <SaveIcon />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={e => { e.stopPropagation(); handleEditList(list); }}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={e => { e.stopPropagation(); setAnchorEl(e.currentTarget); setSelectedListId(list.id); setCreatingList(false); setError(null); }}
              color="primary"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                width: 30,
                height: 30,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          {isRoot && (
            <Box>
              <Typography variant="body2" color="textSecondary">
                Estado: {list.status || '-'} | Progreso: {list.progress_percent ?? 0}%
              </Typography>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {/* Renderizar hijos de tipo 'list' (contenedores) recursivamente */}
        {childLists.length > 0 && (
          <Box>
            {childLists.map((childList: any) =>
              renderListAccordion({
                list: childList,
                openAccordions,
                handleAccordionToggle,
                editingListId,
                editListName,
                setEditListName,
                savingEdit,
                handleSaveListName,
                handleEditList,
                setAnchorEl,
                setSelectedListId,
                setCreatingList,
                setError,
                isRoot: false,
              })
            )}
          </Box>
        )}
        {/* Ya no renderizamos los documentos aquí, solo en la tabla raíz */}
      </AccordionDetails>
    </Accordion>
  );
}

// Restaurar la interfaz para el tipado de generateTableRowsWithAccordion
interface GenerateTableRowsProps {
  nodes: any[];
  depth?: number;
  editingListId: number | null;
  editListName: string;
  setEditListName: React.Dispatch<React.SetStateAction<string>>;
  savingEdit: boolean;
  handleSaveListName: (list: any) => void;
  handleEditList: (list: any) => void;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  setSelectedListId: React.Dispatch<React.SetStateAction<number | null>>;
  setCreatingList: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteTarget: React.Dispatch<React.SetStateAction<any | null>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Generar filas de la tabla mezclando documentos y listados hijos, con indentación y controles y acordeón
function generateTableRowsWithAccordion({
  nodes,
  depth = 0,
  openAccordions,
  handleAccordionToggle,
  editingListId,
  editListName,
  setEditListName,
  savingEdit,
  handleSaveListName,
  handleEditList,
  setAnchorEl,
  setSelectedListId,
  setCreatingList,
  setError,
  setDeleteTarget,
  setShowDeleteModal,
}: GenerateTableRowsProps & {
  openAccordions: { [key: number]: boolean };
  handleAccordionToggle: (listId: number) => void;
  setDeleteTarget: React.Dispatch<React.SetStateAction<any | null>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactNode[] {
  let rows: React.ReactNode[] = [];
  nodes.forEach((node: any) => {
    if (node.type === 'list') {
      // Fila para el listado hijo con acordeón
      rows.push(
        <React.Fragment key={node.id}>
          <tr style={{ background: '#f7fafd', cursor: 'pointer' }}>
            <td style={{ padding: 8, paddingLeft: 8 + depth * 32 }} onClick={() => handleAccordionToggle(node.id)}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton size="small" onClick={e => { e.stopPropagation(); handleAccordionToggle(node.id); }}>
                  {openAccordions[node.id] ? <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} /> : <ExpandMoreIcon />}
                </IconButton>
                {editingListId === node.id ? (
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
                  <Typography variant="subtitle1" fontWeight={600}>{node.name}</Typography>
                )}
              </Box>
            </td>
            <td style={{ padding: 8 }}><strong>Listado</strong></td>
            <td style={{ padding: 8 }}></td>
            <td style={{ padding: 8 }}></td>
            <td style={{ padding: 8 }}>{node.status || '-'}</td>
            <td style={{ padding: 8 }}>{node.progress_percent ?? 0}%</td>
            <td style={{ padding: 8, textAlign: 'right' }}>
              {editingListId === node.id ? (
                <IconButton size="small" onClick={e => { e.stopPropagation(); handleSaveListName(node); }} disabled={savingEdit}>
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton size="small" onClick={e => { e.stopPropagation(); handleEditList(node); }}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={e => { e.stopPropagation(); setAnchorEl(e.currentTarget); setSelectedListId(node.id); setCreatingList(false); setError(null); }}
                color="primary"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={e => {
                  e.stopPropagation();
                  setDeleteTarget(node);
                  setShowDeleteModal(true);
                }}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </td>
          </tr>
          {openAccordions[node.id] && (
            generateTableRowsWithAccordion({
              nodes: node.children || [],
              depth: depth + 1,
              openAccordions,
              handleAccordionToggle,
              editingListId,
              editListName,
              setEditListName,
              savingEdit,
              handleSaveListName,
              handleEditList,
              setAnchorEl,
              setSelectedListId,
              setCreatingList,
              setError,
              setDeleteTarget,
              setShowDeleteModal,
            })
          )}
        </React.Fragment>
      );
    } else {
      // Fila para documento
      rows.push(
        <tr key={node.id}>
          <td style={{ padding: 8, paddingLeft: 8 + depth * 32 }}>
            <Typography variant="body2">{node.name}</Typography>
          </td>
          <td style={{ padding: 8 }}>{node.type}</td>
          <td style={{ padding: 8 }}>{node.start_date ? new Date(node.start_date).toLocaleDateString() : '-'}</td>
          <td style={{ padding: 8 }}>{node.end_date ? new Date(node.end_date).toLocaleDateString() : '-'}</td>
          <td style={{ padding: 8 }}>-</td>
          <td style={{ padding: 8 }}>-</td>
          <td style={{ padding: 8, textAlign: 'right' }}>
            <IconButton size="small" onClick={e => { e.stopPropagation(); handleEditList(node); }}>
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={e => {
                e.stopPropagation();
                setDeleteTarget(node);
                setShowDeleteModal(true);
              }}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </td>
        </tr>
      );
    }
  });
  return rows;
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
  // Estado para eliminar
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // For creating lists and antecedentes, fallback to useProjectNodes for mutations
  const { createProject: createList, updateProject, deleteProject } = require('../../hooks/useProjectNodes').useProjectNodes();
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
      setError(extractBackendError(err));
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
      setError(extractBackendError(err));
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
      setError(extractBackendError(err));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
    } catch (err: any) {
      setError(extractBackendError(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Listado de antecedentes</Typography>
      <div style={{ marginTop: 24, marginBottom: 64 }}>
        {/* Tabla raíz de documentos y listados hijos con acordeón */}
        <Box sx={{ overflowX: 'auto', mt: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Fecha inicio</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Fecha fin</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Progreso</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {generateTableRowsWithAccordion({
                nodes: lists,
                depth: 0,
                openAccordions,
                handleAccordionToggle,
                editingListId,
                editListName,
                setEditListName,
                savingEdit,
                handleSaveListName,
                handleEditList,
                setAnchorEl,
                setSelectedListId,
                setCreatingList,
                setError,
                setDeleteTarget,
                setShowDeleteModal,
              })}
            </tbody>
          </table>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedListId(null); setCreatingList(true); setError(null); }} style={{ marginTop: 16 }}>
          Agregar Listado
        </Button>
      </div>
      {/* Popover para agregar listado o antecedentes */}
      <Popover
        open={!!anchorEl && Boolean(creatingList || selectedListId)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 400 }}>
          {/* Si estamos creando un listado y no hay listado seleccionado */}
          {creatingList && !selectedListId && (
            <Box sx={{ padding: 2 }}>
              <TextField
                label="Nombre del listado"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                size="small"
                fullWidth
              />
              <Button onClick={handleCreateList} variant="contained" color="primary" size="small" style={{ marginTop: 8 }}>
                Crear Listado
              </Button>
            </Box>
          )}
          {/* Si hay un listado seleccionado, mostrar opciones para agregar antecedentes o crear listado contenedor */}
          {selectedListId && !creatingList && (
            <>
              <MenuItem disabled>Selecciona el tipo de antecedente a crear:</MenuItem>
              <MenuItem onClick={() => handleCreateAntecedent('document')}>Documento</MenuItem>
              <MenuItem onClick={() => handleCreateAntecedent('form')}>Formulario</MenuItem>
              <MenuItem onClick={() => handleCreateAntecedent('certificate')}>Certificado</MenuItem>
              <MenuItem onClick={() => handleCreateAntecedent('construction_solution')}>Solución Constructiva</MenuItem>
              <MenuItem onClick={() => handleCreateAntecedent('external_link')}>Enlace Externo</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => { setCreatingList(true); setNewListName(''); }}>+ Agregar Listado Contenedor</MenuItem>
            </>
          )}
          {/* Si estamos creando un listado contenedor dentro de otro listado */}
          {creatingList && selectedListId && (
            <Box sx={{ padding: 2 }}>
              <TextField
                label="Nombre del listado contenedor"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                size="small"
                fullWidth
              />
              <Button onClick={async () => {
                if (!newListName.trim()) {
                  setError('El nombre del listado es obligatorio');
                  return;
                }
                setError(null);
                try {
                  const result = await createList.mutateAsync({
                    parent: selectedListId,
                    name: newListName,
                    description: '',
                    is_active: true,
                    type: 'list' as NodeType,
                  });
                  setCreatingList(false);
                  setNewListName('');
                  setSelectedListId(null);
                  setAnchorEl(null);
                  queryClient.invalidateQueries({ queryKey: ['projectNodeTree', stageId] });
                } catch (err: any) {
                  setError(extractBackendError(err));
                }
              }} variant="contained" color="primary" size="small" style={{ marginTop: 8 }}>
                Crear Listado Contenedor
              </Button>
            </Box>
          )}
          {error && <MenuItem disabled style={{ color: 'red' }}>{error}</MenuItem>}
        </Box>
      </Popover>
      {/* Modal de confirmación para eliminar */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Eliminar {deleteTarget?.type === 'list' ? 'Listado' : 'Documento'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget?.type === 'list' && deleteTarget?.children && deleteTarget.children.length > 0 ? (
              <>¿Estás seguro de que deseas eliminar este listado? <b>Se eliminarán también todos los antecedentes y listados hijos asociados.</b></>
            ) : (
              <>¿Estás seguro de que deseas eliminar este {deleteTarget?.type === 'list' ? 'listado' : 'documento'}?</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting} variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListadoDeAntecedentes; 