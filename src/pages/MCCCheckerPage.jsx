import React, { useState } from 'react';
import { checkMCCViolation, isAPIKeyConfigured } from '../lib/gemini';

const EXAMPLES = [
  "The Chief Minister inaugurated a new highway during the election period.",
  "A candidate distributed free sarees to voters in a village.",
  "A political party held a rally 200 meters from a polling booth on election day.",
  "The ruling party launched a new pension scheme after elections were announced.",
  "A candidate's speech asked people to vote based on their religion.",
];

const MCCCheckerPage = () => {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasKey = isAPIKeyConfigured();

  const handleCheck = async () => {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await checkMCCViolation(scenario);
      setResult(res);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">⚖️ MCC Violation Checker</h1>
      <p className="page-subtitle">
        Describe a real-world scenario and our AI will analyze whether it violates the 
        Election Commission's Model Code of Conduct. Learn your rights as a citizen.
      </p>

      {!hasKey && (
        <div className="api-banner">
          ⚠️ Set your Gemini API key: Create a <code>.env</code> file with <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <textarea
          className="mcc-textarea"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe a scenario... e.g., 'A minister inaugurated a government hospital after elections were announced'"
        />

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleCheck} disabled={loading || !scenario.trim()}>
            {loading ? <><span className="spinner" style={{ marginRight: '8px' }}></span> Analyzing...</> : 'Analyze Scenario'}
          </button>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>or try an example:</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => { setScenario(ex); setResult(null); }}
            >
              {ex.substring(0, 50)}...
            </button>
          ))}
        </div>
      </div>

      {result && !result.error && (
        <div className={`mcc-result ${result.is_violation ? 'violation' : 'no-violation'}`}>
          <h3 style={{ color: result.is_violation ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {result.is_violation ? '🚨 MCC Violation Detected' : '✅ No Violation Found'}
            {result.confidence && (
              <span style={{
                fontSize: '0.7rem',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '100px',
                fontWeight: 600,
              }}>
                {result.confidence.toUpperCase()} CONFIDENCE
              </span>
            )}
          </h3>

          {result.section && (
            <div className="mcc-detail">
              <strong>Section Violated</strong>
              {result.section}
            </div>
          )}

          {result.rule && (
            <div className="mcc-detail">
              <strong>Specific Rule</strong>
              {result.rule}
            </div>
          )}

          {result.explanation && (
            <div className="mcc-detail">
              <strong>Explanation</strong>
              {result.explanation}
            </div>
          )}

          {result.how_to_report && (
            <div className="mcc-detail">
              <strong>How to Report</strong>
              {result.how_to_report}
            </div>
          )}

          {result.similar_cases && (
            <div className="mcc-detail">
              <strong>Similar Cases</strong>
              {result.similar_cases}
            </div>
          )}
        </div>
      )}

      {result && result.error && (
        <div className="api-banner" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: 'var(--red)' }}>
          ⚠️ Error: {result.error}
        </div>
      )}
    </div>
  );
};

export default MCCCheckerPage;
