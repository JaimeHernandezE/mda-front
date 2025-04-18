import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.scss';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <button 
          className={styles.toggleButton}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={styles.toggleIcon} />
        </button>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>
      
      <div className={styles.rightSection}>
        {user ? (
          <div className={styles.userMenu}>
            <span className={styles.userName}>
              {user.first_name || user.email}
            </span>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button 
            className={styles.loginButton}
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 