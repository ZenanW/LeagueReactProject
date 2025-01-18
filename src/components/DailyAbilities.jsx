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

  useEffect(() => {
    const fetchData = async () => {
      // Generate 4 unique random indices
      const selectedChampions = [];
      while (selectedChampions.length < 4) {
        const randomIndex = Math.floor(Math.random() * champions.length);
        const randomChampion = champions[randomIndex];
        if (!selectedChampions.includes(randomChampion)) {
          selectedChampions.push(randomChampion);
        }
      }

      console.log(`Fetching data for: ${selectedChampions}`); // Debugging log

      // Fetch data for each selected champion
      const championDataPromises = selectedChampions.map((champion) =>
        fetchChampionData(champion)
      );

      // Wait for all data to be fetched
      const data = await Promise.all(championDataPromises);

      // Update state with the fetched data
      setChampionData(data);
    };

    fetchData();
  }, []);

  if (!championData || championData.length < 4) {
    return <p>Loading...</p>;
  }

  return (
    <section className="daily-abilities-page">
      <div className="title-container">
        <h2 className="title-heading">Daily Ability Build</h2>
        <p className="title-description">
          Discover today's featured League champions and choose your best combination!
        </p>
      </div>
      <div className="abilities-container">
        <div className="champion-box">
          <h3>{championData[0].championName}</h3>
          <img
            src={championData[0].championIcon}
            alt={`${championData[0].championName} Icon`}
            width="100"
          />
          {championData[0].abilityIcons.map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt={`Ability ${index + 1}`}
              width="50"
              height="50"
              style={{ margin: '5px' }}
            />
          ))}
        </div>
        <div className="champion-box">
          <h3>{championData[1].championName}</h3>
            <img
              src={championData[1].championIcon}
              alt={`${championData[1].championName} Icon`}
              width="100"
            />
            {championData[1].abilityIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt={`Ability ${index + 1}`}
                width="50"
                height="50"
                style={{ margin: '5px' }}
              />
            ))}
        </div>
        <div className="champion-box">
          <h3>{championData[2].championName}</h3>
            <img
              src={championData[2].championIcon}
              alt={`${championData[2].championName} Icon`}
              width="100"
            />
            {championData[2].abilityIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt={`Ability ${index + 1}`}
                width="50"
                height="50"
                style={{ margin: '5px' }}
              />
            ))}
        </div>
        <div className="champion-box">
          <h3>{championData[3].championName}</h3>
            <img
              src={championData[3].championIcon}
              alt={`${championData[3].championName} Icon`}
              width="100"
            />
            {championData[3].abilityIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt={`Ability ${index + 1}`}
                width="50"
                height="50"
                style={{ margin: '5px' }}
              />
            ))}
        </div>
        <div className='ability-drop-zone'>
        </div>
      </div>
    </section>
  );
}

export default DailyAbilities;

