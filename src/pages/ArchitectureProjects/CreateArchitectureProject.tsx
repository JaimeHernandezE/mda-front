// src/pages/ArchitectureProjects/CreateArchitectureProject.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { NodeType } from '../../types/project_nodes.types';
import styles from './CreateArchitectureProject.module.scss';
import { useNodeTypeByName } from '../../hooks/useNodeTypeByName';

const CreateArchitectureProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { createProject } = useProjectNodes();
  const { getNodeTypeByName } = useNodeTypeByName();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    type: 'architecture_subproject' as NodeType,
    status: 'en_estudio' as const,
    start_date: '',
    parent: Number(projectId) || null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      const typeId = await getNodeTypeByName('Subproyecto Arquitectónico');
      await createProject.mutateAsync({
        ...formData,
        parent: Number(projectId),
        type: typeId,
      });
      navigate(`/proyectos/${projectId}`);
    } catch (error) {
      console.error('Error al crear el proyecto de arquitectura:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Proyecto de Arquitectura</h1>

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
          <label htmlFor="status">Estado Inicial</label>
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
            value={formData.start_date}
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
          <button
            type="button"
            onClick={() => navigate(`/proyectos/${projectId}`)}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            Crear Proyecto de Arquitectura
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArchitectureProject;
