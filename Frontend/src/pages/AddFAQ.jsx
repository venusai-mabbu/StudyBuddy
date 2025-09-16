import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { useAuth } from '../context/useAuth';
import './AddFAQ.css';

const AddFAQ = () => {
  const { auth, updateSections } = useAuth();
  const { token, sections } = auth;

  const [formData, setFormData] = useState({
    section: '',
    question: '',
    answer: ''
  });

  const [isListening, setIsListening] = useState({
    question: false,
    answer: false
  });

  const [interim, setInterim] = useState({
    question: '',
    answer: ''
  });

  const [showInterim, setShowInterim] = useState({
    question: false,
    answer: false
  });

  const recognitionRefs = {
    question: useRef(null),
    answer: useRef(null)
  };

  const timeoutRefs = {
    question: useRef(null),
    answer: useRef(null)
  };

  const sectionOptions = sections.map(sec => ({
    value: sec,
    label: sec
  }));

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSectionChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      section: selectedOption?.value || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { section, question, answer } = formData;
    if (!section || !question || !answer) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/posts/',
        { section, question, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      console.log('FAQ added:', res.data);
      updateSections(section);
      setFormData({ section: '', question: '', answer: '' });
    } catch (err) {
      console.error('Failed to submit FAQ:', err.response?.data || err.message);
    }
  };

  // Setup SpeechRecognition for each field
  const setupRecognition = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let liveInterim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setFormData(prev => ({
            ...prev,
            [field]: prev[field] + transcript + ' '
          }));
          setInterim(prev => ({ ...prev, [field]: '' }));
          setShowInterim(prev => ({ ...prev, [field]: false }));
          return;
        } else {
          liveInterim += transcript;
        }
      }

      if (liveInterim) {
        setInterim(prev => ({ ...prev, [field]: liveInterim }));
        setShowInterim(prev => ({ ...prev, [field]: true }));

        clearTimeout(timeoutRefs[field].current);
        timeoutRefs[field].current = setTimeout(() => {
          setShowInterim(prev => ({ ...prev, [field]: false }));
        }, 2000);
      }
    };

    recognition.onerror = (e) => {
      console.error(`Speech recognition error (${field}):`, e.error);
    };

    recognitionRefs[field].current = recognition;
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support the Web Speech API.');
      return;
    }

    setupRecognition('question');
    setupRecognition('answer');
  }, []);

  const toggleMic = (field) => {
    const recognition = recognitionRefs[field].current;
    if (!recognition) return;

    if (!isListening[field]) {
      recognition.start();
    } else {
      recognition.stop();
    }

    setIsListening(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <main className="faq-container">
      <h1 className="faq-title">Add a New FAQ</h1>

  <form onSubmit={handleSubmit} className="faq-form">
  <label>
    Section *
    <CreatableSelect
      options={sectionOptions}
      onChange={handleSectionChange}
      value={
        formData.section
          ? { value: formData.section, label: formData.section }
          : null
      }
      placeholder="Select or type a new section"
      isClearable
      className="select-input"
    />
  </label>

  <label>
    Question *
    <div className="field-with-mic-wrapper">
      <textarea className='question'
        name="question"
        rows={3}
        value={formData.question}
        onChange={handleChange('question')}
        placeholder="Type or speak your question..."
        required
      />
      <button
        type="button"
        className={`mic-btn ${isListening.question ? 'mic-off' : 'mic-on'}`}
        onClick={() => toggleMic('question')}
        title="Mic for Question"
      >
        🎤
      </button>
    </div>
  </label>

  <label>
    Answer *
    <div className="field-with-mic-wrapper">
      <textarea className='answer'
        name="answer"
        rows={5}
        value={formData.answer}
        onChange={handleChange('answer')}
        placeholder="Type or speak your answer..."
        required
      />
      <button
        type="button"
        className={`mic-btn ${isListening.answer ? 'mic-off' : 'mic-on'}`}
        onClick={() => toggleMic('answer')}
        title="Mic for Answer"
      >
        🎤
      </button>
    </div>
  </label>

  <button type="submit" className="submit-btn">Submit FAQ</button>
</form>

{/* Floating interim bubbles */}
{showInterim.question && (
  <div className="interim-bubble left">{interim.question}</div>
)}
{showInterim.answer && (
  <div className="interim-bubble right">{interim.answer}</div>
)}


{/* Floating interim bubbles */}
{showInterim.question && (
  <div className="interim-bubble left">{interim.question}</div>
)}
{showInterim.answer && (
  <div className="interim-bubble right">{interim.answer}</div>
)}


      {/* Interim bubbles */}
      {showInterim.question && (
        <div className="interim-bubble left">{interim.question}</div>
      )}
      {showInterim.answer && (
        <div className="interim-bubble right">{interim.answer}</div>
      )}

      <footer className="faq-footer">
        © 2025 FAQ Hub. All rights reserved.
      </footer>
    </main>
  );
};

export default AddFAQ;
