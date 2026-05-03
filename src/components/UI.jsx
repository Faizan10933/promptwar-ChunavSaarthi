import PropTypes from 'prop-types';

/**
 * Reusable Glass Card component.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Card content.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {React.ReactElement} The card.
 */
export const Card = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Reusable Spinner component.
 * @param {Object} props - Component props.
 * @param {string} [props.size='sm'] - 'sm' or 'md'.
 * @returns {React.ReactElement} The spinner.
 */
export const Spinner = ({ size = 'sm' }) => (
  <span className={`spinner ${size}`} aria-hidden="true" />
);

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
};

/**
 * Reusable Badge component.
 * @param {Object} props - Component props.
 * @param {string} props.text - Badge text.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {React.ReactElement} The badge.
 */
export const Badge = ({ text, className = '' }) => (
  <span className={`badge ${className}`}>{text}</span>
);

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};
