import './ThemeToggle.css';

const ThemeToggle = ({ dark, toggle }) => (
  <button
    className={`theme-toggle ${dark ? 'dark' : ''}`}
    onClick={toggle}
    aria-label="Toggle dark/light mode"
    title={dark ? 'Switch to Light mode' : 'Switch to Dark mode'}
  >
    <span className="toggle-thumb" />
    <span className="toggle-icon">{dark ? '🌙' : '☀️'}</span>
  </button>
);

export default ThemeToggle;
