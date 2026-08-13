import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';

const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Git', 'Vite', 'REST APIs'];

const Home = () => (
  <div className="home-wrapper fade-in">
    <Header name="Jeel Kankadiya" role="B.Tech Student | Web Developer">
      <div className="header-actions">
        <Link to="/projects" className="btn">View Projects</Link>
        <Link to="/contact"  className="btn-outline">Contact Me</Link>
      </div>
    </Header>

    <main className="page">
      {/* Bio */}
      <section className="home-bio glass">
        <h2 className="section-title">About Me</h2>
        <p className="bio-text">
          Hi! I'm <strong>Jeel Kankadiya</strong>, a B.Tech student specialising in AI &amp; ML.
          I enjoy building clean, fast web applications and exploring the intersection of
          data science and modern frontend development. This portfolio demonstrates my skills
          in React, component architecture, and state management.
        </p>
      </section>

      {/* Skills */}
      <section className="skills-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {skills.map((s) => (
            <span key={s} className="skill-chip glass">{s}</span>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default Home;
