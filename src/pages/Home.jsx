import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';

const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/190050247?v=4';
const GITHUB_API = 'https://api.github.com/users/jeel-kankadiya';

const skills = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js',
  'MongoDB', 'Python', 'Git', 'Vite', 'REST APIs', 'TensorFlow',
];

const Home = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(GITHUB_API, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setStats({
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
          });
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="home-wrapper fade-in">
      <Header
        name="Jeel Kankadiya"
        role="B.Tech Student | AI & ML | Full-Stack Developer"
        avatarUrl={GITHUB_AVATAR}
      >
        <div className="header-actions">
          <Link to="/projects" className="btn">View Projects</Link>
          <Link to="/contact"  className="btn-outline">Contact Me</Link>
        </div>
      </Header>

      <main className="page">
        {/* GitHub Stats */}
        {stats && (
          <section className="github-stats slide-up">
            <div className="stat-card glass">
              <span className="stat-number">{stats.repos}</span>
              <span className="stat-label">Public Repos</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-number">{stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-number">{stats.following}</span>
              <span className="stat-label">Following</span>
            </div>
          </section>
        )}

        {/* Bio */}
        <section className="home-bio glass slide-up">
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
            {skills.map((s, i) => (
              <span
                key={s}
                className="skill-chip glass fade-in stagger"
                style={{ '--i': i }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
