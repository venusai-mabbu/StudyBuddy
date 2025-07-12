import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClass = 'button';
  const variantClass = `button-${variant}`;
  const disabledClass = disabled ? 'button-disabled' : '';
  
  return (
    <button 
      type={type}
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

