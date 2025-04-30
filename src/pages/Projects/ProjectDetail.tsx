// src/pages/Projects/ProjectDetail.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { useProjectArchitectureProjects } from '../../hooks/useArchitectureProjects';
import { ArchitectureProjectNode } from '../../types/architecture.types';
import styles from './ProjectDetail.module.scss';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectNodes();
  const { data: architectureProjects, isLoading: isLoadingArchProjects } = useProjectArchitectureProjects(Number(projectId));
  const project = projects?.find(p => p.id === Number(projectId));

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    is_active: project?.is_active || true,
    status: project?.status || 'en_estudio',
    start_date: project?.start_date || '',
    end_date: project?.end_date || ''
  });

  const handleCreateArchitectureProject = () => {
    navigate(`/proyectos/${projectId}/arquitectura/crear`);
  };

  if (!project) {
    return <div className={styles.container}>Proyecto no encontrado</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <h1 className={styles.title}>{project.name}</h1>
        <div className={styles.actions}>
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
          <button 
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre del Proyecto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="en_estudio">En Estudio</option>
              <option value="pendiente">Pendiente</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="start_date">Fecha de Inicio</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_date">Fecha de Fin</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
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
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <h3>Nombre del Proyecto</h3>
            <p>{project.name}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Descripción</h3>
            <p>{project.description}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Estado</h3>
            <p>{project.status}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Progreso</h3>
            <p>{project.progress_percent}%</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Fecha de Inicio</h3>
            <p>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definida'}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Fecha de Fin</h3>
            <p>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No definida'}</p>
          </div>

          <div className={styles.detailItem}>
            <h3>Estado del Proyecto</h3>
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
                {architectureProjects?.map((archProject: ArchitectureProjectNode) => (
                  <div key={archProject.id} className={styles.architectureItem}>
                    <Link to={`/proyectos/${projectId}/arquitectura/${archProject.id}`}>
                      {archProject.architecture_data?.architecture_project_name || archProject.name}
                    </Link>
                    <span className={styles.status} data-active={archProject.is_active}>
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