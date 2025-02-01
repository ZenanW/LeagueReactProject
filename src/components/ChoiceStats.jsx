import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ChoiceStats.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChoiceStats() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user's selected abilities from navigation state
  const userAbilities = location.state?.abilities || {
    Q: { abilityName: "Not Selected", champion: "Unknown Champion" },
    W: { abilityName: "Not Selected", champion: "Unknown Champion" },
    E: { abilityName: "Not Selected", champion: "Unknown Champion" },
    R: { abilityName: "Not Selected", champion: "Unknown Champion" },
  };

  // State to store community ability stats
  const [communityStats, setCommunityStats] = useState({
    Q: { ability: "Loading...", champion: "Loading...", frequency: 0 },
    W: { ability: "Loading...", champion: "Loading...", frequency: 0 },
    E: { ability: "Loading...", champion: "Loading...", frequency: 0 },
    R: { ability: "Loading...", champion: "Loading...", frequency: 0 },
  });

  // Fetch community choices from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/abilities/stats')
      .then(response => {
        console.log("API Response:", response.data); // Debugging
        
        if (!response.data.mostChosenAbilities || response.data.mostChosenAbilities.length === 0) {
          console.warn("No data received from API.");
          return;
        }

        // Convert array to an object for easy access
        const statsObj = response.data.mostChosenAbilities.reduce((acc, entry) => {
          acc[entry.slot] = entry;
          return acc;
        }, {});

        setCommunityStats(statsObj);
      })
      .catch(error => {
        console.error('Error fetching community abilities:', error.response ? error.response.data : error.message);
      });
  }, []);

  const goBack = () => {
    navigate('/daily-abilities');
  };

  // Prepare data for the chart
  const chartData = {
    labels: ['Q Ability', 'W Ability', 'E Ability', 'R Ability'],
    datasets: [
      {
        label: 'Most Chosen by Community',
        data: [
          communityStats.Q.frequency,
          communityStats.W.frequency,
          communityStats.E.frequency,
          communityStats.R.frequency
        ],
        backgroundColor: 'rgba(255, 204, 0, 0.7)',
        borderColor: 'rgba(255, 204, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Most Picked Ability per Slot',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="choice-stats-page">
      <div className="stats-container">
        <h2 className="stats-heading">Your Ability Choices vs. Community</h2>
        <p className="stats-description">
          Compare your ability selections to the most chosen abilities by the community.
        </p>

        <div className="stats-box">
          {["Q", "W", "E", "R"].map((slot) => (
            <div key={slot} className="stat-item">
              <h3>{slot} Ability</h3>
              <p className="stat-value">
                <strong>Your Pick:</strong> {userAbilities[slot]?.abilityName || "Not Selected"} ({userAbilities[slot]?.champion || "Unknown"})
              </p>
              <p className="stat-value">
                <strong>Most Chosen:</strong> {communityStats[slot]?.ability} ({communityStats[slot]?.champion}) - {communityStats[slot]?.frequency} picks
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart for Community Stats */}
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <button className="back-button" onClick={goBack}>Back to Selection</button>
      </div>
    </section>
  );
}

export default ChoiceStats;



