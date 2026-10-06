import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from './api';

import Navbar   from './components/Navbar';
import Footer   from './components/Footer';

// ==========================================
// PRACTICAL 8 — Lazy Loading with React.lazy()
// ==========================================
// Route-based code splitting: each page component
// is loaded as a separate chunk only when needed.
// This reduces the initial bundle size significantly.

const Home     = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Tasks    = lazy(() => import('./pages/Tasks'));
const Contact  = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login    = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

/* ==========================================
   Loading Fallback Component
   ==========================================
   Shown while a lazy-loaded chunk is being
   downloaded. Uses a premium animated design
   so the user sees a polished UI even on
   slow connections (test with Slow 3G throttle).
   ========================================== */

const LoadingFallback = () => (
  <div className="lazy-loading-fallback" role="status" aria-label="Loading page content">
    <div className="lazy-loading-inner">
      <div className="lazy-spinner">
        <div className="lazy-spinner-ring"></div>
        <div className="lazy-spinner-ring"></div>
        <div className="lazy-spinner-ring"></div>
      </div>
      <p className="lazy-loading-text">
        Loading
        <span className="lazy-dot lazy-dot-1">.</span>
        <span className="lazy-dot lazy-dot-2">.</span>
        <span className="lazy-dot lazy-dot-3">.</span>
      </p>
    </div>
  </div>
);

/* Protected Route — redirects to /login if not authenticated */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [dark, setDark] = useState(false);
  const [, setAuthState] = useState(false); // triggers re-render on login/logout

  const toggleTheme = () => setDark((d) => !d);

  const handleLogin = () => setAuthState((s) => !s);

  const handleLogout = () => {
    logout();
    setAuthState((s) => !s);
  };

  return (
    <div data-theme={dark ? 'dark' : 'light'}>
      {/* Decorative background blobs */}
      <div className="blob-bg" aria-hidden="true">
        <span /><span /><span />
      </div>

      <Navbar dark={dark} toggleTheme={toggleTheme} onLogout={handleLogout} />

      {/* ==========================================
          PRACTICAL 8 — Suspense wrapper
          ==========================================
          Wraps the Routes block so that any lazy-loaded
          route component shows the fallback UI while
          its chunk is downloading. */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks"    element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"         element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
