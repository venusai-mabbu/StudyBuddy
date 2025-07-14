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

  const sectionToItem = (section) => ({
    label: section.toUpperCase(),
    path: `/${section}`,
    category: section.toUpperCase(),
    color: 'green'
  });

  const sectionItems = auth.sections.map(sectionToItem);
  const navItems = [...defaultItems, ...sectionItems];

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <div className="navigation-items">
          {navItems.map((item) => (
            <Link
              key={item.category}
              to={item.path}
              className={`navigation-link navigation-link-${item.color} ${
                location.pathname === item.path ? 'navigation-link-active' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
