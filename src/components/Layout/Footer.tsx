import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          © {currentYear} MDA. Todos los derechos reservados.
        </div>
        <div className={styles.links}>
          <a href="/privacy" className={styles.link}>
            Privacidad
          </a>
          <a href="/terms" className={styles.link}>
            Términos
          </a>
          <a href="/contact" className={styles.link}>
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 