/**
 * Election Myth Buster page.
 * Displays an interactive accordion of common election myths and their factual truths.
 * @module pages/MythBusterPage
 */
 
import { useState } from 'react';
import { ELECTION_MYTHS } from '../constants';
 
/**
 * Component that renders interactive cards to debunk election misinformation.
 * @returns {React.ReactElement} The Myth Buster page.
 */
const MythBusterPage = () => {
  // Store expanded state as a record where key is index and value is boolean
  const [expanded, setExpanded] = useState({});

  /**
   * Toggles the expanded state of a specific myth card.
   * @param {number} index - The index of the card to toggle.
   */
  const toggle = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span aria-hidden="true">🔍</span> Election Myth Buster
      </h1>
      <p className="page-subtitle">
        Misinformation weakens democracy. Click on any myth below to see the factual truth backed by
        ECI rules and Indian law.
      </p>

      <div className="myths-grid" role="list">
        {ELECTION_MYTHS.map((item, i) => {
          const isExpanded = !!expanded[i];

          return (
            <div key={i} role="listitem">
              <button
                type="button"
                className={`glass-card myth-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggle(i)}
                aria-expanded={isExpanded}
                style={{ width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
              >
                <span className="myth-label">Myth</span>
                <h3>&quot;{item.myth}&quot;</h3>

                {!isExpanded && (
                  <p className="click-hint" aria-hidden="true">
                    Click to reveal the truth →
                  </p>
                )}

                <div className="myth-truth" aria-hidden={!isExpanded}>
                  <strong style={{ color: 'var(--green)', display: 'block', marginBottom: '8px' }}>
                    ✅ The Truth:
                  </strong>
                  {item.truth}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MythBusterPage;
