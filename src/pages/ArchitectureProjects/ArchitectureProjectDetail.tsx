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
  Edit as EditIcon,
  List as ListIcon,
} from '@mui/icons-material';

interface AntecedentOption {
  id: NodeType;
  label: string;
  icon: React.ReactElement;
  description: string;
}

const antecedentOptions: AntecedentOption[] = [
  { id: 'document', label: 'Documento', icon: <DocumentIcon />, description: 'Agregar un documento al proyecto' },
  { id: 'form', label: 'Formulario', icon: <FormIcon />, description: 'Agregar un formulario al proyecto' },
  { id: 'certificate', label: 'Certificado', icon: <CertificateIcon />, description: 'Agregar un certificado al proyecto' },
  { id: 'construction_solution', label: 'Solución Constructiva', icon: <ConstructionIcon />, description: 'Agregar una solución constructiva' },
  { id: 'external_link', label: 'Enlace Externo', icon: <LinkIcon />, description: 'Agregar un enlace externo' },
  { id: 'list', label: 'Listado', icon: <ListIcon />, description: 'Agregar un listado al proyecto' },
];

const ArchitectureProjectDetail: React.FC = () => {
  const { projectId, architectureId } = useParams<{ projectId: string; architectureId: string }>();
  const navigate = useNavigate();

  const { projects: architectureProjects } = useProjectNodes<ArchitectureProjectNode>({ type: 'architecture_subproject' });
  const architectureProject = architectureProjects?.find(p => p.id === Number(architectureId));

  const { projects: childNodes, createProject } = useProjectNodes<ArchitectureProjectNode>({ parent: Number(architectureId) });

  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStageId, setActiveStageId] = useState<number | null>(null);

  const stages = childNodes?.filter(node => node.type === 'stage') || [];
  const activeStage = stages.find(stage => stage.id === activeStageId);
  const activeStageChildren = activeStage?.children || [];

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
    if (!activeStageId) {
      setError('Selecciona una etapa antes de agregar antecedentes');
      return;
    }
    try {
      setError(null);
      await createProject.mutateAsync({
        parent: activeStageId,
        name: `Nuevo ${type}`,
        description: '',
        is_active: true,
        type,
      });
      setShowCreateOptions(false);
    } catch (err: any) {
      console.error('Error al crear el nodo:', err);
      setError(err.response?.data?.detail || 'Error al crear el antecedente');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{architectureProject.name}</h1>
          <div className={styles.status}>
            Estado: {architectureProject.is_active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.editButton}
            onClick={() => navigate(`/proyectos/${projectId}/arquitectura/${architectureId}/editar`)}
          >
            <EditIcon /> Editar Proyecto
          </button>
          <button 
            className={styles.backButton}
            onClick={() => navigate(`/proyectos/${projectId}`)}
          >
            Volver al Proyecto
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <main className={styles.mainInfo}>
          <section className={styles.infoSection}>
            <h2>Detalles del Proyecto</h2>
            <p><strong>Descripción:</strong> {architectureProject.description}</p>
            <p><strong>Fecha de inicio:</strong> {architectureProject.start_date ? new Date(architectureProject.start_date).toLocaleDateString() : 'No definida'}</p>
            <p><strong>Subtipo de permiso:</strong> {architectureProject.architecture_data?.permit_subtype_name || 'No definido'}</p>
          </section>
        </main>

        <aside className={styles.sideMenu}>
          <div className={styles.menuSection}>
            <Link to={`/proyectos/${projectId}/arquitectura/${architectureId}/propiedad`} className={styles.menuButton}><HomeIcon className={styles.icon} />Propiedad</Link>
            <Link to={`/proyectos/${projectId}/arquitectura/${architectureId}/presupuestos`} className={styles.menuButton}><BudgetIcon className={styles.icon} />Presupuestos</Link>
            <Link to={`/proyectos/${projectId}/arquitectura/${architectureId}/profesionales`} className={styles.menuButton}><PeopleIcon className={styles.icon} />Propietario / Profesionales</Link>
          </div>
        </aside>
      </div>

      <section className={styles.antecedentesSection}>
        <div className={styles.stagesNavigation}>
          <div className={styles.stagesContainer}>
            {stages.map(stage => (
              <button
                key={stage.id}
                className={`${styles.stageButton} ${activeStageId === stage.id ? styles.active : ''}`}
                onClick={() => setActiveStageId(stage.id)}
              >
                {stage.name}
              </button>
            ))}
          </div>
        </div>

        <h2>Listado de antecedentes</h2>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.tableContainer}>
          <table className={styles.antecedentesTable}>
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
              {activeStageChildren.map(node => (
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
        </div>

        <div className={styles.addAntecedentSection}>
          <button className={styles.addButton} onClick={() => setShowCreateOptions(!showCreateOptions)}>
            <AddIcon /> Agregar Antecedente
          </button>
          {showCreateOptions && (
            <div className={styles.antecedentesGrid}>
              {antecedentOptions.map(option => (
                <button
                  key={option.id}
                  className={styles.antecedentCard}
                  onClick={() => handleCreateNode(option.id)}
                  disabled={createProject.isPending}
                >
                  <div className={styles.antecedentIcon}>{option.icon}</div>
                  <h3>{option.label}</h3>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArchitectureProjectDetail;
