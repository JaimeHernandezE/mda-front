import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import styles from './ProjectList.module.scss';

const ProjectList: React.FC = () => {
  const { projects, isLoadingProjects } = useProjects();

  if (isLoadingProjects) {
    return <div className={styles.loading}>Cargando proyectos...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Proyectos</h1>
      <div className={styles.grid}>
        {projects?.map((project) => (
          <div key={project.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{project.project_name}</h2>
            <p className={styles.cardDescription}>{project.project_description}</p>
            <div className={styles.cardFooter}>
              <span className={styles.cardDate}>
                Creado: {new Date(project.created).toLocaleDateString()}
              </span>
              <button className={styles.cardButton}>Ver detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList; 