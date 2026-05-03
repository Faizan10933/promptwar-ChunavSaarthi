import PropTypes from 'prop-types';

/**
 * Reusable Page Header component.
 * @param {Object} props - Component props.
 * @param {string} props.title - Title text.
 * @param {string} props.subtitle - Subtitle text.
 * @param {string} props.icon - Emoji or icon string.
 * @returns {React.ReactElement} The page header.
 */
export const PageHeader = ({ title, subtitle, icon }) => (
  <header className="section-header">
    <h1 className="page-title">
      <span aria-hidden="true">{icon}</span> {title}
    </h1>
    <p className="page-subtitle">{subtitle}</p>
  </header>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
