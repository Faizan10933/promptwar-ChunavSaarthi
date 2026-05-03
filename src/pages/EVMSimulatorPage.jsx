import React, { useState } from 'react';

const CANDIDATES = [
  { id: 1, name: "Rahul Verma", party: "Development Party", symbol: "🏢" },
  { id: 2, name: "Priya Singh", party: "Green Future", symbol: "🌱" },
  { id: 3, name: "Amit Kumar", party: "National Front", symbol: "⭐" },
  { id: 4, name: "NOTA", party: "None of the Above", symbol: "🚫" },
];

const EVMSimulatorPage = () => {
  const [votedFor, setVotedFor] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [slipData, setSlipData] = useState(null);

  const handleVote = (candidate) => {
    if (votedFor) return;
    setVotedFor(candidate.id);
    setSlipData(candidate);
    setIsPrinting(true);

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 2000);
    } catch (e) {}

    setTimeout(() => setIsPrinting(false), 7000);
  };

  const reset = () => {
    setVotedFor(null);
    setIsPrinting(false);
    setSlipData(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🗳️ EVM Simulator</h1>
      <p className="page-subtitle">
        Experience casting a vote on India's Electronic Voting Machine. Press the blue button 
        next to your chosen candidate. The VVPAT machine will print a verification slip visible for 7 seconds.
      </p>

      <div className="evm-wrapper">
        <div className="evm-machine">
          <div className="evm-header">Ballot Unit</div>
          <div className="evm-body">
            {CANDIDATES.map((c) => (
              <div key={c.id} className="evm-row">
                <div className="evm-candidate">
                  <div className="evm-symbol">{c.symbol}</div>
                  <div>
                    <div className="evm-name">{c.name}</div>
                    <div className="evm-party">{c.party}</div>
                  </div>
                </div>
                <div className="evm-controls">
                  <div className={`evm-light ${votedFor === c.id ? 'active' : ''}`} />
                  <button
                    className="evm-btn"
                    onClick={() => handleVote(c)}
                    disabled={votedFor !== null}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vvpat-machine">
          <div className="vvpat-title">VVPAT</div>
          <div className="vvpat-sub">Verify your vote for 7 seconds</div>
          <div className="vvpat-window">
            {slipData && (
              <div className={`vvpat-slip ${isPrinting ? 'printing' : ''}`} style={{ display: isPrinting ? 'flex' : 'none' }}>
                <span className="slip-serial">S.No: {slipData.id}</span>
                <span className="slip-symbol">{slipData.symbol}</span>
                <span className="slip-name">{slipData.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {votedFor && !isPrinting && (
        <div className="vote-success">
          <h2>✅ Vote Cast Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            You voted for <strong>{slipData?.name}</strong>. In a real election, the VVPAT slip drops 
            into a sealed box for audit purposes. Your vote is now securely recorded in the EVM's control unit.
          </p>
          <button className="btn-secondary" onClick={reset}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default EVMSimulatorPage;
