import React from 'react';
import Button from './Button';

const FAQItem = ({ faq, isExpanded, onToggle, onDelete }) => (
  <div className="faq-item">
    <div className="faq-header">
      <h3 className="faq-question" onClick={onToggle}>
        {faq.question}
      </h3>
      <Button
        variant="danger"
        onClick={onDelete}
        className="delete-button"
        title="Delete FAQ"
      >
        ×
      </Button>
    </div>
    
    {isExpanded && (
      <div className="faq-answer">
        <div 
          dangerouslySetInnerHTML={{ __html: faq.answer }}
          className="faq-content"
        />
      </div>
    )}
  </div>
);

export default FAQItem;