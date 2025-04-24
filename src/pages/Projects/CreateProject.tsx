import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import styles from './CreateProject.module.scss';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();

  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    is_active: true
  });

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
      await createProject.mutateAsync(formData);
      navigate('/proyectos/lista');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Nuevo Proyecto</h1>
      </div>

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
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/proyectos/lista')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject; 