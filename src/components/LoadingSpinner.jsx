import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;