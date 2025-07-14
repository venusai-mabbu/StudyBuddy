import { useState } from 'react';
import "./FAQ.css"
const initialFAQs = [
  {
    id: '1',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-02')
  },
  {
    id: '3',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-03')
  },
  {
    id: '4',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-04')
  },
  {
    id: '5',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-05')
  },
  {
    id: '6',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-06')
  },
  {
    id: '7',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-07')
  },
  {
    id: '8',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s scope, and the global scope.',
    category: 'JAVASCRIPT',
    createdAt: new Date('2025-01-08')
  }
];

export const useFAQs = () => {
  const [faqs, setFAQs] = useState(initialFAQs);

  const addFAQ = (faq) => {
    const newFAQ = {
      ...faq,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFAQs(prev => [...prev, newFAQ]);
  };

  const getFAQsByCategory = (category) => {
    if (category === 'HOME') return faqs;
    return faqs.filter(faq => faq.category === category);
  };

  const getFAQCounts = () => {
    const counts = {};
    faqs.forEach(faq => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  };

  return {
    faqs,
    addFAQ,
    getFAQsByCategory,
    getFAQCounts
  };
};
