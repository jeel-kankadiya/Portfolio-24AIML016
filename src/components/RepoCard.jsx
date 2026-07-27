/* RepoCard.jsx – renders a single GitHub repository card */
const RepoCard = ({ repo }) => {
  const {
    name,
    description,
    html_url,
    stargazers_count,
    forks_count,
    language,
    topics = [],
  } = repo;

  return (
    <article className="project-card glass fade-in">
      <div className="repo-card-header">
        <h3 className="project-title">{name}</h3>
        <div className="repo-stats">
          {stargazers_count > 0 && (
            <span className="repo-stat" title="Stars">
              ⭐ {stargazers_count}
            </span>
          )}
          {forks_count > 0 && (
            <span className="repo-stat" title="Forks">
              🍴 {forks_count}
            </span>
          )}
        </div>
      </div>

      <p className="project-desc">
        {description || 'No description provided.'}
      </p>

      {topics.length > 0 && (
        <div className="project-tech">
          {topics.slice(0, 5).map((t) => (
            <span key={t} className="tech-tag">
              {t}
            </span>
          ))}
        </div>
      )}

      {language && (
        <span className="repo-lang">
          <span className="lang-dot" />
          {language}
        </span>
      )}

      <a
        href={html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn project-btn"
      >
        GitHub →
      </a>
    </article>
  );
};

export default RepoCard;
