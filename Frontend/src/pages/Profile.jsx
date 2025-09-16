import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useAuth } from "../context/useAuth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saved posts accordion
  const [savedExpanded, setSavedExpanded] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);

  // Authored posts by section accordion
  const [userPostsBySection, setUserPostsBySection] = useState({});
  const [userPostsExpanded, setUserPostsExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Username/password forms
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });

  // Profile edit
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: "",
    location: "",
    website: "",
    avatar: "",
    social: {
      linkedin: "",
      quora: "",
      instagram: "",
      medium: "",
      github: "",
      twitter: ""
    }
  });

  const { auth } = useAuth();
  const token = auth?.token;
  console.log(token);

  // Helper: set auth headers
  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // ---------- Fetch profile ----------
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/auth/profile", authHeaders());
        setUser(res.data);

        // populate profile form initial values
        setProfileForm((prev) => ({
          ...prev,
          bio: res.data.bio || "",
          location: res.data.location || "",
          website: res.data.website || "",
          avatar: res.data.avatar || "",
          social: {
            linkedin: res.data.social?.linkedin || "",
            quora: res.data.social?.quora || "",
            instagram: res.data.social?.instagram || "",
            medium: res.data.social?.medium || "",
            github: res.data.social?.github || "",
            twitter: res.data.social?.twitter || ""
          }
        }));
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  // ---------- Fetch saved posts ----------
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user?.saves || user.saves.length === 0) {
        setSavedPosts([]);
        return;
      }
      try {
        const res = await Promise.all(
          user.saves.map((id) =>
            axios.get(`http://localhost:3000/posts/saved/${id}`, authHeaders()).then(r => r.data)
          )
        );
        setSavedPosts(res);
      } catch (err) {
        console.error("Error fetching saved posts:", err.response?.data || err.message);
      }
    };

    fetchSavedPosts();
  }, [user, token]);

  // ---------- Fetch user's authored posts grouped by section ----------
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/posts/authorPosts", authHeaders());
        // expected shape: { "algorithms": [{...}, ...], "system-design": [...] }
        setUserPostsBySection(res.data || {});
      } catch (err) {
        console.error("Error fetching user posts:", err.response?.data || err.message);
      }
    };

    if (token) fetchUserPosts();
  }, [token]);

  // ---------- Helper: update a post's counts in local state ----------
  const updatePostInState = (postId, patch) => {
    // update savedPosts
    setSavedPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, ...patch } : p))
    );

    // update userPostsBySection
    setUserPostsBySection(prev => {
      const next = {};
      Object.entries(prev).forEach(([section, posts]) => {
        next[section] = posts.map(p => (p._id === postId ? { ...p, ...patch } : p));
      });
      return next;
    });
  };

  // ---------- Toggle profile visibility ----------
  const handleToggleVisibility = async () => {
    try {
      const res = await axios.patch("http://localhost:3000/auth/toggle-public",{}, authHeaders());
      setUser(prev => ({ ...prev, is_public: res.data.is_public }));
    } catch (err) {
      console.error("Failed to toggle visibility:", err.response?.data || err.message);
    }
  };

  // ---------- Update username ----------
  const handleUpdateUsername = async () => {
    if (!newUsername) return;
    try {
      const res = await axios.put(
        "http://localhost:3000/auth/update-username",
        { username: newUsername },
        authHeaders()
      );
      setUser(prev => ({ ...prev, username: res.data.username }));
      setNewUsername("");
      setShowUsernameForm(false);
    } catch (err) {
      console.error("Failed to update username:", err.response?.data || err.message);
    }
  };

  // ---------- Update password ----------
  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) return;

    try {
      await axios.put(
        "http://localhost:3000/auth/update-password",
        { oldPassword, newPassword },
        authHeaders()
      );
      setPasswordData({ oldPassword: "", newPassword: "" });
      setShowPasswordForm(false);
      // optionally show a success message
    } catch (err) {
      console.error("Failed to update password:", err.response?.data || err.message);
    }
  };

  // ---------- Update profile (bio, location, website, avatar, social) ----------
  const handleProfileSave = async () => {
    try {
      const payload = {
        bio: profileForm.bio,
        location: profileForm.location,
        website: profileForm.website,
        avatar: profileForm.avatar,
        social: profileForm.social
      };
      const res = await axios.put("http://localhost:3000/auth/update-profile", payload, authHeaders());
      // update UI with returned user object (or partial)
      setUser(prev => ({ ...prev, ...res.data }));
      setShowEditProfile(false);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err.message);
    }
  };

  // ---------- Upvote ----------
  const handleUpvote = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:3000/posts/upvote/${postId}`, {}, authHeaders());
      // backend should respond with updated counts or post object
      // we assume res.data contains updated upvotes and downvotes (or entire post)
      const patch = {};
      if (typeof res.data.upvotes !== "undefined") patch.upvotes = res.data.upvotes;
      if (typeof res.data.downvotes !== "undefined") patch.downvotes = res.data.downvotes;
      updatePostInState(postId, patch);
    } catch (err) {
      console.error("Upvote failed:", err.response?.data || err.message);
    }
  };

  // ---------- Downvote ----------
  const handleDownvote = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:3000/posts/downvote/${postId}`, {}, authHeaders());
      const patch = {};
      if (typeof res.data.upvotes !== "undefined") patch.upvotes = res.data.upvotes;
      if (typeof res.data.downvotes !== "undefined") patch.downvotes = res.data.downvotes;
      updatePostInState(postId, patch);
    } catch (err) {
      console.error("Downvote failed:", err.response?.data || err.message);
    }
  };

  // ---------- Unsave ----------
  const handleUnsave = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/posts/unsave/${postId}`, {}, authHeaders());
      // remove from savedPosts and also from user's saves array locally
      setSavedPosts(prev => prev.filter(p => p._id !== postId));
      setUser(prev => ({ ...prev, saves: (prev.saves || []).filter(id => id !== postId) }));
    } catch (err) {
      console.error("Unsave failed:", err.response?.data || err.message);
    }
  };

  // ---------- UI loading / guards ----------
  if (loading) return <div className="profile-container"><p>Loading...</p></div>;
  if (!user) return <div className="profile-container"><p>Profile not found.</p></div>;

  // fallback avatar
  // const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
<div className="profile-card">
      <div className="profile-card-inner1">
        <div className="profile-top-row">
          {profileForm.avatar && (
                  <div className="profile-avatar">
                       <img src={profileForm.avatar} alt="Avatar Preview" className="avatar-img" />
                </div>)}

          <div style={{ flex: 1, margin: "0px" }}>
            <h2>Welcome, {user.username}</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className={`profile-private-btn ${user.is_public ? "public" : "private"}`} onClick={handleToggleVisibility}>
                {user.is_public ? "Public Profile" : "Private Profile"}
              </button>
              <button className="update-button" onClick={() => setShowEditProfile(prev => !prev)}>
                {showEditProfile ? "Close" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Profile edit form */}
        {showEditProfile && (
          <div className="edit-profile-form" style={{ marginTop: 12 }}>
           <div className="info-row">
                  <label className="label">Avatar:</label>
                  
                  {/* Custom styled button that triggers the hidden file input */}
                  <label htmlFor="avatar-button" className="custom-upload-btn">
                    Upload Avatar
                  </label>

                  <input
                    id="avatar-button"
                    name="avatar-button"
                    className="avatar-button"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
                        };
                        reader.readAsDataURL(file); // Converts to base64 for preview
                      }
                    }}
                  />
                </div>


            <div className="info-row">
              <label className="label">Bio:</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="info-row">
              <label className="label">Location:</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="info-row">
              <label className="label">Website:</label>
              <input
                type="text"
                value={profileForm.website}
                onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <strong>Social Links</strong>
              <div className="info-row">
                <label className="label">LinkedIn:</label>
                <input
                  type="text"
                  value={profileForm.social.linkedin}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, linkedin: e.target.value } }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="info-row">
                <label className="label">GitHub:</label>
                <input
                  type="text"
                  value={profileForm.social.github}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, github: e.target.value } }))}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="info-row">
                <label className="label">Medium:</label>
                <input
                  type="text"
                  value={profileForm.social.medium}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, medium: e.target.value } }))}
                />
              </div>
              <div className="info-row">
                <label className="label">Instagram:</label>
                <input
                  type="text"
                  value={profileForm.social.instagram}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))}
                />
              </div>
              <div className="info-row">
                <label className="label">Twitter:</label>
                <input
                  type="text"
                  value={profileForm.social.twitter}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))}
                />
              </div>
              <div className="info-row">
                <label className="label">Quora:</label>
                <input
                  type="text"
                  value={profileForm.social.quora}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, social: { ...prev.social, quora: e.target.value } }))}
                />
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <button className="submit-button" onClick={handleProfileSave}>Save Profile</button>
            </div>
            
          </div>
        )}
      </div>

        {/* Basic Info display */}
        <div className="profile-info" style={{ marginTop: 0 }}>
          <div className="info-row"><span className="label">Email:</span><span>{user.email}</span></div>

          {user.bio && <div className="info-row"><span className="label">Bio:</span><span>{user.bio}</span></div>}
          {user.location && <div className="info-row"><span className="label">Location:</span><span>{user.location}</span></div>}
          {user.website && <div className="info-row"><span className="label">Website:</span><a href={user.website} target="_blank" rel="noreferrer">{user.website}</a></div>}

          <div className="info-row">
            <span className="label">{user.social ? "Social:" : "No Social Links"}</span>
            <div className="social-links">
              {Object.entries(user.social || {}).map(([k, v]) => v ? (
                <a key={k} className="social-link" href={v} target="_blank">{k}</a>
              ) : null)}
            </div>
          </div>

          <div className="info-row"><span className="label">Total Sections:</span><span className="bold">{user.sectionsCount}</span></div>

          <div className="info-row">
            <span className="label">Sections:</span>
            <div className="section-tags">
              {(user.sections || []).map((s, i) => <span className="section-tag" key={i}>{s}</span>)}
            </div>
          </div>

          {/* Username update UI */}
          <div className="info-row" style={{ marginTop: 12 }}>
            {showUsernameForm && (
              <div className="input-group username-input">
                <input type="text" placeholder="Enter new username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <button className="submit-button" onClick={handleUpdateUsername}>Submit</button>
              </div>
            )}
            <button className="update-button" onClick={() => setShowUsernameForm(prev => !prev)}>{showUsernameForm ? "Cancel" : "Update Username"}</button>
          </div>

          {/* Password update UI */}
          <div className="info-row" style={{ marginTop: 12 }}>
            {showPasswordForm && (
              <div className="input-group password-input">
                <input type="password" placeholder="Old password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                <input type="password" placeholder="New password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <button className="submit-button" onClick={handleUpdatePassword}>Submit</button>
              </div>
            )}
            <button className="update-button" onClick={() => setShowPasswordForm(prev => !prev)}>{showPasswordForm ? "Cancel" : "Update Password"}</button>
          </div>
        </div>

        {/* Saved Posts Accordion */}
        <div className="saved-info-row" style={{ marginTop: 18 }}>
          <div className="accordion-header" onClick={() => setSavedExpanded(prev => !prev)} style={{ cursor: "pointer" }}>
            <span className="label">📁 Saved Posts:</span>
            <span>{savedExpanded ? "▲" : "▼"}</span>
          </div>

          {savedExpanded && (
            <div className="accordion-container">
              {savedPosts.length > 0 ? savedPosts.map(post => (
                <div key={post._id} className="accordion-item">
                  <div className="accordion-header" onClick={() => setExpandedPostId(prev => prev === post._id ? null : post._id)} style={{ cursor: "pointer" }}>
                    <strong>{post.question}</strong>
                    <span>{expandedPostId === post._id ? "▲" : "▼"}</span>
                  </div>

                  {expandedPostId === post._id && (
                    <div className="accordion-body">
                      <pre style={{ whiteSpace: "pre-wrap" }}>{post.answer}</pre>
                      <div className="toolbar">
                        <button onClick={() => handleUpvote(post._id)}>🔼 {post.upvotes ?? 0}</button>
                        <button onClick={() => handleDownvote(post._id)}>🔽 {post.downvotes ?? 0}</button>
                        <button onClick={() => handleUnsave(post._id)}>❌ Unsave</button>
                      </div>
                    </div>
                  )}
                </div>
              )) : <p className="no-saves">No saves available</p>}
            </div>
          )}
        </div>

        {/* Authored posts accordion */}
        <div className="userposts-outer" style={{ marginTop: 18 }}>
          <div className="accordion-header" onClick={() => setUserPostsExpanded(prev => !prev)} style={{ cursor: "pointer" }}>
            <span className="label">📝 Your Authored Posts</span>
            <span>{userPostsExpanded ? "▲" : "▼"}</span>
          </div>

          {userPostsExpanded && (
            <div className="userposts-wrapper">
              {Object.keys(userPostsBySection).length > 0 ? (
                Object.entries(userPostsBySection).map(([section, posts]) => (
                  <div key={section} className="accordion-section">
                    <div className="accordion-header" onClick={() => setExpandedSection(prev => prev === section ? null : section)} style={{ cursor: "pointer" }}>
                      <span>📂 {section}</span>
                      <span>{expandedSection === section ? "▲" : "▼"}</span>
                    </div>

                    {expandedSection === section && (
                      <div className="accordion-container">
                        {posts.map(post => (
                          <div key={post._id} className="accordion-item">
                            <div className="accordion-header" onClick={() => setExpandedPostId(prev => prev === post._id ? null : post._id)} style={{ cursor: "pointer" }}>
                              <strong>{post.question}</strong>
                              <span>{expandedPostId === post._id ? "▲" : "▼"}</span>
                            </div>

                            {expandedPostId === post._id && (
                              <div className="accordion-body">
                                <pre style={{ whiteSpace: "pre-wrap" }}>{post.answer}</pre>
                                <div className="toolbar">
                                  <button onClick={() => handleUpvote(post._id)}>🔼 {post.upvotes ?? 0}</button>
                                  <button onClick={() => handleDownvote(post._id)}>🔽 {post.downvotes ?? 0}</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : <p>No authored posts found.</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
