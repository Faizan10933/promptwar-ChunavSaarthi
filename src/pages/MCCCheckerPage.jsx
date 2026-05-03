/**
 * @fileoverview AI-powered tool to analyze Model Code of Conduct violations.
 * Allows users to input scenarios and receive structured analysis from Gemini.
 * @module pages/MCCCheckerPage
 */

import { useState } from 'react';
import { checkMCCViolation, isAPIKeyConfigured } from '../lib/gemini';
import { logToFirestore, trackEvent } from '../lib/firebase';
import { usePageView } from '../hooks/usePageView';
import { Card, Spinner, Badge } from '../components/UI';
import { MCC_EXAMPLES } from '../constants';

import { PageHeader } from '../components/PageHeader';
import { Banner } from '../components/Banner';

/**
 * Component for checking Election Commission Model Code of Conduct violations.
 * @returns {React.ReactElement} The MCC Checker page.
 */
const MCCCheckerPage = () => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasKey = isAPIKeyConfigured();

  // Track page view via custom hook
  usePageView('MCC Checker');

  /**
   * Triggers the AI analysis of the provided scenario.
   */
  const handleCheck = async () => {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResult(null);
    trackEvent('mcc_check_started');

    try {
      const res = await checkMCCViolation(scenario);
      setResult(res);
      trackEvent('mcc_check_success', { is_violation: res.is_violation });

      // Automatically log the checked scenario to Firestore for analytics
      await logToFirestore('mcc_reports', {
        scenario_description: scenario,
        is_violation: res.is_violation,
        section: res.section,
        confidence: res.confidence,
      });
    } catch (err) {
      setResult({ error: err.message });
      trackEvent('mcc_check_error', { error: err.message });
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
      <PageHeader 
        title="MCC Violation Checker" 
        subtitle="Describe a real-world scenario and our AI will analyze whether it violates the Election Commission's Model Code of Conduct." 
        icon="⚖️" 
      />

      {!hasKey && (
        <Banner message="Set your Gemini API key: Create a .env file with VITE_GEMINI_API_KEY=your_key" />
      )}

      <Card className="mcc-checker-form">
        <label htmlFor="scenario-input" className="visually-hidden">
          Describe a scenario
        </label>
        <textarea
          id="scenario-input"
          className="mcc-textarea"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe a scenario... e.g., 'A minister inaugurated a government hospital after elections were announced'"
          aria-label="Scenario description"
        />

        <div className="mcc-form-actions">
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={loading || !scenario.trim()}
            type="button"
          >
            {loading ? (
              <>
                <Spinner />
                Analyzing...
              </>
            ) : (
              'Analyze Scenario'
            )}
          </button>
          <span className="mcc-hint">
            or try an example:
          </span>
        </div>

        <div className="mcc-suggestions">
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
      </Card>

      {result && !result.error && (
        <div
          className={`mcc-result ${result.is_violation ? 'violation' : 'no-violation'}`}
          role="region"
          aria-live="polite"
        >
          <h3 className={result.is_violation ? 'text-error' : 'text-success'}>
            {result.is_violation ? '🚨 MCC Violation Detected' : '✅ No Violation Found'}
            {result.confidence && (
              <Badge text={`${result.confidence} CONFIDENCE`} className="result-badge" />
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
        <Banner message={`Error: ${result.error}`} type="error" />
      )}
    </div>
  );
};

export default MCCCheckerPage;
