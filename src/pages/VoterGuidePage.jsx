/**
 * @fileoverview Dedicated page for the interactive Voter Guide and Election Timeline.
 * Addresses the "timelines and steps" requirement of the problem statement.
 * @module pages/VoterGuidePage
 */

import { usePageView } from '../hooks/usePageView';
import { ELECTION_TIMELINE, VOTER_STEPS } from '../constants';
import { Link } from 'react-router-dom';

/**
 * Page component that provides a step-by-step guide and chronological timeline
 * of the Indian election process.
 * @returns {React.ReactElement} The Voter Guide page.
 */
const VoterGuidePage = () => {
  usePageView('Voter Guide');

  return (
    <div className="page-container">
      <div className="section-header">
        <h1 className="page-title">
          <span aria-hidden="true">🗺️</span> Complete Voter Guide
        </h1>
        <p className="page-subtitle">
          Everything you need to know about timelines, registration, and the voting process in India.
        </p>
      </div>

      <div className="guide-section">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h2>1. The Voter Journey</h2>
          <p>Follow these 4 simple steps to ensure your voice is heard.</p>
        </div>

        <div className="voter-journey-grid">
          {VOTER_STEPS.map((s, i) => (
            <div key={i} className="glass-card journey-card">
              <div className="step-badge">{s.step}</div>
              <p style={{ fontWeight: 500, margin: '12px 0' }}>{s.action}</p>
              {s.link && (
                s.link.startsWith('http') ? (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="step-link">
                    External Link ↗
                  </a>
                ) : (
                  <Link to={s.link} className="step-link">
                    Try Feature →
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="guide-section" style={{ marginTop: '64px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h2>2. Official Election Timeline</h2>
          <p>The standard ECI procedure from notification to counting.</p>
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
      </div>

      <div className="voter-footer-cta glass-card">
        <h3>Still have questions?</h3>
        <p>Ask our AI expert &quot;Saarthi&quot; for personalized answers about your specific situation.</p>
        <Link to="/ask" className="btn-primary">
          Chat with Saarthi
        </Link>
      </div>
    </div>
  );
};

export default VoterGuidePage;
