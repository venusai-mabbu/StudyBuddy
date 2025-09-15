import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header"
import './Public.css';

const profiles = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  bio: `This is a short bio of User ${i + 1}.`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const ProfilesPerPage = 20;

const Public = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProfileId, setHoveredProfileId] = useState(null);

  const indexOfLastProfile = currentPage * ProfilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - ProfilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / ProfilesPerPage);

  return (
    <>
    <Header publicButton={false}/>
    <div className="container">
      <h1>Public Profiles</h1>
      <ul className="list">
        {currentProfiles.map((profile) => (
          <li
            key={profile.id}
            className="list-item"
            onMouseEnter={() => setHoveredProfileId(profile.id)}
            onMouseLeave={() => setHoveredProfileId(null)}
          >
            <Link to={`/public/${profile.id}`} className="profile-link">
              <img src={profile.avatar} alt={profile.name} />
              <span className="profile-name">{profile.name}</span>
            </Link>

            {hoveredProfileId === profile.id && (
              <div className="hover-popup">
                <p><strong>{profile.name}</strong></p>
                <p>{profile.bio}</p>
                <p>{profile.email}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  </>
  );
};

export default Public;
