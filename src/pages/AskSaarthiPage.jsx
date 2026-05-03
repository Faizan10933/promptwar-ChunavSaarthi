/**
 * @fileoverview AI chat interface for asking election-related questions.
 * Handles state for conversation history, loading status, and API key presence.
 * @module pages/AskSaarthiPage
 */

import React, { useState, useRef, useEffect } from 'react';
import { chatWithSaarthi, isAPIKeyConfigured } from '../lib/gemini';
import { logToFirestore, trackEvent } from '../lib/firebase';
import { CHAT_SUGGESTIONS } from '../constants';

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
  const messagesEndRef = useRef(null);
  const hasKey = isAPIKeyConfigured();

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page_title: 'Ask Saarthi' });
  }, []);

  /**
   * Logs user feedback to Google Firestore.
   */
  const handleFeedback = async (messageIndex, isHelpful) => {
    const msg = messages[messageIndex];
    if (msg.feedbackGiven) return;

    // Mark locally to prevent multiple votes
    setMessages(prev => {
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
  };

  /**
   * Handles sending a new message to the AI.
   * @param {string} [text] - Optional preset text to send instead of input state.
   */
  const handleSend = async (text) => {
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
        ? '⚠️ API quota exhausted for this key. To fix:\\n\\n1. Go to https://aistudio.google.com/apikey\\n2. Create a new API key\\n3. Update your .env file\\n4. Restart the dev server'
        : `⚠️ Error: ${err.message}`;

      setMessages((prev) => [...prev, { role: 'assistant', text: errorMessage }]);
      trackEvent('ask_saarthi_error', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission for the chat input.
   * @param {React.FormEvent} e - Form event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1><span aria-hidden="true">🤖</span> Ask Saarthi AI</h1>
        <p>Your AI-powered Indian Election expert • Powered by Google Gemini</p>
      </div>

      {!hasKey && (
        <div className="api-banner" role="alert" style={{ margin: '16px 32px 0' }}>
          ⚠️ Set your Gemini API key: Create a <code>.env</code> file with <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div className={`chat-bubble ${m.role}`}>
              {m.text}
            </div>
            {m.role === 'assistant' && i > 0 && !m.text.includes('⚠️ Error') && (
              <div style={{ marginTop: '6px', display: 'flex', gap: '8px', fontSize: '0.75rem', paddingLeft: '8px' }}>
                {!m.feedbackGiven ? (
                  <>
                    <span style={{ color: 'var(--text-muted)' }}>Was this helpful?</span>
                    <button onClick={() => handleFeedback(i, true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} type="button" aria-label="Helpful">👍</button>
                    <button onClick={() => handleFeedback(i, false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} type="button" aria-label="Not helpful">👎</button>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Thanks for the feedback!</span>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="spinner" aria-hidden="true" /> Saarthi is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="chat-suggestions" aria-label="Suggested questions">
          {CHAT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => handleSend(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">Ask Saarthi a question</label>
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
