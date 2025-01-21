import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChoiceStats.css';

function ChoiceStats() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/daily-abilities');
  };

  return (
    <section className="choice-stats-page">
      <div className="stats-container">
        <h2 className="stats-heading">Your Ability Choices</h2>
        <p className="stats-description">
          Here's a summary of your ability selections compared to the community picks.
        </p>

        <div className="stats-box">
          <div className="stat-item">
            <h3>Q Ability</h3>
            <p className="stat-value">Your Pick: <span>Ability 1</span></p>
            <p className="stat-value">Community Pick: <span>Ability 2</span></p>
          </div>

          <div className="stat-item">
            <h3>W Ability</h3>
            <p className="stat-value">Your Pick: <span>Ability 3</span></p>
            <p className="stat-value">Community Pick: <span>Ability 3</span></p>
          </div>

          <div className="stat-item">
            <h3>E Ability</h3>
            <p className="stat-value">Your Pick: <span>Ability 2</span></p>
            <p className="stat-value">Community Pick: <span>Ability 1</span></p>
          </div>

          <div className="stat-item">
            <h3>R Ability</h3>
            <p className="stat-value">Your Pick: <span>Ability 4</span></p>
            <p className="stat-value">Community Pick: <span>Ability 4</span></p>
          </div>
        </div>

        <button className="back-button" onClick={goBack}>Back to Selection</button>
      </div>
    </section>
  );
}

export default ChoiceStats;
