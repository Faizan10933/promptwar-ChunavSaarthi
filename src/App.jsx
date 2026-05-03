/**
 * @fileoverview Main App component and layout structure.
 * Sets up React Router and the sidebar navigation layout.
 * @module App
 */

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { NAV_ITEMS } from './constants';

// Lazy loaded page components for optimal code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const AskSaarthiPage = lazy(() => import('./pages/AskSaarthiPage'));
const MCCCheckerPage = lazy(() => import('./pages/MCCCheckerPage'));
const MythBusterPage = lazy(() => import('./pages/MythBusterPage'));
const EVMSimulatorPage = lazy(() => import('./pages/EVMSimulatorPage'));
const BoothLocatorPage = lazy(() => import('./pages/BoothLocatorPage'));

/**
 * Fallback UI shown while a lazy-loaded chunk is being downloaded.
 * @returns {React.ReactElement} Loading spinner component.
 */
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
    <div style={{ color: 'var(--text-secondary)' }}>Loading Saarthi...</div>
  </div>
);

import { initGoogleTranslate } from './lib/translate';

/**
 * Main application layout component containing the sidebar and content area.
 * @returns {React.ReactElement} The layout wrapper.
 */
function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    initGoogleTranslate();
  }, []);

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-title">Chunav Saarthi</div>
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
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
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
          <div id="google_translate_element" style={{ marginBottom: '12px' }}></div>
          <strong style={{ color: 'var(--saffron)' }}>Powered by</strong>
          <br />
          Google Gemini AI
        </div>
      </aside>

      <main className="main-area" id="main-content" role="main">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ask" element={<AskSaarthiPage />} />
              <Route path="/mcc" element={<MCCCheckerPage />} />
              <Route path="/myths" element={<MythBusterPage />} />
              <Route path="/evm" element={<EVMSimulatorPage />} />
              <Route path="/booths" element={<BoothLocatorPage />} />
            </Routes>
          </Suspense>
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
