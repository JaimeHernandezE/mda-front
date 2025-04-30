import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useArchitectureProject } from '../../hooks/useArchitectureProjects';
import { useArchitectureProjectNodes } from '../../hooks/useArchitectureProjectNodes';
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
  List as ListIcon
} from '@mui/icons-material';

type NodeType = 'document' | 'form' | 'certificate' | 'construction_solution' | 'external_link' | 'list';

interface AntecedentOption {
  id: NodeType;
  label: string;
  icon: React.ReactElement;
  description: string;
}

const antecedentOptions: AntecedentOption[] = [
  {
    id: 'document',
    label: 'Documento',
    icon: <DocumentIcon />,
    description: 'Agregar un documento al proyecto'
  },
  {
    id: 'form',
    label: 'Formulario',
    icon: <FormIcon />,
    description: 'Agregar un formulario al proyecto'
  },
  {
    id: 'certificate',
    label: 'Certificado',
    icon: <CertificateIcon />,
    description: 'Agregar un certificado al proyecto'
  },
  {
    id: 'construction_solution',
    label: 'Solución Constructiva',
    icon: <ConstructionIcon />,
    description: 'Agregar una solución constructiva'
  },
  {
    id: 'external_link',
    label: 'Enlace Externo',
    icon: <LinkIcon />,
    description: 'Agregar un enlace externo'
  },
  {
    id: 'list',
    label: 'Listado',
    icon: <ListIcon />,
    description: 'Agregar un listado al proyecto'
  }
];

const ArchitectureProjectDetail: React.FC = () => {
  const { projectId, architectureId } = useParams<{ projectId: string; architectureId: string }>();
  const navigate = useNavigate();
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: project, isLoading: isLoadingProject, isError, error: projectError } = useArchitectureProject(
    architectureId ? Number(architectureId) : undefined
  );

  const { nodes, isLoadingNodes, addNode } = useArchitectureProjectNodes(
    architectureId ? Number(architectureId) : undefined
  );

  const handleCreateNode = async (type: NodeType) => {
    if (!architectureId) return;
    
    try {
      setError(null);
      await addNode.mutateAsync({
        type,
        name: `Nuevo ${type}`,
        description: '',
        is_active: true,
        file_type_id: 1 // Ajusta este valor según tus necesidades
      });
      setShowCreateOptions(false);
    } catch (err: any) {
      console.error('Error al crear el nodo:', err);
      setError(err.response?.data?.detail || 'Error al crear el antecedente');
    }
  };

  if (!architectureId || isNaN(Number(architectureId))) {
    return (
      <div className={styles.error}>
        <h2>Error de parámetros</h2>
        <p>El ID del proyecto de arquitectura debe ser un número válido.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (isLoadingProject || isLoadingNodes) {
    return <div className={styles.loading}>Cargando proyecto...</div>;
  }

  if (isError || !project) {
    return (
      <div className={styles.error}>
        <h2>Error al cargar el proyecto</h2>
        <p>{projectError instanceof Error ? projectError.message : 'Error desconocido'}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const architectureData = project.architecture_data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{architectureData?.architecture_project_name || project.name}</h1>
          <div className={styles.status}>
            Estado: {project.is_active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
        <button 
          className={styles.backButton}
          onClick={() => navigate(`/proyectos/${projectId}`)}
        >
          Volver al Proyecto
        </button>
      </header>

      <div className={styles.content}>
        <main className={styles.mainInfo}>
          <section className={styles.infoSection}>
            <h2>Detalles del Proyecto</h2>
            <p>
              <strong>Descripción:</strong> {architectureData?.architecture_project_description || project.description}
            </p>
            <p>
              <strong>Fecha de inicio:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definida'}
            </p>
            <p>
              <strong>Subtipo de permiso:</strong> {architectureData?.permit_subtype_name || 'No definido'}
            </p>
          </section>
        </main>

        <aside className={styles.sideMenu}>
          <div className={styles.menuSection}>
            <Link 
              to={`/proyectos/${projectId}/arquitectura/${architectureId}/propiedad`}
              className={styles.menuButton}
            >
              <HomeIcon className={styles.icon} />
              Propiedad
            </Link>
            <Link 
              to={`/proyectos/${projectId}/arquitectura/${architectureId}/presupuestos`}
              className={styles.menuButton}
            >
              <BudgetIcon className={styles.icon} />
              Presupuestos
            </Link>
            <Link 
              to={`/proyectos/${projectId}/arquitectura/${architectureId}/profesionales`}
              className={styles.menuButton}
            >
              <PeopleIcon className={styles.icon} />
              Propietario / Profesionales
            </Link>
          </div>
        </aside>
      </div>

      <section className={styles.antecedentesSection}>
        <h2>Listado de antecedentes</h2>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
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
              {nodes?.map((node) => (
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
          <button 
            className={styles.addButton}
            onClick={() => setShowCreateOptions(!showCreateOptions)}
          >
            <AddIcon /> Agregar Antecedente
          </button>

          {showCreateOptions && (
            <div className={styles.antecedentesGrid}>
              {antecedentOptions.map((option) => (
                <button
                  key={option.id}
                  className={styles.antecedentCard}
                  onClick={() => handleCreateNode(option.id)}
                  disabled={addNode.isPending}
                >
                  <div className={styles.antecedentIcon}>
                    {option.icon}
                  </div>
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