import './Projects.css';

const projectData = [
  {
    id: 1,
    title: 'Student Portfolio',
    description:
      'A responsive multi-page React portfolio with dark/light mode, React Router navigation, and reusable component architecture.',
    tech: ['React', 'Vite', 'React Router', 'CSS'],
    github: 'https://github.com/',
  },
  {
    id: 2,
    title: 'Todo App',
    description:
      'A task-management web app built with React Hooks (useState, useEffect). Supports add, complete, delete, and filter operations.',
    tech: ['React', 'useState', 'localStorage'],
    github: 'https://github.com/',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description:
      'Fetches live weather data from OpenWeatherMap API and displays temperature, humidity, and a 5-day forecast with charts.',
    tech: ['JavaScript', 'REST API', 'CSS Grid'],
    github: 'https://github.com/',
  },
];

const Projects = () => (
  <main className="page fade-in">
    <h1 className="section-title">Projects</h1>
    <div className="projects-grid">
      {projectData.map((p) => (
        <div key={p.id} className="project-card glass">
          <h3 className="project-title">{p.title}</h3>
          <p className="project-desc">{p.description}</p>
          <div className="project-tech">
            {p.tech.map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn project-btn"
          >
            GitHub →
          </a>
        </div>
      ))}
    </div>
  </main>
);

export default Projects;
