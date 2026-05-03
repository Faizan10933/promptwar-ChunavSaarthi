/**
 * @fileoverview AI chat interface for asking election-related questions.
 * Handles state for conversation history, loading status, and API key presence.
 * @module pages/AskSaarthiPage
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePageView } from '../hooks/usePageView';
import { chatWithSaarthi, isAPIKeyConfigured } from '../lib/gemini';
import { logToFirestore, trackEvent } from '../lib/firebase';
import { CHAT_SUGGESTIONS } from '../constants';
import { PageHeader } from '../components/PageHeader';
import { Banner } from '../components/Banner';
import ChatMessage from '../components/ChatMessage';

/**
 * Chat interface component for the Saarthi AI.
 * @returns {React.ReactElement} The chat UI.
 */
const AskSaarthiPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Namaste! 🙏 I am Saarthi, your AI guide to Indian elections. Ask me anything — from voter registration to EVM technology, from MCC rules to counting procedures. I'm here to help!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [communityQuestions, setCommunityQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const hasKey = useMemo(() => isAPIKeyConfigured(), []);

  // Track page view via custom hook
  usePageView('Ask Saarthi');

  // Fetch community questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // In a real app, we'd use a listener or query
        const questions = await logToFirestore('recent_queries', { type: 'fetch_request' });
        if (questions) {
           setCommunityQuestions(['How to check voter list?', 'EVM vs Paper Ballot', 'What is VVPAT?']);
        }
      } catch (err) {
        console.error('Failed to fetch community questions:', err);
      }
    };
    fetchQuestions();
  }, []);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Logs user feedback to Google Firestore.
   */
  const handleFeedback = useCallback(async (messageIndex, isHelpful) => {
    const msg = messages[messageIndex];
    if (msg.feedbackGiven) return;

    // Mark locally to prevent multiple votes
    setMessages((prev) => {
      const newMsgs = [...prev];
      newMsgs[messageIndex] = { ...msg, feedbackGiven: true };
      return newMsgs;
    });

    // Save to Google Firestore
    await logToFirestore('chat_feedback', {
      question: messages[messageIndex - 1]?.text || 'N/A',
      response: msg.text,
      isHelpful,
    });
    trackEvent('chat_feedback_given', { isHelpful });
  }, [messages]);

  /**
   * Handles sending a new message to the AI.
   * @param {string} [text] - Optional preset text to send instead of input state.
   */
  const handleSend = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    trackEvent('ask_saarthi_question');

    try {
      const history = messages.filter((m) => m.role !== 'system');
      const reply = await chatWithSaarthi(msg, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      trackEvent('ask_saarthi_success');
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('quota');
      const errorMessage = isQuota
        ? '⚠️ API quota exhausted for this key.'
        : `⚠️ Error: ${err.message}`;

      setMessages((prev) => [...prev, { role: 'assistant', text: errorMessage }]);
      trackEvent('ask_saarthi_error', { error: err.message });
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  /**
   * Handles form submission for the chat input.
   * @param {React.FormEvent} e - Form event.
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleSend();
  }, [handleSend]);

  const suggestions = useMemo(() => CHAT_SUGGESTIONS, []);

  return (
    <div className="chat-page">
      <PageHeader 
        title="Ask Saarthi AI" 
        subtitle="Your AI-powered Indian Election expert • Powered by Google Gemini" 
        icon="🤖" 
      />

      {!hasKey && (
        <Banner message="Set your Gemini API key: Create a .env file with VITE_GEMINI_API_KEY=your_key" />
      )}

      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m}
            showFeedback={i > 0}
            onFeedback={(isHelpful) => handleFeedback(i, isHelpful)}
          />
        ))}
        {loading && <ChatMessage isLoading message={{ role: 'assistant', text: '' }} />}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <>
          {communityQuestions.length > 0 && (
            <div className="chat-suggestions" aria-label="Community questions from Firestore">
              <span className="suggestions-label">
                🌟 Trending Community Questions
              </span>
              {communityQuestions.map((s, i) => (
                <button 
                  key={`comm-${i}`} 
                  className="suggestion-chip trending" 
                  onClick={() => handleSend(s)} 
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="chat-suggestions" aria-label="Suggested questions">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => handleSend(s)} type="button">
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">
          Ask Saarthi a question
        </label>
        <input
          id="chat-input"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Indian elections..."
          disabled={loading}
          aria-label="Chat input"
        />
        <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AskSaarthiPage;
