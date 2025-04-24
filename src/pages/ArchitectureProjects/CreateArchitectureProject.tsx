import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import styles from './CreateArchitectureProject.module.scss';

interface ArchitectureProjectForm {
  project: number;
  architecture_project_name: string;
  architecture_project_description: string;
  is_active: boolean;
  start_date: string;
  permit_subtype: string;
  loteo_contruccion_simultanea: boolean;
  loteo_dfl2: boolean;
}

const CreateArchitectureProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ArchitectureProjectForm>({
    project: Number(id),
    architecture_project_name: '',
    architecture_project_description: '',
    is_active: true,
    start_date: new Date().toISOString().split('T')[0],
    permit_subtype: '',
    loteo_contruccion_simultanea: false,
    loteo_dfl2: false
  });

  const createArchitectureProject = useMutation({
    mutationFn: (data: ArchitectureProjectForm) => 
      axios.post('/api/architecture-projects/', data),
    onSuccess: () => {
      navigate(`/proyectos/${id}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createArchitectureProject.mutate(formData);
  };

  return (
    <div className={styles.container}>
      <h1>Crear Proyecto de Arquitectura</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="architecture_project_name">Nombre del Proyecto</label>
          <input
            type="text"
            id="architecture_project_name"
            name="architecture_project_name"
            value={formData.architecture_project_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="architecture_project_description">Descripción</label>
          <textarea
            id="architecture_project_description"
            name="architecture_project_description"
            value={formData.architecture_project_description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="start_date">Fecha de Inicio</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="permit_subtype">Tipo de Permiso</label>
          <select
            id="permit_subtype"
            name="permit_subtype"
            value={formData.permit_subtype}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="obra_nueva">Obra Nueva</option>
            {/* Agregaremos más opciones cuando nos las proporcionen */}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="loteo_contruccion_simultanea"
              checked={formData.loteo_contruccion_simultanea}
              onChange={handleInputChange}
            />
            Loteo Construcción Simultánea
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="loteo_dfl2"
              checked={formData.loteo_dfl2}
              onChange={handleInputChange}
            />
            Loteo DFL2
          </label>
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
          <button type="button" onClick={() => navigate(`/proyectos/${id}`)}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitButton}>
            Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArchitectureProject; 