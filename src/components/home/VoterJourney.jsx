import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card } from '../UI';

/**
 * Interactive Voter Journey component for the homepage.
 * @param {Object} props - Component props.
 * @param {Array} props.steps - Array of voter journey steps.
 * @returns {React.ReactElement} The journey section.
 */
export const VoterJourney = ({ steps }) => (
  <section className="voter-journey-section" aria-labelledby="journey-title">
    <div className="section-header">
      <h2 id="journey-title">Interactive Voter Journey</h2>
      <p>Simple steps to exercise your democratic right</p>
    </div>

    <div className="voter-journey-grid">
      {steps.map((s, i) => (
        <Card key={i} className="journey-card">
          <div className="step-badge" aria-hidden="true">{s.step}</div>
          <p style={{ fontWeight: 500, margin: '12px 0' }}>{s.action}</p>
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
        </Card>
      ))}
    </div>
  </section>
);

VoterJourney.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      step: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
};
