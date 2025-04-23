import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import CharacterCounter from '../common/CharacterCounter/CharacterCounter';
import styles from './CreateProjectForm.module.scss';

interface FormErrors {
  project_name?: string;
  project_description?: string;
}

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    is_active: true
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject.mutateAsync(formData);
      navigate('/proyectos/lista');
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        console.error('Error al crear el proyecto:', error);
      }
    }
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar el error cuando el usuario empieza a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Crear Nuevo Proyecto</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <CharacterCounter
          label="Nombre del Proyecto"
          name="project_name"
          value={formData.project_name}
          onChange={handleChange('project_name')}
          maxLength={100}
          error={errors.project_name}
          required
        />

        <CharacterCounter
          label="Descripción"
          name="project_description"
          value={formData.project_description}
          onChange={handleChange('project_description')}
          maxLength={1000}
          error={errors.project_description}
          multiline
          required
        />

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            />
            Proyecto Activo
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={createProject.status === 'pending'}
        >
          {createProject.status === 'pending' ? 'Creando...' : 'Crear Proyecto'}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm; 