import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/useAuth';

const Profile = () => {
  const [user, setUser] = useState(null);

  const [savedExpanded, setSavedExpanded] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  
const [userPostsBySection, setUserPostsBySection] = useState({});
const [userPostsExpanded, setUserPostsExpanded] = useState(false);
const [expandedSection, setExpandedSection] = useState(null);
const [expandedPostId, setExpandedPostId] = useState(null);

  
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
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
  const fetchSavedPosts = async () => {
    if (!user || !user.saves || user.saves.length === 0) return;

    try {
      const res = await Promise.all(
        user.saves.map(id =>
          axios.get(`http://localhost:3000/posts/saved/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          })
        )
      );
      console.log("saves:",user.saves);
      console.log("user posts:",user);
      const posts = res.map(r => r.data);
      setSavedPosts(posts);
    } catch (err) {
      console.error('Error fetching saved posts:', err.message);
    }
  };

  fetchSavedPosts();
}, [user, token]);

useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/posts/authorPosts', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      console.log("Fetched posts by section:", res.data);
      setUserPostsBySection(res.data);
    } catch (err) {
      console.error('Error fetching user posts:', err.message);
    }
  };

  fetchUserPosts();
}, [token]);


  const handleToggleVisibility = async () => {
    try {
      const res = await axios.patch(
        'http://localhost:3000/auth/toggle-public',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
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
        { oldPassword, newPassword },
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

  const handleUpvote = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:3000/posts/upvote/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSavedPosts(prev => prev.map(p => p._id === postId ? { ...p, upvotes: res.data.upvotes } : p));
    } catch (err) {
      console.error('Upvote failed:', err.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:3000/posts/downvote/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSavedPosts(prev => prev.map(p => p._id === postId ? { ...p, downvotes: res.data.downvotes } : p));
    } catch (err) {
      console.error('Downvote failed:', err.message);
    }
  };

  const handleUnsave = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/posts/unsave/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSavedPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Unsave failed:', err.message);
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
            <span className="label">Sections:</span>
            <div className="section-tags">
              {user.sections.map((section, index) => (
                <span key={index} className="section-tag">{section}</span>
              ))}
            </div>
          </div>

       {/* Accordion for Saved Posts Section */}
<div className="saved-info-row">
  <div
    className="accordion-header"
    onClick={() => setSavedExpanded(prev => !prev)}
    style={{ cursor: 'pointer', background: '#f0f0f0', padding: '10px', borderRadius: '6px' }}
  >
    <span className="label">📁 Saved Posts:</span>
    <span>{savedExpanded ? '▲' : '▼'}</span>
  </div>

  {savedExpanded && (
    <div className="accordion-container">
      {savedPosts.length > 0 ? (
        savedPosts.map(post => (
          <div key={post._id} className="accordion-item" style={{ border: '1px solid #ccc', borderRadius: '6px', marginTop: '10px' }}>
            <div
              className="accordion-header"
              onClick={() => setExpandedPostId(prev => (prev === post._id ? null : post._id))}
              style={{ background: '#e8e8e8', padding: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
            >
              <strong>{post.question}</strong>
              <span>{expandedPostId === post._id ? '▲' : '▼'}</span>
            </div>

            {expandedPostId === post._id && (
              <div className="accordion-body" style={{ padding: '10px', background: '#fff' }}>
                <pre>{post.answer}</pre>
                <div className="toolbar" style={{ marginTop: '8px' }}>
                  <button onClick={() => handleUpvote(post._id)}>🔼 {post.upvotes}</button>
                  <button onClick={() => handleDownvote(post._id)}>🔽 {post.downvotes}</button>
                  <button onClick={() => handleUnsave(post._id)}>❌ Unsave</button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="no-saves">No saves available</p>
      )}
    </div>
  )}
</div>

<div className="userposts-outer">
  <div
    className="accordion-header"
    onClick={() => setUserPostsExpanded(prev => !prev)}
    style={{ cursor: 'pointer', background: '#e0e0e0', padding: '12px 16px', borderRadius: '8px', marginBottom: '10px' }}
  >
    <span className="label">📝 Your Authored Posts</span>
    <span>{userPostsExpanded ? '▲' : '▼'}</span>
  </div>

  {userPostsExpanded && (
    <div className="userposts-wrapper" style={{ paddingLeft: '20px' }}>
      {Object.keys(userPostsBySection).length > 0 ? (
        Object.entries(userPostsBySection).map(([section, posts]) => (
          <div key={section} className="accordion-section" style={{ marginBottom: '16px', paddingLeft: '10px' }}>
            <div
              className="accordion-header"
              onClick={() => setExpandedSection(prev => (prev === section ? null : section))}
              style={{
                cursor: 'pointer',
                background: '#f7f7f7',
                padding: '10px 12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>📂 {section}</span>
              <span>{expandedSection === section ? '▲' : '▼'}</span>
            </div>

            {expandedSection === section && (
              <div className="accordion-container" style={{ paddingLeft: '20px' }}>
                {posts.map(post => (
                  <div
                    key={post._id}
                    className="accordion-item"
                    style={{
                      border: '1px solid #ccc',
                      marginTop: '10px',
                      borderRadius: '6px',
                      background: '#fff'
                    }}
                  >
                    <div
                      className="accordion-header"
                      onClick={() => setExpandedPostId(prev => (prev === post._id ? null : post._id))}
                      style={{
                        background: '#f0f0f0',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <strong>{post.question}</strong>
                      <span>{expandedPostId === post._id ? '▲' : '▼'}</span>
                    </div>

                    {expandedPostId === post._id && (
                      <div className="accordion-body" style={{ padding: '10px', background: '#fafafa' }}>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{post.answer}</pre>
                        <div className="toolbar" style={{ marginTop: '8px' }}>
                          <button onClick={() => handleUpvote(post._id)}>🔼 {post.upvotes}</button>
                          <button onClick={() => handleDownvote(post._id)}>🔽 {post.downvotes}</button>
                          {/* Optionally add edit/delete buttons here */}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ marginLeft: '10px' }}>No authored posts found.</p>
      )}
    </div>
  )}
</div>


          {/* Username update */}
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

          {/* Password update */}
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
