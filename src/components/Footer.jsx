import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>
      &copy; {new Date().getFullYear()}{' '}
      <strong>Jeel Kankadiya</strong>. All Rights Reserved. — Built with React &amp; Vite
    </p>
    <div className="footer-links">
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="mailto:jeelkankadiya567@gmail.com">Email</a>
    </div>
  </footer>
);

export default Footer;
