import React, { useState, useEffect } from 'react';
import './DailyAbilities.css';
import champions from "../data/champions"
import axios from 'axios';

const fetchChampionData = async (randomChampion) => {
  const patch = '13.20.1'; // Replace with the latest patch
  const baseURL = `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`;

  try {
    // Fetch all champions
    const response = await axios.get(baseURL);
    const champions = response.data.data;

    // Example: Get detailed data for a specific champion (e.g., Aatrox)
    const championName = randomChampion; // Replace with desired champion name
    const championDetailURL = `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${championName}.json`;

    const championDetailResponse = await axios.get(championDetailURL);
    const championDetails = championDetailResponse.data.data[championName];

    // Get champion icon URL
    const championIconURL = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championName}.png`;

    // Get ability icons
    const abilityIcons = championDetails.spells.map(
      (spell) => `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell.image.full}`
    );

    return {
      championIcon: championIconURL,
      abilityIcons,
    };

  } catch (error) {
    console.error('Error fetching champion data:', error);
  }
};


function DailyAbilities() {
  const [championData, setChampionData] = useState([]);
  const [droppedAbilities, setDroppedAbilities] = useState({
    Q: null,
    W: null,
    E: null,
    R: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const selectedChampions = [];
      while (selectedChampions.length < 4) {
        const randomIndex = Math.floor(Math.random() * champions.length);
        const randomChampion = champions[randomIndex];
        if (!selectedChampions.includes(randomChampion)) {
          selectedChampions.push(randomChampion);
        }
      }

      console.log(`Fetching data for: ${selectedChampions}`);

      const championDataPromises = selectedChampions.map((champion) =>
        fetchChampionData(champion)
      );

      const data = await Promise.all(championDataPromises);
      setChampionData(data);
    };

    fetchData();
  }, []);

  if (!championData || championData.length < 4) {
    return <p>Loading...</p>;
  }

  // Handle drag start and pass ability data with its corresponding slot
  const handleDragStart = (event, ability, slot) => {
    event.dataTransfer.setData('ability', JSON.stringify({ ability, slot }));
  };

  // Handle drop event with validation
  const handleDrop = (event, slot) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('ability'));

    // Check if the dropped ability matches the intended slot
    if (data.slot === slot) {
      setDroppedAbilities((prev) => ({
        ...prev,
        [slot]: data.ability,
      }));
    } else {
      alert(`You can only drop the ${data.slot} ability into the ${data.slot} slot.`);
    }
  };

  // Allow drag over event to enable dropping
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <section className="daily-abilities-page">
      <div className="title-container">
        <h2 className="title-heading">Daily Ability Build</h2>
        <p className="title-description">
          Discover today's featured League champions and choose your best combination!
        </p>
      </div>
      <div className="abilities-container">
        {championData.map((champion, index) => (
          <div key={index} className="champion-box">
            <h3>{champion.championName}</h3>
            <img
              className="champion-icon"
              src={champion.championIcon}
              alt={`${champion.championName} Icon`}
              width="100"
            />
            <div className="ability-container">
              {['Q', 'W', 'E', 'R'].map((label, idx) => (
                <div
                  key={idx}
                  className="ability-box"
                  draggable
                  onDragStart={(event) => handleDragStart(event, champion.abilityIcons[idx], label)}
                >
                  <img src={champion.abilityIcons[idx]} alt={`Ability ${label}`} />
                  <span className="ability-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ability-drop-zone">
        {['Q', 'W', 'E', 'R'].map((slot) => (
          <div
            key={slot}
            className={`dropped-${slot}`}
            onDrop={(event) => handleDrop(event, slot)}
            onDragOver={handleDragOver}
          >
            {droppedAbilities[slot] ? (
              <img src={droppedAbilities[slot]} alt={`Dropped ${slot}`} width="50" />
            ) : (
              <span className="drop-placeholder">Drop {slot} here</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default DailyAbilities;

