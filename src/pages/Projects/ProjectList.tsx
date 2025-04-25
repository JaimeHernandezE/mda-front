import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useProjectArchitectureProjects } from '../../hooks/useArchitectureProjects';
import styles from './ProjectList.module.scss';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoadingProjects } = useProjects();

  const handleCreateProject = () => {
    navigate('/proyectos/crear');
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/proyectos/${projectId}`);
  };

  if (isLoadingProjects) {
    return <div className={styles.loading}>Cargando proyectos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Proyectos</h1>
        <button 
          className={styles.createButton}
          onClick={handleCreateProject}
        >
          Crear Proyecto
        </button>
      </div>
      <div className={styles.grid}>
        {projects?.map((project) => (
          <div key={project.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{project.project_name}</h2>
            <p className={styles.cardDescription}>{project.project_description}</p>
            
            <div className={styles.architectureProjects}>
              <h3 className={styles.architectureTitle}>Proyectos de Arquitectura</h3>
              <ProjectArchitectureList projectId={project.id} />
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.status}>
                {project.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <button 
                className={styles.viewButton}
                onClick={() => handleViewProject(project.id)}
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar la lista de proyectos de arquitectura
const ProjectArchitectureList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { data: architectureProjects, isLoading } = useProjectArchitectureProjects(projectId);

  if (isLoading) {
    return <div className={styles.loading}>Cargando proyectos de arquitectura...</div>;
  }

  if (!architectureProjects || architectureProjects.length === 0) {
    return <p className={styles.noArchitectureProjects}>No hay proyectos de arquitectura</p>;
  }

  return (
    <ul className={styles.architectureList}>
      {architectureProjects.map((archProject) => (
        <li key={archProject.id} className={styles.architectureItem}>
          <Link 
            to={`/proyectos/${projectId}/arquitectura/${archProject.id}`}
            className={styles.architectureLink}
          >
            {archProject.architecture_project_name}
          </Link>
          <span className={styles.architectureStatus}>
            {archProject.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList; 