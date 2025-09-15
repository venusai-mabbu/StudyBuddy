import React from 'react';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profileId } = useParams();

  return (
    <div className="profile-detail">
      <h2>Profile ID: {profileId}</h2>
      <p>This is the detailed view of profile #{profileId}.</p>
    </div>
  );
};

export default ProfilePage;
