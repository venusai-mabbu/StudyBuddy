import React from 'react';
import { Link } from 'react-router-dom';
import { SECTIONS } from '../constants/sections';

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Home', variant: 'primary' },
    ...Object.entries(SECTIONS).map(([key, section]) => ({
      path: `/${key}`,
      label: section.label,
      variant: 'success'
    })),
    { path: '/post', label: 'POST', variant: 'error' }
  ];

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`nav-button nav-button-${item.variant}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
