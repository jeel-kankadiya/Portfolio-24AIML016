import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ dark, toggleTheme }) => {
  const navItems = [
    { label: 'Home',     to: '/'         },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact',  to: '/contact'  },
  ];

  return (
    <nav className="navbar glass">
      <span className="navbar-brand">Jeel Kankadiya</span>

      <ul className="nav-links">
        {navItems.map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <ThemeToggle dark={dark} toggle={toggleTheme} />
    </nav>
  );
};

export default Navbar;
