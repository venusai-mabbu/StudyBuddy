import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/useAuth';

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      {/* <div className="header-pattern"></div> */}

      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">FAQ Hub</h1>
          <p className="header-subtitle">Your comprehensive FAQ resource</p>
        </div>

        <div className="header-right">
          {auth.is_logged_in ? (
            <>
              <Link to="/profile" className="btn btn-profile">Profile</Link>
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
