import React, { useState } from "react";
import { SECTIONS } from "../constants/sections";
import { faqService } from "../services/faqService";
import FormField from "../components/FormField";
import Button from "../components/Button";
import Message from "../components/Message";

const PostFAQ = () => {
  const [formData, setFormData] = useState({
    section: "",
    question: "",
    answer: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const sectionOptions = Object.entries(SECTIONS).map(([key, section]) => ({
    value: key,
    label: section.label
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.section || !formData.question || !formData.answer) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    setLoading(true);
    
    try {
      await faqService.createFAQ(formData);
      setMessage("FAQ added successfully!");
      setMessageType("success");
      setFormData({ section: "", question: "", answer: "" });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="post-faq">
      <div className="post-faq-container">
        <h2>Add New FAQ</h2>

        {message && (
          <Message 
            message={message} 
            type={messageType} 
            onClose={() => setMessage("")}
          />
        )}

        <form onSubmit={handleSubmit} className="post-faq-form">
          <FormField
            label="Section"
            type="select"
            value={formData.section}
            onChange={(e) => handleInputChange('section', e.target.value)}
            required
            options={sectionOptions}
          />

          <FormField
            label="Question"
            type="textarea"
            value={formData.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            required
            placeholder="Enter the question..."
            rows={3}
          />

          <FormField
            label="Answer"
            type="textarea"
            value={formData.answer}
            onChange={(e) => handleInputChange('answer', e.target.value)}
            required
            placeholder="Enter the answer..."
            rows={8}
          />

          <Button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Submitting..." : "Submit FAQ"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostFAQ;
