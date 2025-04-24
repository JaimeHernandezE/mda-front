import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
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

export default ProjectList; 