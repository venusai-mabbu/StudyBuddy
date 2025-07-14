// src/context/AuthProvider.js
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    is_logged_in: false,
    token: '',
    userID: '',
    sections: []
  });

  // Load from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  // Save to localStorage on auth change
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Modified login to accept sections
  const login = (token, userID, sections= []) => {
    setAuth({
      is_logged_in: true,
      token,
      userID,
      sections
    });
  };

  const logout = () => {
    setAuth({
      is_logged_in: false,
      token: '',
      userID: '',
      sections: []
    });
    localStorage.removeItem('auth');
  };

 const updateSections = (newSection) => {
  setAuth((prev) => {
    // Check if the new section already exists
    if (!prev.sections.includes(newSection)) {
      return {
        ...prev,
        sections: [...prev.sections, newSection],
      };
    }
  });
};


  return (
    <AuthContext.Provider value={{ auth, login, logout,updateSections }}>
      {children}
    </AuthContext.Provider>
  );
};
