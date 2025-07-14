import React from 'react';
import './FAQCard.css';

const FAQCard = ({ title, count, icon, onClick }) => {
  return (
    <div onClick={onClick} className="faq-card" role="button">
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
