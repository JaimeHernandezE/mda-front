import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Typography, Box
} from '@mui/material';
import { useAssignProjectNodePermission, useRemoveProjectNodePermission, useProjectNodeUserPermissions } from '../../hooks/useProjectNodePermissions';

interface NodePermissionsModalProps {
  open: boolean;
  onClose: () => void;
  nodeId: number | undefined;
}

// Usuarios y roles de prueba
const roles = [
  { key: 'arquitecto', label: 'Arquitectos' },
  { key: 'constructor', label: 'Constructores' },
  { key: 'revisor', label: 'Revisores' },
];

const users = [
  { id: 1, email: 'arq1@email.com', nombre: 'Arq. Ana', role: 'arquitecto' },
  { id: 2, email: 'arq2@email.com', nombre: 'Arq. Pablo', role: 'arquitecto' },
  { id: 3, email: 'cons1@email.com', nombre: 'Cons. Juan', role: 'constructor' },
  { id: 4, email: 'rev1@email.com', nombre: 'Rev. Laura', role: 'revisor' },
];

const PERMISSIONS = [
  { key: 'view_projectnode', label: 'Puede ver' },
  { key: 'change_projectnode', label: 'Puede editar' },
  { key: 'delete_projectnode', label: 'Puede eliminar' },
];

// Componente para mostrar los permisos de un usuario en la tabla principal
const UserPermissionRow: React.FC<{
  user: typeof users[0];
  nodeId: number | undefined;
  onClick: () => void;
}> = ({ user, nodeId, onClick }) => {
  const permsQuery = useProjectNodeUserPermissions(nodeId, user.id);
  const perms = permsQuery.data || [];
  return (
    <TableRow hover style={{ cursor: 'pointer' }} onClick={onClick}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.nombre}</TableCell>
      {PERMISSIONS.map(p => (
        <TableCell key={p.key} align="center">
          <Checkbox checked={perms.includes(p.key)} disabled size="small" />
        </TableCell>
      ))}
    </TableRow>
  );
};

// Componente para editar permisos de un usuario
const UserPermissionEditor: React.FC<{
  user: typeof users[0];
  nodeId: number;
  roles: typeof roles;
  onBack: () => void;
}> = ({ user, nodeId, roles, onBack }) => {
  const assignPermission = useAssignProjectNodePermission();
  const removePermission = useRemoveProjectNodePermission();
  const permsQuery = useProjectNodeUserPermissions(nodeId, user.id);
  const perms = permsQuery.data || [];
  const isLoading = permsQuery.isLoading || assignPermission.isPending || removePermission.isPending;

  const handleToggle = (permission: string, checked: boolean) => {
    if (!nodeId) return;
    if (checked) {
      assignPermission.mutate({ nodeId, user_id: user.id, permission });
    } else {
      removePermission.mutate({ nodeId, user_id: user.id, permission });
    }
  };

  return (
    <>
      <DialogTitle>Permisos de {user.nombre}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle1"><b>Email:</b> {user.email}</Typography>
          <Typography variant="subtitle1"><b>Rol:</b> {roles.find(r => r.key === user.role)?.label}</Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              {PERMISSIONS.map(p => (
                <TableCell key={p.key} align="center">{p.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {PERMISSIONS.map(p => (
                <TableCell key={p.key} align="center">
                  <Checkbox
                    checked={perms.includes(p.key)}
                    onChange={e => handleToggle(p.key, e.target.checked)}
                    disabled={isLoading}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBack} disabled={isLoading}>Volver al listado</Button>
      </DialogActions>
    </>
  );
};

const NodePermissionsModal: React.FC<NodePermissionsModalProps> = ({ open, onClose, nodeId }) => {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  // Agrupa los usuarios por rol
  const usersByRole: { [role: string]: typeof users } = {};
  users.forEach(user => {
    if (!Array.isArray(usersByRole[user.role])) {
      usersByRole[user.role] = [];
    }
    usersByRole[user.role].push(user);
  });

  // Vista principal: listado de usuarios agrupados por rol
  const renderUserList = () => (
    <>
      <DialogTitle>Permisos por usuario</DialogTitle>
      <DialogContent>
        {roles.map(role => (
          <Box key={role.key} mb={3}>
            <Typography variant="h6" gutterBottom>{role.label}</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Nombre</TableCell>
                  {PERMISSIONS.map(p => (
                    <TableCell key={p.key} align="center">{p.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {usersByRole[role.key]?.map(user => (
                  <UserPermissionRow
                    key={user.id}
                    user={user}
                    nodeId={nodeId}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {selectedUser && nodeId ? (
        <UserPermissionEditor user={selectedUser} nodeId={nodeId} roles={roles} onBack={() => setSelectedUser(null)} />
      ) : (
        renderUserList()
      )}
    </Dialog>
  );
};

export default NodePermissionsModal; 