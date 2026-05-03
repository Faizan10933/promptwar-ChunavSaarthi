import React, { useState } from 'react';

const MYTHS = [
  {
    myth: "EVMs can be hacked remotely",
    truth: "EVMs are standalone machines with NO internet, Wi-Fi, or Bluetooth connectivity. They use one-time programmable (OTP) chips manufactured by Bharat Electronics Limited (BEL) and Electronics Corporation of India (ECIL). The software is burned onto the chip at the factory and CANNOT be reprogrammed. The ECI has held multiple open challenges — no one has successfully hacked an EVM under controlled conditions.",
  },
  {
    myth: "If NOTA gets the most votes, re-election happens",
    truth: "This is FALSE. As per current Indian law, NOTA is merely an option to register dissent. Even if NOTA gets the highest number of votes, the candidate with the most actual votes still wins. However, in local body elections in some states (like Haryana and Maharashtra), NOTA winning does trigger a re-election. The Supreme Court has been petitioned to extend this to general elections, but no ruling has been passed yet.",
  },
  {
    myth: "You need your Voter ID card to vote",
    truth: "While the EPIC (Voter ID) is the most common document, the ECI accepts 12 alternative photo identity documents including Aadhaar Card, Passport, Driving License, PAN Card, and even certain government-issued photo ID cards. Your name must, however, be on the electoral roll for your constituency.",
  },
  {
    myth: "NRIs cannot vote in Indian elections",
    truth: "NRIs CAN vote! Since 2011, NRIs who have a valid Indian passport can register as overseas electors under Section 20A of the Representation of the People Act, 1950. However, they must be physically present at the polling booth in their constituency to cast their vote. The ECI has been working on e-postal ballots for NRIs, but it is not yet fully implemented.",
  },
  {
    myth: "Exit polls can influence election results",
    truth: "This is why the ECI bans the publication of exit polls from the start of polling in the first phase until the last phase ends. Section 126A of the RPA prohibits exit polls during this period. Violation can result in imprisonment up to 2 years and/or a fine. Opinion polls (before voting) are allowed, but exit polls (after voting) are strictly regulated.",
  },
  {
    myth: "The ruling party can launch welfare schemes during elections",
    truth: "Once the Model Code of Conduct is in effect, the ruling party (Centre or State) CANNOT announce any new projects, schemes, or grants. Section 7 of the MCC specifically prohibits the party in power from using official machinery or public exchequer for election advantage. Ministers cannot combine official visits with election work. Violating this can result in ECI action.",
  },
];

const MythBusterPage = () => {
  const [expanded, setExpanded] = useState({});

  const toggle = (i) => {
    setExpanded(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🔍 Election Myth Buster</h1>
      <p className="page-subtitle">
        Misinformation weakens democracy. Click on any myth below to see the factual truth 
        backed by ECI rules and Indian law.
      </p>

      <div className="myths-grid">
        {MYTHS.map((item, i) => (
          <div
            key={i}
            className={`glass-card myth-card ${expanded[i] ? 'expanded' : ''}`}
            onClick={() => toggle(i)}
          >
            <span className="myth-label">Myth</span>
            <h3>"{item.myth}"</h3>
            {!expanded[i] && <p className="click-hint">Click to reveal the truth →</p>}
            <div className="myth-truth">
              <strong style={{ color: 'var(--green)', display: 'block', marginBottom: '8px' }}>✅ The Truth:</strong>
              {item.truth}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MythBusterPage;
