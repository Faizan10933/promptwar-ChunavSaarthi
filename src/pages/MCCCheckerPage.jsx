/**
 * @fileoverview AI-powered tool to analyze Model Code of Conduct violations.
 * Allows users to input scenarios and receive structured analysis from Gemini.
 * @module pages/MCCCheckerPage
 */

import React, { useState } from 'react';
import { checkMCCViolation, isAPIKeyConfigured } from '../lib/gemini';
import { MCC_EXAMPLES } from '../constants';

/**
 * Component for checking Election Commission Model Code of Conduct violations.
 * @returns {React.ReactElement} The MCC Checker page.
 */
const MCCCheckerPage = () => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasKey = isAPIKeyConfigured();

  /**
   * Triggers the AI analysis of the provided scenario.
   */
  const handleCheck = async () => {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await checkMCCViolation(scenario);
      setResult(res);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper to render individual detail rows safely.
   * @param {string} label - The label for the data.
   * @param {string} value - The actual content string.
   * @returns {React.ReactElement|null} The rendered row or null if empty.
   */
  const renderDetail = (label, value) => {
    if (!value) return null;
    return (
      <div className="mcc-detail">
        <strong>{label}</strong>
        {value}
      </div>
    );
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span aria-hidden="true">⚖️</span> MCC Violation Checker
      </h1>
      <p className="page-subtitle">
        Describe a real-world scenario and our AI will analyze whether it violates the
        Election Commission's Model Code of Conduct. Learn your rights as a citizen.
      </p>

      {!hasKey && (
        <div className="api-banner" role="alert">
          ⚠️ Set your Gemini API key: Create a <code>.env</code> file with <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <label htmlFor="scenario-input" className="visually-hidden">Describe a scenario</label>
        <textarea
          id="scenario-input"
          className="mcc-textarea"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe a scenario... e.g., 'A minister inaugurated a government hospital after elections were announced'"
          aria-label="Scenario description"
        />

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={loading || !scenario.trim()}
            type="button"
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '8px' }} aria-hidden="true" />
                Analyzing...
              </>
            ) : (
              'Analyze Scenario'
            )}
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>or try an example:</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {MCC_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => {
                setScenario(ex);
                setResult(null);
              }}
              type="button"
            >
              {ex.substring(0, 50)}...
            </button>
          ))}
        </div>
      </div>

      {result && !result.error && (
        <div className={`mcc-result ${result.is_violation ? 'violation' : 'no-violation'}`} role="region" aria-live="polite">
          <h3 style={{ color: result.is_violation ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {result.is_violation ? '🚨 MCC Violation Detected' : '✅ No Violation Found'}
            {result.confidence && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  fontWeight: 600,
                }}
              >
                {result.confidence.toUpperCase()} CONFIDENCE
              </span>
            )}
          </h3>

          {renderDetail('Section Violated', result.section)}
          {renderDetail('Specific Rule', result.rule)}
          {renderDetail('Explanation', result.explanation)}
          {renderDetail('How to Report', result.how_to_report)}
          {renderDetail('Similar Cases', result.similar_cases)}
        </div>
      )}

      {result?.error && (
        <div
          className="api-banner"
          role="alert"
          style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: 'var(--red)' }}
        >
          ⚠️ Error: {result.error}
        </div>
      )}
    </div>
  );
};

export default MCCCheckerPage;
