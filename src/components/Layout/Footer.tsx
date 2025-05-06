import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="lg">
        <Box className={styles.content}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Manual de Arquitectura. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer; 