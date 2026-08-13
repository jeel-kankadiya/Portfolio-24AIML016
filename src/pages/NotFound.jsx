import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <main className="page not-found fade-in">
    <div className="nf-content glass">
      <div className="nf-code">404</div>
      <h1 className="nf-title">Page Not Found</h1>
      <p className="nf-text">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn">← Back to Home</Link>
    </div>
  </main>
);

export default NotFound;
