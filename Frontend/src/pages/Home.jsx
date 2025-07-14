import React from 'react';
import { useNavigate } from 'react-router-dom';
import FAQCard from '../components/FAQCard';
import { useFAQs } from '../hooks/useFAQs';
import { useAuth } from '../context/useAuth'; // ✅ Import Auth
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { getFAQCounts } = useFAQs();
  const { auth } = useAuth(); // ✅ Get user sections
  const counts = getFAQCounts();

  // Build categories from user sections
  const categories = (auth.sections || []).map((section) => ({
    title: section,
    path: `/${section.toLowerCase()}`,
    icon: section[0]?.toUpperCase() || 'S',
    count: counts[section.toUpperCase()] || 0
  }));

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-card">
        <h2>
          Welcome to <span className="highlight">FAQ Hub</span>
        </h2>
        <p>
          Browse through your assigned FAQ sections to find and manage questions.
        </p>
      </div>

      {/* FAQ Categories Grid */}
      <div className="faq-grid">
        {categories.length === 0 ? (
          <p className="no-sections">No sections assigned to your account.</p>
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              className="faq-card-wrapper"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <FAQCard
                title={category.title}
                count={category.count}
                icon={category.icon}
                onClick={() => navigate(category.path)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
