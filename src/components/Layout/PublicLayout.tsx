import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isPublic={true} />
      <main style={{ flex: 1, marginTop: '64px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 