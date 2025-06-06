import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import './App.css';
import DailyAbilities from './components/DailyAbilities';
import ChoiceStats from './components/ChoiceStats';  
import ItemMiniGame from './components/ItemMiniGame';
import AIGuessYourMain from './components/AIGuessYourMain';

function App() {
  return (
    <Router>
      <div id="root">
        {/* Top Bar */}
        <header className="top-bar">
          <h1 className="site-title">LEAGUE PROJECT</h1>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/daily-abilities">Daily Ability Build</Link>
            <Link to="/item-minigame">Item Mini Game</Link>
            <Link to="/AIGuess">AI Guess Your Main</Link>
          </nav>
        </header>

        {/* Routes */} 
        <Routes>
          {/* Homepage Route */}
          <Route
            path="/"
            element={
              <section className="title-page">
                <div className="title-container">
                  <h2 className="title-heading">Welcome to the Arena</h2>
                  <p className="title-description">
                    Experience the ultimate gameplay and get the 0/10 Yasuo in your promotion games.
                  </p>
                </div>
              </section>
            }
          />

          {/* Daily Abilities Route */}
          <Route path="/daily-abilities" element={<DailyAbilities />} />
          
          {/* Choice Stats Route */}
          <Route path="/daily-abilities/stats" element={<ChoiceStats />} />

          {/* Item Minigame Route */}
          <Route path="/item-minigame" element={<ItemMiniGame />} />

          {/* AI guessing your main */}
          <Route path="/AIGuess" element={<AIGuessYourMain />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

