import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a MDA App
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item component={Box} xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acerca de la Aplicación
            </Typography>
            <Typography variant="body1">
              Esta es una aplicación de ejemplo que conecta un frontend en React
              con un backend en Django. Aquí podrás ver cómo se implementa la
              autenticación, manejo de estado, y comunicación entre el frontend
              y el backend.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item component={Box} xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Características
            </Typography>
            <Typography component="ul">
              <li>Autenticación de usuarios</li>
              <li>Manejo de estado con React Query</li>
              <li>Interfaz de usuario con Material-UI</li>
              <li>Tipado fuerte con TypeScript</li>
              <li>Integración con API REST de Django</li>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 