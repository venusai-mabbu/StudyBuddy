import React from 'react';
import './FAQCard.css';

const FAQCard = ({ title, count = 0, icon, onClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') onClick();
  };

  return (
    <div
      className="faq-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
      aria-label={`FAQ section ${title}`}
    >
      <div className="faq-card-content">
        <div className="faq-card-icon">{icon}</div>
        <div className="faq-card-text">
          <h3 className="faq-card-title">{title}</h3>
          <p className="faq-card-count">
            {count} FAQ{count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;
