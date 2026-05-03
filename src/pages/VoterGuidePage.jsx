/**
 * @fileoverview Dedicated page for the interactive Voter Guide and Election Timeline.
 * Addresses the "timelines and steps" requirement of the problem statement.
 * @module pages/VoterGuidePage
 */

import { useMemo } from 'react';
import { usePageView } from '../hooks/usePageView';
import { ELECTION_TIMELINE, VOTER_STEPS } from '../constants';
import { Link } from 'react-router-dom';
import { VoterJourney } from '../components/home/VoterJourney';
import { TimelineSection } from '../components/home/TimelineSection';

import { PageHeader } from '../components/PageHeader';

/**
 * Page component that provides a step-by-step guide and chronological timeline
 * of the Indian election process.
 * @returns {React.ReactElement} The Voter Guide page.
 */
const VoterGuidePage = () => {
  usePageView('Voter Guide');

  const steps = useMemo(() => VOTER_STEPS, []);
  const timeline = useMemo(() => ELECTION_TIMELINE, []);

  return (
    <div className="page-container">
      <PageHeader 
        title="Complete Voter Guide" 
        subtitle="Everything you need to know about timelines, registration, and the voting process in India." 
        icon="🗺️" 
      />

      <VoterJourney steps={steps} />

      <TimelineSection timeline={timeline} />

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
