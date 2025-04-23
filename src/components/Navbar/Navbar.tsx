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
import { useAuth } from '../../context/AuthContext';
interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log(user);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="fixed" className={styles.navbar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          className={styles.menuButton}
          id="sidebar-toggle"
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
          {user ? (
            <>
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
              <span className={styles.userName}>
                {user.first_name + ' ' + user.last_name || user.email}
              </span>
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