// src/pages/Login.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = (response: any) => {
    if (response.credential) {
      loginWithGoogle(response.credential);
    }
  };

  const handleGoogleError = () => {
    console.error('Error en el login de Google');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>Inicia sesión para continuar</p>
        
        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            auto_select
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;