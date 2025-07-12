import { API_BASE_URL } from '../constants/sections';

export const faqService = {
  async getFAQs(section = null) {
    const url = section ? `${API_BASE_URL}/faqs/${section}` : `${API_BASE_URL}/faqs`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch FAQs');
    return response.json();
  },

  async createFAQ(faqData) {
    const response = await fetch(`${API_BASE_URL}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqData)
    });
    if (!response.ok) throw new Error('Failed to create FAQ');
    return response.json();
  },

  async deleteFAQ(section, id) {
    const response = await fetch(`${API_BASE_URL}/faqs/${section}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete FAQ');
    return response.json();
  }
};
