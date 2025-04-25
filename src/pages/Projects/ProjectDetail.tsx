import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useProjectArchitectureProjects } from '../../hooks/useArchitectureProjects';
import styles from './ProjectDetail.module.scss';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjects();
  const { data: architectureProjects, isLoading: isLoadingArchProjects } = useProjectArchitectureProjects(Number(projectId));
  const project = projects?.find(p => p.id === Number(projectId));

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    project_name: project?.project_name || '',
    project_description: project?.project_description || '',
    is_active: project?.is_active || true
  });

  const handleCreateArchitectureProject = () => {
    navigate(`/proyectos/${projectId}/arquitectura/crear`);
  };

  if (!project) {
    return <div className={styles.container}>Proyecto no encontrado</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject.mutateAsync({ id: project.id, data: formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await deleteProject.mutateAsync(project.id);
        navigate('/proyectos/lista');
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? 'Editar Proyecto' : 'Detalles del Proyecto'}
        </h1>
        <div className={styles.actions}>
          {!isEditing && (
            <>
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
              <button 
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="project_name">Nombre del Proyecto</label>
            <input
              type="text"
              id="project_name"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="project_description">Descripción</label>
            <textarea
              id="project_description"
              name="project_description"
              value={formData.project_description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              Proyecto Activo
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <h3>Nombre del Proyecto</h3>
            <p>{project.project_name}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Descripción</h3>
            <p>{project.project_description}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Estado</h3>
            <p>{project.is_active ? 'Activo' : 'Inactivo'}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Fecha de Creación</h3>
            <p>{new Date(project.created).toLocaleDateString()}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Última Modificación</h3>
            <p>{new Date(project.modified).toLocaleDateString()}</p>
          </div>

          <div className={styles.architectureSection}>
            <h2>Proyectos de Arquitectura</h2>
            <button 
              className={styles.createArchitectureButton}
              onClick={handleCreateArchitectureProject}
            >
              Crear Nuevo Proyecto de Arquitectura
            </button>
            
            {architectureProjects && architectureProjects.length > 0 ? (
              <div className={styles.architectureList}>
                {architectureProjects?.map(archProject => (
                  <div key={archProject.id} className={styles.architectureItem}>
                    <Link to={`/proyectos/${projectId}/arquitectura/${archProject.id}`}>
                      {archProject.architecture_project_name}
                    </Link>
                    <span className={styles.status}>
                      {archProject.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noProjects}>No hay proyectos de arquitectura creados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 