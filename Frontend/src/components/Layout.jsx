import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* Background Pattern */}
      <div className="layout-background">
        <div className="layout-pattern"></div>
      </div>
      
      <div className="layout-content">
        <Header />
        <Navigation />
        <main className="layout-main">
          <div className="layout-main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;