import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="hero-section">
      <div className="hero-badge">
        🇮🇳 AI-Powered Election Education Platform
      </div>

      <h1 className="hero-title">
        Understand India's<br />
        <span className="highlight">Election Process</span>
      </h1>

      <p className="hero-subtitle">
        From voter registration to casting your vote — Saarthi AI answers every question about
        Indian democracy. Check MCC violations, bust myths, and simulate the EVM experience.
      </p>

      <div className="hero-cta">
        <Link to="/ask" className="btn-primary">💬 Ask Saarthi AI</Link>
        <Link to="/mcc" className="btn-secondary">⚖️ Check MCC Violation</Link>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">96.8 Cr</div>
          <div className="stat-label">Registered Voters</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10.5 L</div>
          <div className="stat-label">Polling Stations</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">543</div>
          <div className="stat-label">Lok Sabha Seats</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">8</div>
          <div className="stat-label">MCC Sections</div>
        </div>
      </div>

      <div className="features-grid">
        <Link to="/ask" className="glass-card feature-card">
          <span className="feature-icon">🤖</span>
          <h3>Ask Saarthi AI</h3>
          <p>Ask any question about Indian elections. Powered by Google Gemini AI — get instant, accurate answers.</p>
        </Link>

        <Link to="/mcc" className="glass-card feature-card">
          <span className="feature-icon">⚖️</span>
          <h3>MCC Violation Checker</h3>
          <p>Describe a scenario and AI will analyze if it violates the Model Code of Conduct. Learn how to report via cVIGIL.</p>
        </Link>

        <Link to="/myths" className="glass-card feature-card">
          <span className="feature-icon">🔍</span>
          <h3>Myth Buster</h3>
          <p>Common election myths debunked with facts. From EVM hacking claims to NOTA misconceptions.</p>
        </Link>

        <Link to="/evm" className="glass-card feature-card">
          <span className="feature-icon">🗳️</span>
          <h3>EVM Simulator</h3>
          <p>Experience casting a vote on a realistic Indian Electronic Voting Machine with VVPAT verification.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
