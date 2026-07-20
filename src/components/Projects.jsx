import './Projects.css';

const Projects = ({ projects }) => {
  return (
    <section className="projects section" id="projects">
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card card" key={project.title}>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((t) => (
                <span className="tech-tag" key={t}>{t}</span>
              ))}
            </div>
            <a
              className="github-btn"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
