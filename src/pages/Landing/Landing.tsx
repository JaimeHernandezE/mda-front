import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.scss';

const Landing: React.FC = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.logoContainer}>
            {/* Aquí irá el logo cuando lo tengamos */}
            <div className={styles.logoPlaceholder}>MDA</div>
          </div>
          <h1>Manual de Arquitectura</h1>
          <p className={styles.subtitle}>
            Una plataforma intuitiva para registrar y dar seguimiento a tu
            proyectos de arquitectura y construcción
          </p>
        </section>

        <section className={styles.features}>
          <h2>¿Qué ofrecemos?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Registro Diario</h3>
              <p>Documenta tus avances, ideas y reflexiones en un formato estructurado y fácil de usar</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Seguimiento de Progreso</h3>
              <p>Visualiza tu evolución a lo largo del tiempo y mantén un registro de tus logros</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Organización Personal</h3>
              <p>Mantén tus notas organizadas por temas, fechas y categorías para un acceso rápido</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Comienza tu viaje de aprendizaje hoy</h2>
          <p>Únete a nuestra comunidad y empieza a documentar tu progreso</p>
          <Link to="/login" className={styles.ctaButton}>
            Iniciar Sesión
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Landing; 