import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import './FAQList.css';

const SectionPosts = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const { token } = auth;

  const [posts, setPosts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const section = useMemo(() => location.pathname.split('/').pop(), [location.pathname]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/posts/section/${section}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    if (token && section) {
      fetchPosts();
    }
  }, [section, token]);

  const toggleExpanded = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // 🔼 Handle Upvote
const handleUpvote = async (postId) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/posts/upvote/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    console.log('Upvoted:', res.data);
  } catch (error) {
    console.error('Failed to upvote:', error.response?.data || error.message);
  }
};

const handleDownvote = async (postId) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/posts/downvote/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    console.log('Downvoted:', res.data);
  } catch (error) {
    console.error('Failed to downvote:', error.response?.data || error.message);
  }
};

const handleSave = async (postId) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/posts/save/${postId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    console.log('Saved post:', res.data);
  } catch (error) {
    console.error('Failed to save post:', error.response?.data || error.message);
  }
};

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Posts in Section: {section}</h1>
      </div>

      <div className="faq-list">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post._id}
              className="faq-item"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <div className="faq-question" onClick={() => toggleExpanded(post._id)}>
                <h3>{post.question}</h3>
                {/* <div className="faq-controls">
                  <div className="toggle-icon">
                  {expandedId === post._id ? '▲' : '▼'}
                  </div>
                  </div> */}
              </div>

              {expandedId === post._id && (
                <div className="faq-answer show">
                  <p>{post.answer}</p>
                  <div className='toolbar'>
                      <div className="upvote-bar">
                          <button title="Upvote" onClick={() => handleUpvote(post._id)}>🔼</button>
                          <button title="Downvote" onClick={() => handleDownvote(post._id)}>🔽</button>
                          <button title="Save" onClick={() => handleSave(post._id)}>💾</button>
                      </div>
                      <p>Delete</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">No posts found in this section.</p>
        )}
      </div>
    </div>
  );
};

export default SectionPosts;
