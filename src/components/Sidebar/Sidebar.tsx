import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Tooltip, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './Sidebar.module.scss';
import classNames from 'classnames';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isCollapsed, onToggle }, ref) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      ref={ref}
      className={classNames(styles.sidebar, {
        [styles.collapsed]: isCollapsed
      })}
    >
      <Box className={styles.toggleButton}>
        <IconButton onClick={onToggle} size="large">
          <MenuIcon />
        </IconButton>
      </Box>
      
      <List component="nav" className={styles.menuList}>
        <Link to="/" className={styles.menuLink}>
          <Tooltip title={isCollapsed ? 'Dashboard' : ''} placement="right">
            <ListItem
              component="div"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
              className={classNames(styles.menuItem, {
                [styles.active]: isActive('/')
              })}
            >
              <ListItemIcon className={styles.menuIcon}>
                <DashboardIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Dashboard" 
                  className={styles.menuText}
                />
              )}
            </ListItem>
          </Tooltip>
        </Link>
        <Link to="/profile" className={styles.menuLink}>
          <Tooltip title={isCollapsed ? 'Profile' : ''} placement="right">
            <ListItem
              component="div"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
              className={classNames(styles.menuItem, {
                [styles.active]: isActive('/profile')
              })}
            >
              <ListItemIcon className={styles.menuIcon}>
                <PersonIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Profile" 
                  className={styles.menuText}
                />
              )}
            </ListItem>
          </Tooltip>
        </Link>
        <Link to="/settings" className={styles.menuLink}>
          <Tooltip title={isCollapsed ? 'Settings' : ''} placement="right">
            <ListItem
              component="div"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
              className={classNames(styles.menuItem, {
                [styles.active]: isActive('/settings')
              })}
            >
              <ListItemIcon className={styles.menuIcon}>
                <SettingsIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Settings" 
                  className={styles.menuText}
                />
              )}
            </ListItem>
          </Tooltip>
        </Link>
      </List>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 