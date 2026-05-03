/**
 * @fileoverview Landing page component for the Chunav Saarthi app.
 * Provides navigation to core features and displays key election statistics.
 * @module pages/HomePage
 */

import { Link } from 'react-router-dom';
import { ELECTION_STATS } from '../constants';

/**
 * The homepage/dashboard component.
 * @returns {React.ReactElement} The rendered homepage.
 */
const HomePage = () => {
  return (
    <div className="hero-section">
      <div className="hero-badge" role="status">
        <span aria-hidden="true">🇮🇳</span> AI-Powered Election Education Platform
      </div>

      <h1 className="hero-title">
        Understand India&apos;s
        <br />
        <span className="highlight">Election Process</span>
      </h1>

      <p className="hero-subtitle">
        From voter registration to casting your vote — Saarthi AI answers every question about
        Indian democracy. Check MCC violations, bust myths, and simulate the EVM experience.
      </p>

      <div className="hero-cta">
        <Link to="/ask" className="btn-primary">
          <span aria-hidden="true">💬</span> Ask Saarthi AI
        </Link>
        <Link to="/mcc" className="btn-secondary">
          <span aria-hidden="true">⚖️</span> Check MCC Violation
        </Link>
      </div>

      <div className="stats-row" aria-label="Key Election Statistics">
        {ELECTION_STATS.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="features-grid">
        <Link to="/ask" className="glass-card feature-card">
          <span className="feature-icon" aria-hidden="true">
            🤖
          </span>
          <h3>Ask Saarthi AI</h3>
          <p>
            Ask any question about Indian elections. Powered by Google Gemini AI — get instant,
            accurate answers.
          </p>
        </Link>

        <Link to="/mcc" className="glass-card feature-card">
          <span className="feature-icon" aria-hidden="true">
            ⚖️
          </span>
          <h3>MCC Violation Checker</h3>
          <p>
            Describe a scenario and AI will analyze if it violates the Model Code of Conduct. Learn
            how to report via cVIGIL.
          </p>
        </Link>

        <Link to="/myths" className="glass-card feature-card">
          <span className="feature-icon" aria-hidden="true">
            🔍
          </span>
          <h3>Myth Buster</h3>
          <p>
            Common election myths debunked with facts. From EVM hacking claims to NOTA
            misconceptions.
          </p>
        </Link>

        <Link to="/evm" className="glass-card feature-card">
          <span className="feature-icon" aria-hidden="true">
            🗳️
          </span>
          <h3>EVM Simulator</h3>
          <p>
            Experience casting a vote on a realistic Indian Electronic Voting Machine with VVPAT
            verification.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
