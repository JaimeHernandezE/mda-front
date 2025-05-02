import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { ArchitectureProjectNode } from '../../types/architecture.types';
import { NodeType } from '../../types/project_nodes.types';
import styles from './ArchitectureProjectDetail.module.scss';
import {
  Home as HomeIcon,
  AttachMoney as BudgetIcon,
  People as PeopleIcon,
  Description as DocumentIcon,
  Assignment as FormIcon,
  VerifiedUser as CertificateIcon,
  Build as ConstructionIcon,
  Link as LinkIcon,
  Add as AddIcon,
  List as ListIcon,
} from '@mui/icons-material';

const ArchitectureProjectDetail: React.FC = () => {
  const { projectId, architectureId } = useParams<{ projectId: string; architectureId: string }>();
  const navigate = useNavigate();
  const { projects, createProject } = useProjectNodes<ArchitectureProjectNode>({ parent: Number(architectureId) });
  const architectureProject = projects?.find(p => p.id === Number(architectureId));

  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!architectureId || !architectureProject) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>Proyecto de arquitectura no encontrado.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const handleCreateNode = async (type: NodeType) => {
    try {
      setError(null);
      await createProject.mutateAsync({
        parent: architectureProject.id,
        name: `Nuevo ${type}`,
        description: '',
        is_active: true,
        type,
      });
      setShowCreateOptions(false);
    } catch (err: any) {
      console.error('Error al crear el nodo:', err);
      setError('Error al crear el antecedente');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{architectureProject.architecture_data?.architecture_project_name || architectureProject.name}</h1>
        <div className={styles.status}>
          Estado: {architectureProject.is_active ? 'Activo' : 'Inactivo'}
        </div>
        <button className={styles.backButton} onClick={() => navigate(`/proyectos/${projectId}`)}>
          Volver al Proyecto
        </button>
      </header>

      <section className={styles.details}>
        <p><strong>Descripción:</strong> {architectureProject.architecture_data?.architecture_project_description || architectureProject.description}</p>
        <p><strong>Fecha inicio:</strong> {architectureProject.start_date ? new Date(architectureProject.start_date).toLocaleDateString() : 'No definida'}</p>
        <p><strong>Subtipo de permiso:</strong> {architectureProject.architecture_data?.permit_subtype_name || 'No definido'}</p>
      </section>

      <section className={styles.nodes}>
        <h2>Antecedentes</h2>
        {error && <p className={styles.error}>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Estado</th>
              <th>Progreso</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map(node => (
              <tr key={node.id}>
                <td>{node.name}</td>
                <td>{node.type}</td>
                <td>{node.start_date ? new Date(node.start_date).toLocaleDateString() : '-'}</td>
                <td>{node.end_date ? new Date(node.end_date).toLocaleDateString() : '-'}</td>
                <td>{node.status}</td>
                <td>{node.progress_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.addAntecedent}>
        <button onClick={() => setShowCreateOptions(!showCreateOptions)}>
          <AddIcon /> Agregar Antecedente
        </button>
        {showCreateOptions && (
          <div className={styles.antecedentOptions}>
            {[
              { id: 'document' as NodeType, label: 'Documento', icon: <DocumentIcon /> },
              { id: 'form' as NodeType, label: 'Formulario', icon: <FormIcon /> },
              { id: 'certificate' as NodeType, label: 'Certificado', icon: <CertificateIcon /> },
              { id: 'construction_solution' as NodeType, label: 'Solución Constructiva', icon: <ConstructionIcon /> },
              { id: 'external_link' as NodeType, label: 'Enlace Externo', icon: <LinkIcon /> },
              { id: 'list' as NodeType, label: 'Listado', icon: <ListIcon /> },
            ].map(option => (
              <button key={option.id} onClick={() => handleCreateNode(option.id)}>
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ArchitectureProjectDetail;
