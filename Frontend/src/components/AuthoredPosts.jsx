import React from "react";

const AuthoredPosts = ({ posts }) => {
  if (!posts || Object.keys(posts).length === 0) {
    return (
      <div className="posts-section">
        <h3>Authored Posts</h3>
        <p>No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="posts-section">
      <h3>Authored Posts</h3>

      {Object.entries(posts).map(([category, ids]) => (
        <div key={category} className="category-block">
          <h4 className="category-title">{category}</h4>
          <ul className="post-ids">
            {ids.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AuthoredPosts;
