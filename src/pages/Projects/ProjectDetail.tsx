// src/pages/Projects/ProjectDetail.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjectNodes } from '../../hooks/useProjectNodes';
import { useProjectArchitectureProjects } from '../../hooks/useArchitectureProjects';
import styles from './ProjectDetail.module.scss';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectNodes();
  const { data: architectureProjects } = useProjectArchitectureProjects(Number(projectId));
  const project = projects?.find(p => p.id === Number(projectId));

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    is_active: project?.is_active || true,
    status: project?.status || 'en_estudio',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    cover_image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.cover_image_url || null);

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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, cover_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value.toString());
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      });

      await updateProject.mutateAsync({ id: project.id, data: formDataToSend });
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
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                Editar
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="en_estudio">En Estudio</option>
            <option value="pendiente">Pendiente</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleInputChange} />
          <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleInputChange} />
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
          <input type="file" name="cover_image" accept="image/*" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          <button type="submit">Guardar Cambios</button>
        </form>
      ) : (
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>{project.status}</p>
          <p>{project.progress_percent}% completado</p>
          <p>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definida'}</p>
          <p>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No definida'}</p>
          <p>{project.is_active ? 'Activo' : 'Inactivo'}</p>
          <p>{new Date(project.created_at).toLocaleDateString()}</p>
          <p>{new Date(project.updated_at).toLocaleDateString()}</p>
          {project.cover_image_url ? (
            <img src={project.cover_image_url} alt="Portada del proyecto" />
          ) : (
            <p>No hay imagen de portada</p>
          )}
        </div>
      )}

      <div>
        <h2>Proyectos de Arquitectura</h2>
        <button onClick={handleCreateArchitectureProject}>Crear Nuevo Proyecto de Arquitectura</button>
        {architectureProjects && architectureProjects.length > 0 ? (
          <ul>
            {architectureProjects.map((arch) => (
              <li key={arch.id}>
                <Link to={`/proyectos/${projectId}/arquitectura/${arch.id}`}>
                  {arch.architecture_data?.architecture_project_name || arch.name}
                </Link>
                <span>{arch.is_active ? 'Activo' : 'Inactivo'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay proyectos de arquitectura creados</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
