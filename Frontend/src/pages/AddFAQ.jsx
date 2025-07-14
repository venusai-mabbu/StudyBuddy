import React, { useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { useAuth } from '../context/useAuth';
import './AddFAQ.css';

const AddFAQ = () => {
  const {auth, updateSections } = useAuth();

  const token=auth.token;
  const sections=auth.sections;

  const [formData, setFormData] = useState({
    section: '',
    question: '',
    answer: ''
  });

  const sectionOptions = sections.map(sec => ({
    value: sec,
    label: sec
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { section, question, answer } = formData;

    if (section && question && answer) {
      try {
        const res = await axios.post(
          'http://localhost:3000/posts/',
          {
            section,
            question,
            answer
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true // optional: if you're using cookies for auth
          }
        );

        console.log('FAQ added:', res.data);
        updateSections(section);
        setFormData({ section: '', question: '', answer: '' });
        // navigate(`/${section.toLowerCase()}`);
      } catch (err) {
        console.error('Failed to submit FAQ:', err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header-card">
        <h1>Add New FAQ</h1>
      </div>

      {/* Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          {/* Section Dropdown */}
          <div className="form-group">
            <label htmlFor="section">Section *</label>
            <CreatableSelect
              id="section"
              options={sectionOptions}
              onChange={(selectedOption) =>
                setFormData({ ...formData, section: selectedOption?.value || '' })
              }
              value={
                formData.section
                  ? { value: formData.section, label: formData.section }
                  : null
              }
              placeholder="Select or type a new section"
              isClearable
              required
            />
          </div>

          {/* Question */}
          <div className="form-group">
            <label htmlFor="question">Question *</label>
            <textarea
              id="question"
              rows={4}
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              placeholder="Enter the question..."
              required
            />
          </div>

          {/* Answer */}
          <div className="form-group">
            <label htmlFor="answer">Answer *</label>
            <textarea
              id="answer"
              rows={6}
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              placeholder="Enter the answer..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button type="submit">Submit FAQ</button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2025 FAQ Hub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AddFAQ;
