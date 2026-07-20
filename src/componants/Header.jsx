import './Header.css';

function Header({ name, title, navLinks }) {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-text">{name || 'Portfolio'}</span>
      </div>

      <nav className="header-nav">
        <ul className="nav-list">
          {navLinks && navLinks.map((link, index) => (
            <li key={index} className="nav-item">
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-cta">
        <a href="#contact" className="btn-contact">Contact Me</a>
      </div>
    </header>
  );
}

export default Header;
