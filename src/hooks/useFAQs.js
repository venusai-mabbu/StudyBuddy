import { useState, useEffect } from 'react';
import { faqService } from '../services/faqService';

export const useFAQs = (section = null) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await faqService.getFAQs(section);
      setFaqs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await faqService.deleteFAQ(section, id);
      setFaqs(faqs.filter(faq => faq.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [section]);

  return { faqs, loading, error, deleteFAQ, refetch: fetchFAQs };
};
