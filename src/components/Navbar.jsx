import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ dark, toggleTheme, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Tasks', to: '/tasks' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        &lt;JK /&gt;
      </NavLink>

      {/* Hamburger toggle */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
        {navItems.map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}

        {/* Auth links in mobile menu */}
        {!loggedIn && (
          <>
            <li className="nav-auth-mobile">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
            </li>
            <li className="nav-auth-mobile">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
                onClick={() => setMenuOpen(false)}
              >
                Register
              </NavLink>
            </li>
          </>
        )}
        {loggedIn && (
          <li className="nav-auth-mobile">
            <button className="nav-link nav-logout-mobile" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>

      <div className="nav-right">
        {/* Auth buttons for desktop */}
        {!loggedIn && (
          <div className="nav-auth-desktop">
            <NavLink to="/login" className="nav-auth-link" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
            <NavLink to="/register" className="nav-auth-btn" onClick={() => setMenuOpen(false)}>
              Register
            </NavLink>
          </div>
        )}
        {loggedIn && (
          <button className="nav-auth-btn nav-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

        <a
          href="https://github.com/jeel-kankadiya"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-github"
          title="GitHub Profile"
          aria-label="GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <ThemeToggle dark={dark} toggle={toggleTheme} />
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
