import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// Helper to parse cookies into an object
const parseCookies = () => {
  return document.cookie
    .split('; ')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = value;
      return acc;
    }, {});
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    is_logged_in: false,
    token: '',
    userID: '',
    sections: []
  });

  // Load auth from cookie on initial mount only
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.auth) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookies.auth));
        if (parsed.is_logged_in === true) {
          setAuth(parsed);
        }
      } catch (err) {
        console.error('Invalid auth cookie:', err);
      }
    }
  }, []); // Only run on initial load

  // Store auth state in cookie on change
  useEffect(() => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie =
      "auth=" +
      encodeURIComponent(JSON.stringify(auth)) +
      "; path=/; expires=" +
      expires +
      "; SameSite=Strict";
  }, [auth]);

  const login = (token, userID, sections = []) => {
    setAuth({
      is_logged_in: true,
      token,
      userID,
      sections
    });
    console.log("login track",auth);
  };

  const logout = () => {
    // Clear the auth state
    setAuth({
      is_logged_in: false,
      token: '',
      userID: '',
      sections: []
    });

    // Remove the auth cookie
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
  };

  const updateSections = (newSection) => {
    setAuth((prev) => {
      if (!prev.sections.includes(newSection)) {
        return {
          ...prev,
          sections: [...prev.sections, newSection],
        };
      }
      return prev;
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateSections }}>
      {children}
    </AuthContext.Provider>
  );
};
