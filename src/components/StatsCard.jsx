import React from 'react';

const StatsCard = ({ section, count, color, label }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {label.charAt(0)}
    </div>
    <div className="stat-info">
      <h3>{label}</h3>
      <div className="stat-count">{count} FAQs</div>
    </div>
  </div>
);

export default StatsCard;

