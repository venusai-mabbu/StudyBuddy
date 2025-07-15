import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <main className="notfound-container">
    <h1 className="notfound-title">404</h1>
    <p className="notfound-subtitle">Oops! Page Not Found</p>
    <p className="notfound-text">
      The page you’re looking for doesn’t exist or has been moved.
    </p>
    <Link to="/" className="notfound-link">Go back to Home</Link>
  </main>
);

export default NotFound;
