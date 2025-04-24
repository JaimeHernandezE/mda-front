import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePermitTypes } from '../../hooks/usePermitTypes';
import { useArchitectureProjects } from '../../hooks/useArchitectureProjects';
import { CreateArchitectureProjectDto } from '../../types/architecture.types';
import styles from './CreateArchitectureProject.module.scss';

const CreateArchitectureProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { permitTypes, isLoading, isError, error } = usePermitTypes();
  const { createArchitectureProject } = useArchitectureProjects(Number(id));
  
  const [formData, setFormData] = useState<CreateArchitectureProjectDto>({
    project: Number(id),
    architecture_project_name: '',
    architecture_project_description: '',
    is_active: true,
    start_date: new Date().toISOString().split('T')[0],
    permit_subtype: undefined
  });

  const [selectedPermitType, setSelectedPermitType] = useState<number>(0);

  useEffect(() => {
    console.log('Current permitTypes:', permitTypes);
    console.log('Selected permit type:', selectedPermitType);
  }, [permitTypes, selectedPermitType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    console.log('Input change:', name, value);
    
    if (name === 'permit_type') {
      const numValue = Number(value);
      console.log('Setting permit type:', numValue);
      setSelectedPermitType(numValue);
      setFormData(prev => ({
        ...prev,
        permit_subtype: undefined
      }));
    } else if (name === 'permit_subtype') {
      setFormData(prev => ({
        ...prev,
        permit_subtype: value ? Number(value) : undefined
      }));
    } else if (name === 'is_active') {
      setFormData(prev => ({
        ...prev,
        is_active: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      await createArchitectureProject.mutateAsync(formData);
      navigate(`/proyectos/${id}`);
    } catch (error) {
      console.error('Error creating architecture project:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando tipos de permiso...</div>;
  }

  if (isError) {
    console.error('Error loading permit types:', error);
    return <div>Error al cargar los tipos de permiso. Por favor, intente nuevamente.</div>;
  }

  const selectedType = permitTypes?.find(type => type.id === selectedPermitType);
  console.log('Selected type details:', selectedType);

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
            value={formData.architecture_project_name || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="architecture_project_description">Descripción</label>
          <textarea
            id="architecture_project_description"
            name="architecture_project_description"
            value={formData.architecture_project_description || ''}
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
            value={formData.start_date || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="permit_type">Tipo de Permiso</label>
          <select
            id="permit_type"
            name="permit_type"
            value={selectedPermitType || ''}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            <option value="">Seleccione un tipo</option>
            {permitTypes && permitTypes.length > 0 ? (
              permitTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.permit_type}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay tipos de permiso disponibles</option>
            )}
          </select>
        </div>

        {selectedType && (
          <div className={styles.formGroup}>
            <label htmlFor="permit_subtype">Subtipo de Permiso</label>
            <select
              id="permit_subtype"
              name="permit_subtype"
              value={formData.permit_subtype || ''}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="">Seleccione un subtipo</option>
              {Object.entries(selectedType.subtypes).map(([group, subtypes]) => (
                <optgroup key={group} label={group}>
                  {subtypes.map(subtype => (
                    <option key={subtype.id} value={subtype.id}>
                      {subtype.permit_sub_type}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}

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
            onClick={() => navigate(`/proyectos/${id}`)}
            disabled={createArchitectureProject.isPending}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={createArchitectureProject.isPending}
          >
            {createArchitectureProject.isPending ? 'Creando...' : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArchitectureProject; 