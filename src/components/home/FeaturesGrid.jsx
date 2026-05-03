import { Link } from 'react-router-dom';
import { Card } from '../UI';

/**
 * Features grid component for the homepage.
 * @returns {React.ReactElement} The features section.
 */
export const FeaturesGrid = () => (
  <section className="features-section" aria-labelledby="features-title">
    <div className="section-header">
      <h2 id="features-title">Explore Core Features</h2>
    </div>

    <div className="features-grid">
      <Link to="/ask" className="feature-link">
        <Card className="feature-card">
          <span className="feature-icon" aria-hidden="true">🤖</span>
          <h3>Ask Saarthi AI</h3>
          <p>Ask any question about Indian elections. Powered by Google Gemini AI.</p>
        </Card>
      </Link>

      <Link to="/mcc" className="feature-link">
        <Card className="feature-card">
          <span className="feature-icon" aria-hidden="true">⚖️</span>
          <h3>MCC Violation Checker</h3>
          <p>Describe a scenario and AI will analyze if it violates the Model Code of Conduct.</p>
        </Card>
      </Link>

      <Link to="/myths" className="feature-link">
        <Card className="feature-card">
          <span className="feature-icon" aria-hidden="true">🔍</span>
          <h3>Myth Buster</h3>
          <p>Common election myths debunked with facts. From EVMs to NOTA.</p>
        </Card>
      </Link>

      <Link to="/evm" className="feature-link">
        <Card className="feature-card">
          <span className="feature-icon" aria-hidden="true">🗳️</span>
          <h3>EVM Simulator</h3>
          <p>Experience casting a vote on a realistic Indian EVM with VVPAT.</p>
        </Card>
      </Link>
    </div>
  </section>
);
