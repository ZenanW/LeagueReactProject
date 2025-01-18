import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import './App.css';
import DailyAbilities from './components/DailyAbilities';

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
            <a href="#news">News</a>
            <a href="#community">Community</a>
            <a href="#about">About</a>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

