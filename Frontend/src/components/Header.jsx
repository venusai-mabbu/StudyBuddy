import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/useAuth'; // ✅ import your custom auth hook

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  console.log(auth);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      {/* Decorative Background Pattern */}
      <div className="header-pattern"></div>

      <div className="header-content">
        <div className="header-row">
          <div>
            <h1 className="header-title">FAQ Hub</h1>
            <p className="header-subtitle">Your comprehensive FAQ resource</p>
          </div>

          <div className="header-actions">
            {auth.is_logged_in ? (
              <>
                {  console.log(auth)}
                <Link to="/profile" className="btn-profile">Profile</Link>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn-profile">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
