/**
 * @fileoverview Main App component and layout structure.
 * Sets up React Router and the sidebar navigation layout.
 * @module App
 */

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AskSaarthiPage from './pages/AskSaarthiPage';
import MCCCheckerPage from './pages/MCCCheckerPage';
import MythBusterPage from './pages/MythBusterPage';
import EVMSimulatorPage from './pages/EVMSimulatorPage';
import ErrorBoundary from './components/ErrorBoundary';
import { NAV_ITEMS } from './constants';

/**
 * Main application layout component containing the sidebar and content area.
 * @returns {React.ReactElement} The layout wrapper.
 */
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
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div
          style={{
            marginTop: 'auto',
            padding: '16px',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
          }}
        >
          <strong style={{ color: 'var(--saffron)' }}>Powered by</strong>
          <br />
          Google Gemini AI
        </div>
      </aside>

      <main className="main-area" id="main-content" role="main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ask" element={<AskSaarthiPage />} />
            <Route path="/mcc" element={<MCCCheckerPage />} />
            <Route path="/myths" element={<MythBusterPage />} />
            <Route path="/evm" element={<EVMSimulatorPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

/**
 * Root application component that initializes routing.
 * @returns {React.ReactElement} The React app.
 */
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
