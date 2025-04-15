import React, { useState } from 'react';
import styles from './Layout.module.scss';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <div className={styles.content}>
        <Sidebar isCollapsed={!sidebarOpen} onToggle={handleSidebarToggle} />
        <main className={`${styles.main} ${sidebarOpen ? styles.mainShift : ''}`}>
          <div className={styles.toolbar} />
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 