import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>
      &copy; {new Date().getFullYear()}{' '}
      <strong>Jeel Kankadiya</strong> — Built with React &amp; Vite
    </p>
    <div className="footer-links">
      <a href="https://github.com/"   target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="mailto:jeel@example.com">Email</a>
    </div>
  </footer>
);

export default Footer;
