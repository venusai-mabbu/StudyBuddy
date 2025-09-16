import React from 'react';
import { useNavigate } from 'react-router-dom';
import FAQCard from '../components/FAQCard';
import { useAuth } from '../context/useAuth';
import './Home.css';
// import VoiceToText from '../components/VoiceToText';

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const categories = (auth.sections || []).map((section) => ({
    title: section,
    path: `/section/${section}`,
    icon: section[0]?.toUpperCase() || 'S',
  }));

  return (
    <main className="home-container">
      <section className="welcome-card">
        <h2>
          Welcome to <span className="highlight">FAQ Hub</span>

        </h2>
        <p>Browse through your assigned FAQ sections to find and manage questions.</p>
      </section>

      <section className="faq-grid">
        {categories.length === 0 ? (
          <p className="no-sections">No sections assigned to your account.</p>
        ) : (
          categories.map((category, index) => (
            <div
            key={index}
            className="faq-card-wrapper"
            style={{ animationDelay: `${index * 100}ms` }}
            >
              {console.log(category)}
              <FAQCard
                title={category.title}
                icon={category.icon}
                count={9}
                onClick={() => navigate(category.path)}
              />
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Home;
