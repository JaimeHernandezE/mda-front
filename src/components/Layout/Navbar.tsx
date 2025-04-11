import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.scss';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('auth_token');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" className={styles.navbar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          edge="start"
          className={styles.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" className={styles.title}>
          MDC
        </Typography>

        <div className={styles.search}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
          />
        </div>

        <Box sx={{ flexGrow: 1 }} />

        <Box className={styles.actions}>
          {isAuthenticated ? (
            <>
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
              <Avatar
                className={styles.avatar}
                onClick={() => navigate('/profile')}
              />
              <Button
                color="inherit"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              className={styles.loginButton}
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 