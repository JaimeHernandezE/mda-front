import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArchitectureProject } from '../../hooks/useArchitectureProjects';
import { ArchitectureProjectNode } from '../../types/architecture.types';
import styles from './ArchitectureProjectDetail.module.scss';
import { 
  Home as HomeIcon,
  AttachMoney as BudgetIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ArchitectureProjectDetail: React.FC = () => {
  const { projectId, architectureId } = useParams<{ projectId: string; architectureId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useArchitectureProject(
    architectureId ? Number(architectureId) : undefined
  );

  if (!architectureId || isNaN(Number(architectureId))) {
    return (
      <div className={styles.error}>
        <h2>Error de parámetros</h2>
        <p>El ID del proyecto de arquitectura debe ser un número válido.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.loading}>Cargando proyecto...</div>;
  }

  if (isError || !project) {
    return (
      <div className={styles.error}>
        <h2>Error al cargar el proyecto</h2>
        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const architectureProject = project as ArchitectureProjectNode;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{architectureProject.architecture_data?.architecture_project_name || architectureProject.name}</h1>
          <div className={styles.status}>
            Estado: {architectureProject.is_active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigate(`/proyectos/${projectId}`)}>
            Volver al Proyecto
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.details}>
          <h2>Detalles del Proyecto</h2>
          <p>
            <strong>Descripción:</strong> {architectureProject.architecture_data?.architecture_project_description || architectureProject.description}
          </p>
          <p>
            <strong>Fecha de inicio:</strong> {architectureProject.start_date ? new Date(architectureProject.start_date).toLocaleDateString() : 'No definida'}
          </p>
          {architectureProject.architecture_data?.permit_subtype_name && (
            <p>
              <strong>Subtipo de permiso:</strong> {architectureProject.architecture_data.permit_subtype_name}
            </p>
          )}
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
  );
};

export default ArchitectureProjectDetail; 