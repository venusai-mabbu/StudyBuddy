import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import './FAQList.css';

const SectionPosts = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Only one expanded item
  const [error, setError] = useState('');

  const { auth } = useAuth();
  const { token } = auth;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const section = location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:3000/posts/section/${section}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, [location.pathname]);

  const toggleExpanded = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id)); // Toggle logic
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Posts in Section: {location.pathname.split('/').pop()}</h1>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="faq-list">
        {posts.map((post, index) => (
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
              <div className="faq-controls">
                <button className="remove-button">X</button>
                <div className="toggle-icon">
                  {expandedId === post._id ? '▲' : '▼'}
                </div>
              </div>
            </div>

            <div className={`faq-answer ${expandedId === post._id ? 'show' : 'hide'}`}>
              <p>{post.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionPosts;
