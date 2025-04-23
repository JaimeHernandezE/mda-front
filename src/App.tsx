// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from './utils/theme';

// Context y páginas
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 }
  }
});

// Verificar que la variable de entorno esté definida
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.error('REACT_APP_GOOGLE_CLIENT_ID no está definida en el archivo .env');
}

// Ruta protegida
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { accessToken } = useAuth();
  return accessToken ? <>{element}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  if (!googleClientId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error de configuración</h1>
        <p>El ID de cliente de Google no está configurado correctamente.</p>
        <p>Por favor, verifica el archivo .env y reinicia la aplicación.</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Router future={{ v7_relativeSplatPath: true }}>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute element={
                    <Layout>
                      <Home />
                    </Layout>
                  } />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
