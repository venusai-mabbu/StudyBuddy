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

    if (token && section) fetchPosts();
  }, [section, token]);

  const toggleExpanded = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

const handleUpvote = async (postId) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/posts/upvote/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    // Assuming server returns updated post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, upvotes: data.upvotes } : post
      )
    );
  } catch (error) {
    console.error('Failed to upvote:', error.response?.data || error.message);
  }
};

const handleDownvote = async (postId) => {
  try {
    const { data } = await axios.post(`http://localhost:3000/posts/downvote/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    // Assuming server returns updated post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, downvotes: data.downvotes } : post
      )
    );
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
      alert("saved post!!");
      console.log('Saved post:', res.data);
    } catch (error) {
      console.error('Failed to save post:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error.response?.data || error.message);
    }
  };

  return (
    <main className="faq-container">
      <h1 className="faq-header">Posts in Section: {section}</h1>

      <section className="faq-list">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <article
              key={post._id}
              className={`faq-item ${expandedId === post._id ? 'expanded' : ''}`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <header className="faq-question" onClick={() => toggleExpanded(post._id)}>
                <h3>{post.question}</h3>
              </header>

              {expandedId === post._id && (
                <div className="faq-answer">
                  <pre className='faq-answer-pre'
                    onClick={() => {
                      const selection = window.getSelection();
                      if (!selection || selection.toString().length === 0) {
                        toggleExpanded(post._id);
                      }
                    }}
                  >
                    {post.answer}
                  </pre>

                  <div className="toolbar">
                    <button title="Upvote" onClick={() => handleUpvote(post._id)}>🔼{post.upvotes}</button>
                    <button title="Downvote" onClick={() => handleDownvote(post._id)}>🔽{post.downvotes}</button>
                    <button title="Save" onClick={() => handleSave(post._id)}>💾</button>
                    <button title="Delete" className="delete-btn" onClick={() => handleDelete(post._id)}>🗑️</button>
                  </div>
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="no-posts">No posts found in this section.</p>
        )}
      </section>
    </main>
  );
};

export default SectionPosts;
