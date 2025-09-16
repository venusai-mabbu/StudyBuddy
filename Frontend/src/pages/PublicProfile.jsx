import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';  
import AuthoredPosts from '../components/AuthoredPosts';
import './PublicProfile.css';

const ProfilePage = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/auth/public/${profileId}`);
        setProfile(res.data);
        console.log(res.data);
        console.log(profileId);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  if (loading) return <div className="profile-detail">Loading...</div>;
  if (!profile) return <div className="profile-detail">Profile not found.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.username}
          className="profile-avatar"
        />
        <div>
          <h2 className="profile-username">{profile.username}</h2>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="profile-meta">
            {profile.location && <span>{profile.location} • </span>}
            Joined {new Date(profile.joinedAt).toLocaleDateString()}
          </p>
          <div className="profile-socials">
            {profile.social?.github && (
              <a href={profile.social.github} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {profile.social?.linkedin && (
              <a href={profile.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
            {profile.social?.twitter && (
              <a href={profile.social.twitter} target="_blank" rel="noreferrer">Twitter</a>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <AuthoredPosts posts={profile.posts || []} />
      {console.log("Profile posts:", profile.posts)}
    </div>
  );
};

export default ProfilePage;
