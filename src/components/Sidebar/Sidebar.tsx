import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText, Tooltip, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/', icon: <DashboardIcon />, text: 'Dashboard' },
  { path: '/profile', icon: <PersonIcon />, text: 'Profile' },
  { path: '/settings', icon: <SettingsIcon />, text: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  return (
    <Box className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <Box className={styles.toggleButton}>
        <IconButton onClick={onToggle} size="large">
          <MenuIcon />
        </IconButton>
      </Box>
      
      <List component="nav" className={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link to={item.path} key={item.path} className={styles.menuLink}>
              <Tooltip title={isCollapsed ? item.text : ''} placement="right">
                <ListItem
                  component="div"
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                  className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                >
                  <ListItemIcon className={styles.menuIcon}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary={item.text} 
                      className={styles.menuText}
                    />
                  )}
                </ListItem>
              </Tooltip>
            </Link>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar; 