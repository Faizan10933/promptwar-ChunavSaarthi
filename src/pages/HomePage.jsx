/**
 * @fileoverview Landing page component for the Chunav Saarthi app.
 * Provides navigation to core features and displays key election statistics.
 * @module pages/HomePage
 */

import { Link } from 'react-router-dom';
import { ELECTION_STATS, ELECTION_TIMELINE, VOTER_STEPS } from '../constants';

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
        <Link to="/guide" className="btn-secondary">
          <span aria-hidden="true">🗺️</span> Full Voter Guide
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

      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2>Interactive Voter Journey</h2>
        <p>Simple steps to exercise your democratic right</p>
      </div>

      <div className="voter-journey-grid">
        {VOTER_STEPS.map((s, i) => (
          <div key={i} className="glass-card journey-card">
            <div className="step-badge">{s.step}</div>
            <p>{s.action}</p>
            {s.link && (
              s.link.startsWith('http') ? (
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="step-link">
                  Learn More ↗
                </a>
              ) : (
                <Link to={s.link} className="step-link">
                  Try it Now →
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2>Election Process Timeline</h2>
        <p>From announcement to results: The 7-step ECI procedure</p>
      </div>

      <div className="timeline-container">
        {ELECTION_TIMELINE.map((t, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-phase">{t.phase}</span>
                <span className="timeline-duration">{t.duration}</span>
              </div>
              <p className="timeline-desc">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2>Explore Core Features</h2>
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
