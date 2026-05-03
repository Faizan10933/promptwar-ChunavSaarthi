import PropTypes from 'prop-types';

/**
 * Reusable Banner component for warnings, errors, or info.
 * @param {Object} props - Component props.
 * @param {string} props.message - Message to display.
 * @param {string} [props.type='warning'] - 'warning' or 'error'.
 * @returns {React.ReactElement} The banner.
 */
export const Banner = ({ message, type = 'warning' }) => (
  <div className={`api-banner ${type}`} role="alert">
    <span>{type === 'error' ? '⚠️' : 'ℹ️'}</span> {message}
  </div>
);

Banner.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['warning', 'error']),
};
