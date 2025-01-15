import './App.css';

function App() {
  return (
    <div id="root">
      {/* Top Bar */}
      <header className="top-bar">
        <h1 className="site-title">LEAGUE PROJECT</h1>
        <nav className="nav-links">
          <a href="#Daily_Ability_Build">Daily Ability Build</a>
          <a href="#news">News</a>
          <a href="#community">Community</a>
          <a href="#about">About</a>
        </nav>
      </header>

      {/* Title Section */}
      <section className="title-page">
        <div className="title-container">
          <h2 className="title-heading">Welcome to the Arena</h2>
          <p className="title-description">
            Experience the ultimate gameplay and get the 0/10 Yasuo in your promotion games.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
