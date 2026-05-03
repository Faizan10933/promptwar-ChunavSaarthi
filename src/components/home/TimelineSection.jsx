import PropTypes from 'prop-types';

/**
 * Election Process Timeline component for the homepage.
 * @param {Object} props - Component props.
 * @param {Array} props.timeline - Array of timeline phases.
 * @returns {React.ReactElement} The timeline section.
 */
export const TimelineSection = ({ timeline }) => (
  <section className="timeline-section" aria-labelledby="timeline-title">
    <div className="section-header">
      <h2 id="timeline-title">Election Process Timeline</h2>
      <p>From announcement to results: The 7-step ECI procedure</p>
    </div>

    <div className="timeline-container">
      {timeline.map((t, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-dot" aria-hidden="true" />
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
  </section>
);

TimelineSection.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      phase: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};
