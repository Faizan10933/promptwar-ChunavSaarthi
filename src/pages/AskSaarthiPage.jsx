/**
 * @fileoverview AI chat interface for asking election-related questions.
 * Handles state for conversation history, loading status, and API key presence.
 * @module pages/AskSaarthiPage
 */

import React, { useState, useRef, useEffect } from 'react';
import { chatWithSaarthi, isAPIKeyConfigured } from '../lib/gemini';
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

    try {
      const history = messages.filter((m) => m.role !== 'system');
      const reply = await chatWithSaarthi(msg, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('quota');
      const errorMessage = isQuota
        ? '⚠️ API quota exhausted for this key. To fix:\\n\\n1. Go to https://aistudio.google.com/apikey\\n2. Create a new API key\\n3. Update your .env file\\n4. Restart the dev server'
        : `⚠️ Error: ${err.message}`;

      setMessages((prev) => [...prev, { role: 'assistant', text: errorMessage }]);
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
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.text}
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
        <input
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
