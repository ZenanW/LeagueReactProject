import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { HeatMapGrid } from 'react-grid-heatmap'
import "./ChoiceStats.css";

function ChoiceStats() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user's selected abilities
  const userAbilities = location.state?.abilities || {
    Q: { abilityName: "Not Selected", champion: "Unknown Champion" },
    W: { abilityName: "Not Selected", champion: "Unknown Champion" },
    E: { abilityName: "Not Selected", champion: "Unknown Champion" },
    R: { abilityName: "Not Selected", champion: "Unknown Champion" },
  };

  // State for heatmap
  const [heatmapData, setHeatmapData] = useState([]);
  const [champions, setChampions] = useState([]);
  const [slots] = useState(["Q", "W", "E", "R"]);

  useEffect(() => {
    // Fetch daily champions first
    axios.get("https://nodebackend-production-cbb7.up.railway.app/api/daily-champions")
      .then(response => {
        const dailyChampions = response.data.champions;
        console.log("✅ Daily Champions:", dailyChampions);

        if (!dailyChampions || dailyChampions.length === 0) {
          console.warn("No daily champions received.");
          return;
        }

        // Fetch ability stats next
        axios.get("https://nodebackend-production-cbb7.up.railway.app/api/abilities/stats")
          .then(res => {
            console.log("✅ Ability Stats:", res.data);

            if (!res.data.abilityHeatmap || res.data.abilityHeatmap.length === 0) {
              console.warn("No heatmap data received.");
              return;
            }

            // Map ability stats into an easy lookup format
            const abilityStats = {};
            res.data.abilityHeatmap.forEach(entry => {
              if (!abilityStats[entry.champion]) {
                abilityStats[entry.champion] = { Q: 0, W: 0, E: 0, R: 0 };
              }
              abilityStats[entry.champion][entry.slot] = entry.frequency;
            });

            // Ensure every daily champion has all four ability slots
            const championNames = dailyChampions;
            const matrix = championNames.map(champ =>
              slots.map(slot => (abilityStats[champ] ? abilityStats[champ][slot] : 0))
            );

            setChampions(championNames);
            setHeatmapData(matrix);
          })
          .catch(err => console.error("Error fetching ability stats:", err.message));
      })
      .catch(err => console.error("Error fetching daily champions:", err.message));
  }, []);

  const goBack = () => {
    navigate('/daily-abilities');
  };

  return (
    <section className="choice-stats-page">
      <div className="stats-container">
        <h2 className="stats-heading">Community Ability Heatmap</h2>
        <p className="stats-description">
          Compare your ability selections with the most chosen abilities by the community.
        </p>

        {/* User's Ability Selections */}
        <div className="stats-box">
          {["Q", "W", "E", "R"].map((slot) => (
            <div key={slot} className="stat-item">
              <h3>{slot} Ability</h3>
              <p className="stat-value">
                <strong>Your Pick:</strong> <span>{userAbilities[slot]?.abilityName || "Not Selected"}</span> 
                ({userAbilities[slot]?.champion || "Unknown"})
              </p>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="chart-container">
          {/* Heatmap grid */}
          <div className="heatmap">
            <HeatMapGrid
              xLabels={slots}
              yLabels={champions}
              data={heatmapData}
              cellHeight="7rem"
              cellWidth="7rem"
              xLabelsPos="top"
              yLabelsPos="left"
              yLabelWidth={120}
              xLabelsStyle={() => ({
                fontSize: "18px",
                fontFamily: "Arial, sans-serif",
                color: "#ffffff",
              })}
              yLabelsStyle={() => ({
                fontSize: "18px",
                fontFamily: "Arial, sans-serif",
                color: "#ffffff",
                textAlign: "right",
                paddingRight: "10px",
              })}
              cellStyle={(_x, _y, ratio) => ({
                background: `rgba(255, 204, 0, ${ratio})`,
                fontSize: "1rem",
                color: `rgba(255, 255, 255, ${ratio > 0.5 ? 1 : 0.8})`,
                border: "2.5px solid rgb(255, 255, 255)",
                borderRadius: "0",
                width: "7rem", 
                minWidth: "4rem",
                height: "7rem",
                minHeight: "4rem",
              })}
            />
          </div>
        </div>
        
        {/* Back Button */}
        <button className="back-button" onClick={goBack}>Back to Selection</button>
      </div>
    </section>
  );
}

export default ChoiceStats;



