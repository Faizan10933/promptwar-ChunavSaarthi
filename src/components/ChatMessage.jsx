import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a single chat bubble for either user or assistant.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.message - Message object with role and text.
 * @param {boolean} [props.isLoading=false] - Whether this is a loading placeholder.
 * @param {boolean} [props.showFeedback=false] - Whether to show feedback buttons.
 * @param {Function} [props.onFeedback] - Callback for feedback (thumbs up/down).
 * @returns {React.ReactElement} The chat message bubble.
 */
const ChatMessage = memo(({ message, isLoading = false, showFeedback = false, onFeedback }) => {
  if (isLoading) {
    return (
      <div
        className="chat-bubble assistant"
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span className="spinner" aria-hidden="true" /> Saarthi is thinking...
      </div>
    );
  }

  const { role, text, feedbackGiven } = message;

  return (
    <div
      className={`chat-message-container ${role}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: role === 'user' ? 'flex-end' : 'flex-start',
        width: '100%',
      }}
    >
      <div className={`chat-bubble ${role}`}>{text}</div>
      {role === 'assistant' && showFeedback && !text.includes('⚠️ Error') && (
        <div className="chat-feedback-actions">
          {!feedbackGiven ? (
            <>
              <span className="feedback-label">Was this helpful?</span>
              <button
                onClick={() => onFeedback(true)}
                className="feedback-btn"
                type="button"
                aria-label="Helpful"
              >
                👍
              </button>
              <button
                onClick={() => onFeedback(false)}
                className="feedback-btn"
                type="button"
                aria-label="Not helpful"
              >
                👎
              </button>
            </>
          ) : (
            <span className="feedback-thanks">Thanks for the feedback!</span>
          )}
        </div>
      )}
    </div>
  );
});

ChatMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    feedbackGiven: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
  showFeedback: PropTypes.bool,
  onFeedback: PropTypes.func,
};

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
