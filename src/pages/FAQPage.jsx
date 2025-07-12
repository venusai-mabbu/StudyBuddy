import React, { useState } from "react";
import { useFAQs } from "../hooks/useFAQs";
import LoadingSpinner from "../components/LoadingSpinner";
import Message from "../components/Message";
import FAQItem from "../components/FAQItem";

const FAQPage = ({ section, title }) => {
  const { faqs, loading, error, deleteFAQ } = useFAQs(section);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  if (loading) {
    return <LoadingSpinner message="Loading FAQs..." />;
  }

  if (error) {
    return <Message message={error} type="error" />;
  }

  return (
    <div className="faq-component">
      <h2 className="faq-title">{title}</h2>
      
      {faqs.length === 0 ? (
        <Message 
          message="No FAQs available for this section yet. Add some using the POST section!"
          type="info"
        />
      ) : (
        <div className="faq-list">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
              onDelete={() => deleteFAQ(faq.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQPage;

