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
    Q: "Not Selected",
    W: "Not Selected",
    E: "Not Selected",
    R: "Not Selected",
  };

  // State to store community ability stats
  const [communityStats, setCommunityStats] = useState([]);

  // Fetch community choices from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/abilities/stats')
      .then(response => {
        console.log("API Response:", response.data);  // Debugging
        
        if (!response.data.mostChosenCombinations || response.data.mostChosenCombinations.length === 0) {
          console.warn("No data received from API.");
        }
  
        setCommunityStats(response.data.mostChosenCombinations || []);
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
    labels: communityStats.map((combo, index) => `Build ${index + 1}`),
    datasets: [
      {
        label: 'Frequency of Ability Combination',
        data: communityStats.map(combo => combo.frequency), // 🚨 Ensure `frequency` is a number
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
        text: 'Top 10 Most Picked Ability Builds',
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
        <h2 className="stats-heading">Your Ability Choices</h2>
        <p className="stats-description">
          Here's a summary of your ability selections compared to the community picks.
        </p>

        <div className="stats-box">
          {["Q", "W", "E", "R"].map((ability) => (
            <div key={ability} className="stat-item">
              <h3>{ability} Ability</h3>
              <p className="stat-value">
                Your Pick: 
                <span>
                  {userAbilities[ability]?.abilityName || "Not Selected"} 
                  ({userAbilities[ability]?.champion || "Unknown Champion"})
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart for Ability Combinations */}
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <button className="back-button" onClick={goBack}>Back to Selection</button>
      </div>
    </section>
  );
}

export default ChoiceStats;


