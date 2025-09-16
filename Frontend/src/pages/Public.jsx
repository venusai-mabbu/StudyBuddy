import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Public.css";

const ProfilesPerPage = 6;

function formatLastLogin(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function ProfileCard({ profile, handleClick }) {
  return (
    <div className="card" onClick={() => handleClick(profile)}>
      <img src={profile.avatar} alt={profile.username} />
      <div className="username">{profile.username}</div>
      <div className="bio">{profile.bio}</div>
      {profile.sections && (
        <div className="sections">
          {profile.sections.map((s, i) => (
            <div key={i} className="section-tag">{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
      {pages.map(p => (
        <button key={p} onClick={() => setCurrentPage(p)} className={p === currentPage ? "active" : ""}>{p}</button>
      ))}
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  const navigate = useNavigate();

  if (!profile) return null;
  return (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <img src={profile.avatar} alt={profile.username} />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="modal-content">
        <div className="stats">
          <div className="stat">Upvotes: {profile.upvotes?.length || 0}</div>
          <div className="stat">Stars: {profile.stars?.length || 0}</div>
          <div className="stat">Downvotes: {profile.downvotes?.length || 0}</div>
        </div>

        <button
          className="modal-visit-btn modal-header"
          onClick={() => navigate(`/public/${profile._id}`)}
        >
          Visit
        </button>

        {profile.sections && (
          <div className="sections">
            {profile.sections.map((s, i) => (
              <div key={i} className="section-tag">{s}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default function PublicProfiles() {

  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await axios.get(`http://localhost:3000/auth/public?page=${currentPage}&limit=${ProfilesPerPage}`);
        setProfiles(res.data.profiles);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfiles();
  }, [currentPage]);

  return (
    <div className="container">
      <div className="heading">
        <h1>Public Profiles</h1>
        <p>Discover amazing developers from around the world.</p>
      </div>

      <div className="grid">
        {profiles.map(p => <ProfileCard key={p._id} profile={p} handleClick={setSelectedProfile} />)}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
    </div>
  );
}
