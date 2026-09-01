import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from './api';

import Navbar   from './components/Navbar';
import Footer   from './components/Footer';

import Home     from './pages/Home';
import Projects from './pages/Projects';
import Tasks    from './pages/Tasks';
import Contact  from './pages/Contact';
import NotFound from './pages/NotFound';
import Login    from './pages/Login';
import Register from './pages/Register';

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

      <Footer />
    </div>
  );
}

export default App;
