import './Header.css';

const Header = ({ name, role, children }) => (
  <header className="header fade-in">
    <div className="header-avatar">{name.charAt(0)}</div>
    <h1 className="header-name">{name}</h1>
    <p className="header-role">{role}</p>
    {children}
  </header>
);

export default Header;
