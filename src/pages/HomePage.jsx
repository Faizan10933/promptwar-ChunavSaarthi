/**
 * @fileoverview Landing page component for the Chunav Saarthi app.
 * Provides navigation to core features and displays key election statistics.
 * @module pages/HomePage
 */

import { ELECTION_STATS, ELECTION_TIMELINE, VOTER_STEPS } from '../constants';
import { HeroSection } from '../components/home/HeroSection';
import { VoterJourney } from '../components/home/VoterJourney';
import { TimelineSection } from '../components/home/TimelineSection';
import { FeaturesGrid } from '../components/home/FeaturesGrid';

/**
 * The homepage/dashboard component.
 * Orchestrates the landing page layout using modular sub-components.
 * @returns {React.ReactElement} The rendered homepage.
 */
const HomePage = () => {
  return (
    <div className="home-page-container">
      <HeroSection 
        title="Understand India&apos;s<br /><span className='highlight'>Election Process</span>" 
        subtitle="From voter registration to casting your vote — Saarthi AI answers every question about Indian democracy." 
      />

      <div className="stats-row" aria-label="Key Election Statistics">
        {ELECTION_STATS.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-number">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <VoterJourney steps={VOTER_STEPS} />
      
      <TimelineSection timeline={ELECTION_TIMELINE} />

      <FeaturesGrid />
    </div>
  );
};

export default HomePage;
