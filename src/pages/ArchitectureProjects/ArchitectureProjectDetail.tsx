import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useArchitectureProject } from '../../hooks/useArchitectureProjects';
import styles from './ArchitectureProjectDetail.module.scss';
import classNames from 'classnames';

type MenuId = 'constructiveSolutions';
type SubMenuId = 'fireSolutions';
type SubSubMenuId = 'additiveMethod';

const ArchitectureProjectDetail: React.FC = () => {
  const { projectId, architectureId } = useParams<{ projectId: string; architectureId: string }>();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuId | null>(null);
  const [activeSubSubMenu, setActiveSubSubMenu] = useState<SubSubMenuId | null>(null);

  const { data: project, isLoading, isError, error } = useArchitectureProject(
    architectureId ? Number(architectureId) : undefined
  );

  console.log('Architecture Project ID:', architectureId);
  console.log('Project Data:', project);

  const handleMenuClick = (menuId: MenuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
    setActiveSubMenu(null);
    setActiveSubSubMenu(null);
  };

  const handleSubMenuClick = (subMenuId: SubMenuId) => {
    setActiveSubMenu(activeSubMenu === subMenuId ? null : subMenuId);
    setActiveSubSubMenu(null);
  };

  const handleSubSubMenuClick = (subSubMenuId: SubSubMenuId) => {
    setActiveSubSubMenu(activeSubSubMenu === subSubMenuId ? null : subSubMenuId);
  };

  if (!architectureId || isNaN(Number(architectureId))) {
    return (
      <div className={styles.error}>
        <h2>Error de parámetros</h2>
        <p>El ID del proyecto de arquitectura debe ser un número válido.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.loading}>Cargando proyecto...</div>;
  }

  if (isError || !project) {
    return (
      <div className={styles.error}>
        <h2>Error al cargar el proyecto</h2>
        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{project.architecture_project_name}</h1>
          <div className={styles.status}>
            Estado: {project.is_active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
        <button 
          className={styles.backButton}
          onClick={() => navigate(`/proyectos/${projectId}`)}
        >
          Volver al Proyecto
        </button>
      </header>

      <div className={styles.content}>
        <main className={styles.mainInfo}>
          <section className={styles.infoSection}>
            <h2>Detalles del Proyecto</h2>
            <p>
              <strong>Descripción:</strong> {project.architecture_project_description}
            </p>
            <p>
              <strong>Fecha de inicio:</strong> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No definida'}
            </p>
            <p>
              <strong>Subtipo de permiso:</strong> {project.permit_subtype}
            </p>
          </section>
        </main>

        <aside className={styles.sideMenu}>
          <div className={styles.menuSection}>
            <button
              className={classNames(styles.menuButton, {
                [styles.active]: activeMenu === 'constructiveSolutions'
              })}
              onClick={() => handleMenuClick('constructiveSolutions')}
            >
              Soluciones constructivas
            </button>

            {activeMenu === 'constructiveSolutions' && (
              <div className={styles.subMenu}>
                <button
                  className={classNames(styles.subMenuButton, {
                    [styles.active]: activeSubMenu === 'fireSolutions'
                  })}
                  onClick={() => handleSubMenuClick('fireSolutions')}
                >
                  Soluciones contra el fuego
                </button>

                {activeSubMenu === 'fireSolutions' && (
                  <div className={styles.subSubMenu}>
                    <button
                      className={classNames(styles.subSubMenuButton, {
                        [styles.active]: activeSubSubMenu === 'additiveMethod'
                      })}
                      onClick={() => handleSubSubMenuClick('additiveMethod')}
                    >
                      Método aditivo de componentes
                    </button>

                    {activeSubSubMenu === 'additiveMethod' && (
                      <div className={styles.actions}>
                        <Link 
                          to={`/proyectos/${projectId}/arquitectura/${architectureId}/soluciones/crear`}
                          className={styles.actionLink}
                        >
                          Crear Solución
                        </Link>
                        <Link 
                          to={`/proyectos/${projectId}/arquitectura/${architectureId}/soluciones/lista`}
                          className={styles.actionLink}
                        >
                          Listar Soluciones
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArchitectureProjectDetail; 