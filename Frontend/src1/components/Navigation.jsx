import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { auth } = useAuth();

  const defaultItems = [
    { label: 'HOME', path: '/', category: 'HOME', color: 'blue' },
    { label: 'POST', path: '/post', category: 'POST', color: 'red' }
  ];

  const sectionItems = (auth.sections || []).map((section) => ({
    label: section.toUpperCase(),
    path: `/section/${section}`,
    category: section.toUpperCase(),
    color: 'green'
  }));

  const navItems = [...defaultItems, ...sectionItems];

  return (
    <nav className="navigation">
      <div className="navigation-container">
        {navItems.map((item) => (
          <Link
            key={item.category}
            to={item.path}
            className={`navigation-link navigation-${item.color} ${
              location.pathname === item.path ? 'navigation-active' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
