import React, { useState, useRef, useEffect } from 'react';
import { chatWithSaarthi, isAPIKeyConfigured } from '../lib/gemini';

const SUGGESTIONS = [
  "How do I register for a Voter ID?",
  "What is NOTA and can it win?",
  "Explain EVM security features",
  "What is the Model Code of Conduct?",
  "Can NRIs vote in Indian elections?",
  "What happens on counting day?",
  "What is the cVIGIL app?",
  "Explain VVPAT and why it matters",
];

const AskSaarthiPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! 🙏 I am Saarthi, your AI guide to Indian elections. Ask me anything — from voter registration to EVM technology, from MCC rules to counting procedures. I\'m here to help!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const hasKey = isAPIKeyConfigured();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'system');
      const reply = await chatWithSaarthi(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      const isQuota = err.message?.includes('429') || err.message?.includes('quota');
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: isQuota
          ? '⚠️ API quota exhausted for this key. To fix:\n\n1. Go to https://aistudio.google.com/apikey\n2. Create a new API key (use a different Google Cloud project)\n3. Update your .env file with the new key\n4. Restart the dev server\n\nEach project gets its own free quota.'
          : `⚠️ Error: ${err.message}. Make sure your Gemini API key is set in the .env file as VITE_GEMINI_API_KEY.`
      }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>🤖 Ask Saarthi AI</h1>
        <p>Your AI-powered Indian Election expert • Powered by Google Gemini</p>
      </div>

      {!hasKey && (
        <div className="api-banner" style={{ margin: '16px 32px 0' }}>
          ⚠️ Set your Gemini API key: Create a <code>.env</code> file with <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="spinner"></span> Saarthi is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => handleSend(s)}>
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
        />
        <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AskSaarthiPage;
