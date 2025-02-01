import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyAbilities.css';
import axios from 'axios';

const patch = '14.24.1'; // Update this to the latest patch

// Function to fetch ability data from Riot API
const fetchChampionData = async (championName) => {
  const championDetailURL = `https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${championName}.json`;

  try {
    const response = await axios.get(championDetailURL);
    const championDetails = response.data.data[championName];

    // Get champion icon URL
    const championIconURL = `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${championName}.png`;

    // Get ability names and icons
    const abilities = championDetails.spells.map((spell) => ({
      name: spell.name, // Ability name (e.g., "Dark Flight")
      icon: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${spell.image.full}`, // Ability icon URL
    }));

    return {
      championName,
      championIcon: championIconURL,
      abilities, // Array of abilities with names and icons
    };
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return null;
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch 5 champions from your backend
        const response = await axios.get('http://localhost:5000/api/daily-champions');
        const selectedChampions = response.data.champions; // List of 5 champion names

        console.log(`Fetching data for: ${selectedChampions}`);

        // 🔹 Fetch ability data for each champion from Riot API
        const championDataPromises = selectedChampions.map((champion) =>
          fetchChampionData(champion)
        );

        const data = await Promise.all(championDataPromises);
        setChampionData(data.filter(Boolean)); // Remove null values if API calls fail
      } catch (error) {
        console.error('Error fetching daily champions:', error);
      }
    };

    fetchData();
  }, []);

  if (!championData || championData.length < 4) {
    return <p>Loading...</p>;
  }

  // Handle form submission
  const handleSubmit = async () => {
    console.log("Submitting abilities:", droppedAbilities); // Debug log

    try {
      const response = await axios.post('http://localhost:5000/api/abilities', {
        abilities: droppedAbilities 
      });

      if (response.status === 201) {
        console.log("Abilities successfully stored:", response.data);
        navigate('/daily-abilities/stats', { state: { abilities: droppedAbilities } });
      }
    } catch (error) {
      console.error("Error submitting abilities:", error);
    }
  };

  // Handle drag start and pass ability data with its corresponding slot
  const handleDragStart = (event, ability, slot, champion) => {
    event.dataTransfer.setData(
      'ability',
      JSON.stringify({ 
        abilityName: ability.name, // Store ability name
        abilityIcon: ability.icon, // Store ability icon
        slot: slot, 
        champion: champion // Store champion name
      })
    );
  };

  // Handle drop event with validation
  const handleDrop = (event, slot) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('ability'));

    // Check if the dropped ability matches the intended slot
    if (data.slot === slot) {
      setDroppedAbilities((prev) => ({
        ...prev,
        [slot]: { // ✅ Store the ability as an object containing both the name and champion
          abilityName: data.abilityName, 
          champion: data.champion,
          abilityIcon: data.abilityIcon // Optional, if needed for frontend display
        }
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
                  draggable="true"
                  onDragStart={(event) => handleDragStart(event, champion.abilities[idx], label, champion.championName)}
                >
                  <img src={champion.abilities[idx].icon} alt={`Ability ${label}`} />
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
              <img src={droppedAbilities[slot].abilityIcon} alt={`Dropped ${slot}`} width="50" />
            ) : (
              <span className="drop-placeholder">Drop {slot} here</span>
            )}
          </div>
        ))}
        <div className='submit' onClick={handleSubmit} style={{ cursor: 'pointer' }}>
          <p>Lock In</p>
        </div>
      </div>
    </section>
  );
}

export default DailyAbilities;


