import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/useAuth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const { auth } = useAuth();
  const { token } = auth;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleToggleVisibility = async () => {
    try {
      const res = await axios.patch(
        'http://localhost:3000/auth/toggle-public',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setUser(prev => ({ ...prev, is_public: res.data.is_public }));
    } catch (err) {
      console.error('Failed to toggle visibility:', err.response?.data || err.message);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername) return;
    try {
      const res = await axios.put(
        'http://localhost:3000/auth/update-username',
        { username: newUsername },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      setUser(prev => ({ ...prev, username: res.data.username }));
      setNewUsername('');
      setShowUsernameForm(false);
    } catch (err) {
      console.error('Failed to update username:', err.response?.data || err.message);
    }
  };

  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) return;

    try {
      await axios.put(
        'http://localhost:3000/auth/update-password',
        {
          oldPassword,
          newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      setPasswordData({ oldPassword: '', newPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Failed to update password:', err.response?.data || err.message);
    }
  };

  if (loading) return <div className="profile-container"><p>Loading...</p></div>;
  if (!user) return <div className="profile-container"><p>Profile not found.</p></div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-top-row">
          <h2>Welcome, {user.username}</h2>
          <button className="profile-private-btn">
            {user.is_public ? 'Public Profile' : 'Private Profile'}
          </button>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="label">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="info-row">
            <span className="label">Profile Visibility:</span>
            <div
              className="profile-status"
              onClick={handleToggleVisibility}
              style={{ cursor: 'pointer' }}
              title="Click to toggle visibility"
            >
              <span>{user.is_public ? '☑' : '☐'}</span>
              <span className={user.is_public ? 'status-on' : 'status-off'}>
                {user.is_public ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

          <div className="info-row">
            <span className="label">Total Sections:</span>
            <span className="bold">{user.sectionsCount}</span>
          </div>

          <div className="info-row">
            <div className="label">Sections:</div>
            <div className="section-tags">
              {user.sections.map((section, index) => (
                <span key={index} className="section-tag">
                  {section}
                </span>
              ))}
            </div>
          </div>

          <div className="info-row">
            <span className="label">Saves:</span>
            {user.saves && user.saves.length > 0 ? (
              // <span>{user.saves.length}</span>

            <span>
                {user.saves.map((element, index) => (
                  <span key={index}>{"index:"+index+" "+element}<br></br></span>
                ))}
            </span>

            ) : (
              <span className="no-saves">No saves available</span>
            )}
          </div>

          {/* Update Username Button */}
          <div className="info-row">
  <button className="update-button" onClick={() => setShowUsernameForm(prev => !prev)}>
    {showUsernameForm ? 'Cancel' : 'Update Username'}
  </button>
  {showUsernameForm && (
    <div className="input-group username-input">
      <input
        type="text"
        placeholder="Enter new username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button className="submit-button" onClick={handleUpdateUsername}>Submit</button>
    </div>
  )}
</div>

{/* Update Password Button */}
<div className="info-row">
  <button className="update-button" onClick={() => setShowPasswordForm(prev => !prev)}>
    {showPasswordForm ? 'Cancel' : 'Update Password'}
  </button>
  {showPasswordForm && (
    <div className="input-group password-input">
      <input
        type="password"
        placeholder="Old password"
        value={passwordData.oldPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, oldPassword: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="New password"
        value={passwordData.newPassword}
        onChange={(e) =>
          setPasswordData({ ...passwordData, newPassword: e.target.value })
        }
      />
      <button className="submit-button" onClick={handleUpdatePassword}>Submit</button>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
