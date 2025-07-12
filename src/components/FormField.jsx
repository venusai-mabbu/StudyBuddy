import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  options = [],
  rows = 3,
  className = ''
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={onChange}
            required={required}
            className={`form-select ${className}`}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            placeholder={placeholder}
            className={`form-textarea ${className}`}
          />
        );
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`form-input ${className}`}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      {renderInput()}
    </div>
  );
};

export default FormField;
