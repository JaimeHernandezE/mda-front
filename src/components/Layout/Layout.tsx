import React, { useState, useEffect, useRef } from 'react';
import styles from './Layout.module.scss';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el sidebar está cerrado, no hacemos nada
      if (!sidebarOpen) return;

      // Verificamos si el clic fue en el botón de toggle
      const toggleButton = document.getElementById('sidebar-toggle');
      if (toggleButton?.contains(event.target as Node)) return;

      // Verificamos si el clic fue fuera del sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.layout}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <div className={styles.content}>
        <Sidebar 
          ref={sidebarRef}
          isCollapsed={!sidebarOpen} 
          onToggle={handleSidebarToggle} 
        />
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