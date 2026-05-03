/**
 * @fileoverview Electronic Voting Machine (EVM) Simulator page.
 * Provides an interactive experience simulating the Indian EVM and VVPAT process.
 * @module pages/EVMSimulatorPage
 */

import { useState, useCallback, useMemo } from 'react';
import { usePageView } from '../hooks/usePageView';
import { useAudio } from '../hooks/useAudio';
import { EVM_CANDIDATES, VVPAT_DISPLAY_MS } from '../constants';

/**
 * Interactive simulator for EVM (Electronic Voting Machine) and VVPAT.
 * @returns {React.ReactElement} The EVM Simulator page.
 */
const EVMSimulatorPage = () => {
  const [votedFor, setVotedFor] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const { playBeep } = useAudio();

  // Track page view via custom hook
  usePageView('EVM Simulator');

  const candidates = useMemo(() => EVM_CANDIDATES, []);

  /**
   * Handles the voting action when a user clicks the blue EVM button.
   * Plays the audio beep and displays the VVPAT slip temporarily.
   * @param {Object} candidate - The candidate object that received the vote.
   */
  const handleVote = useCallback((candidate) => {
    // Prevent double voting
    if (votedFor !== null) return;

    setVotedFor(candidate.id);
    setSlipData(candidate);
    setIsPrinting(true);

    // Play the long beep sound characteristic of Indian EVMs
    playBeep();

    // VVPAT slip is visible for 7 seconds as per ECI rules
    setTimeout(() => {
      setIsPrinting(false);
    }, VVPAT_DISPLAY_MS);
  }, [votedFor, playBeep]);

  /**
   * Resets the simulator state to allow casting another test vote.
   */
  const resetSimulator = useCallback(() => {
    setVotedFor(null);
    setIsPrinting(false);
    setSlipData(null);
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">
        <span aria-hidden="true">🗳️</span> EVM Simulator
      </h1>
      <p className="page-subtitle">
        Experience casting a vote on India&apos;s Electronic Voting Machine. Press the blue button
        next to your chosen candidate. The VVPAT machine will print a verification slip visible for
        7 seconds.
      </p>

      <div className="evm-wrapper">
        <div className="evm-machine" aria-label="Electronic Voting Machine" role="region">
          <div className="evm-header">Ballot Unit</div>
          <div className="evm-body">
            {candidates.map((c) => (
              <div key={c.id} className="evm-row">
                <div className="evm-candidate">
                  <div className="evm-symbol" aria-hidden="true">
                    {c.symbol}
                  </div>
                  <div>
                    <div className="evm-name">{c.name}</div>
                    <div className="evm-party">{c.party}</div>
                  </div>
                </div>
                <div className="evm-controls">
                  <div
                    className={`evm-light ${votedFor === c.id ? 'active' : ''}`}
                    aria-hidden="true"
                  />
                  <button
                    className="evm-btn"
                    onClick={() => handleVote(c)}
                    disabled={votedFor !== null}
                    aria-label={`Vote for ${c.name}`}
                    type="button"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
 
        <div className="vvpat-machine" aria-label="Voter Verifiable Paper Audit Trail Machine" role="region">
          <div className="vvpat-title">VVPAT</div>
          <div className="vvpat-sub">Verify your vote for 7 seconds</div>
          <div className="vvpat-window">
            {slipData && (
              <div
                className={`vvpat-slip ${isPrinting ? 'printing' : ''} ${isPrinting ? 'show' : 'hide'}`}
                aria-live="assertive"
              >
                <span className="slip-serial">S.No: {slipData.id}</span>
                <span className="slip-symbol" aria-hidden="true">
                  {slipData.symbol}
                </span>
                <span className="slip-name">{slipData.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {votedFor && !isPrinting && (
        <div className="vote-success" role="alert" aria-live="assertive">
          <h2>✅ Vote Cast Successfully!</h2>
          <p className="success-description">
            You voted for <strong>{slipData?.name}</strong>. In a real election, the VVPAT slip
            drops into a sealed box for audit purposes. Your vote is now securely recorded in the
            EVM&apos;s control unit.
          </p>
          <button className="btn-secondary" onClick={resetSimulator} type="button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default EVMSimulatorPage;
