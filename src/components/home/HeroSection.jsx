import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Hero section for the homepage.
 * @param {Object} props - Component props.
 * @param {string} props.title - Main title.
 * @param {string} props.subtitle - Subtitle text.
 * @returns {React.ReactElement} The hero section.
 */
export const HeroSection = ({ title, subtitle }) => (
  <header className="hero-section" role="banner">
    <div className="hero-badge" role="status">
      <span aria-hidden="true">🇮🇳</span> AI-Powered Election Education Platform
    </div>

    <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }} />

    <p className="hero-subtitle">{subtitle}</p>

    <div className="hero-cta">
      <Link to="/ask" className="btn-primary">
        <span aria-hidden="true">💬</span> Ask Saarthi AI
      </Link>
      <Link to="/guide" className="btn-secondary">
        <span aria-hidden="true">🗺️</span> Full Voter Guide
      </Link>
    </div>
  </header>
);

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};
