import React from "react";
import { SECTIONS } from "../constants/sections";
import { useFAQs } from "../hooks/useFAQs";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsCard from "../components/StatsCard";

const Home = () => {
  const { faqs: allFaqs, loading } = useFAQs();

  if (loading) {
    return <LoadingSpinner message="Loading stats..." />;
  }

  return (
    <div className="home">
      <div className="welcome-section">
        <h2>Welcome to FAQ Hub</h2>
        <p>Browse through our comprehensive FAQ sections to find answers to common questions.</p>
      </div>

      <div className="stats-grid">
        {Object.entries(SECTIONS).map(([key, section]) => (
          <StatsCard
            key={key}
            section={key}
            count={allFaqs[key]?.length || 0}
            color={section.color}
            label={section.label}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

