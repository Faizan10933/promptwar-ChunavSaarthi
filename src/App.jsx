import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AskSaarthiPage from './pages/AskSaarthiPage';
import MCCCheckerPage from './pages/MCCCheckerPage';
import MythBusterPage from './pages/MythBusterPage';
import EVMSimulatorPage from './pages/EVMSimulatorPage';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/ask', icon: '🤖', label: 'Ask Saarthi AI' },
  { path: '/mcc', icon: '⚖️', label: 'MCC Checker' },
  { path: '/myths', icon: '🔍', label: 'Myth Buster' },
  { path: '/evm', icon: '🗳️', label: 'EVM Simulator' },
];

function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Chunav Saarthi</h1>
          <p>AI Election Guide</p>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{
          marginTop: 'auto',
          padding: '16px',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
        }}>
          <strong style={{ color: 'var(--saffron)' }}>Powered by</strong><br />
          Google Gemini AI
        </div>
      </aside>

      <main className="main-area">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ask" element={<AskSaarthiPage />} />
          <Route path="/mcc" element={<MCCCheckerPage />} />
          <Route path="/myths" element={<MythBusterPage />} />
          <Route path="/evm" element={<EVMSimulatorPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
