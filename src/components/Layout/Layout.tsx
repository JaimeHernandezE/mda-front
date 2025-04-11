import React, { useState } from 'react';
import { Container, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from './Footer';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <CssBaseline />
      <Navbar onMenuClick={handleSidebarToggle} />
      <Sidebar isCollapsed={!sidebarOpen} onToggle={handleSidebarToggle} />
      <main className={`${styles.main} ${sidebarOpen ? styles.mainShift : ''}`}>
        <div className={styles.toolbar} />
        <Container maxWidth="lg">{children}</Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 