/**
 * @fileoverview React Error Boundary component.
 * Catches JavaScript errors in the component tree below it and displays
 * a fallback UI instead of crashing the entire application.
 * @module components/ErrorBoundary
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary component that prevents the entire app from crashing
 * when a child component throws an error during rendering.
 *
 * @extends Component
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Derives error state from thrown errors.
   * @param {Error} error - The thrown error.
   * @returns {{ hasError: boolean, error: Error }} Updated state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs error details to the console for debugging.
   * In production, this could be extended to report to an error tracking service.
   * @param {Error} error - The thrown error.
   * @param {Object} errorInfo - React component stack trace information.
   */
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  /**
   * Resets the error state to allow the user to retry.
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-primary)',
          }}
        >
          <h2 style={{ marginBottom: '16px', color: 'var(--saffron)' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="btn-primary" onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render. If any throw an error, the fallback UI is shown. */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
