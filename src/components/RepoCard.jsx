/* RepoCard.jsx – renders a single GitHub repository card */

/* GitHub language → color mapping */
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Java:        '#b07219',
  'C++':       '#f34b7d',
  C:           '#555555',
  Shell:       '#89e051',
  Jupyter:     '#F37626',
  default:     '#8b5cf6',
};

/* Relative time helper */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days > 30)   return `${Math.floor(days / 30)}mo ago`;
  if (days > 0)    return `${days}d ago`;
  if (hours > 0)   return `${hours}h ago`;
  if (mins > 0)    return `${mins}m ago`;
  return 'just now';
};

const RepoCard = ({ repo, index = 0 }) => {
  const {
    name,
    description,
    html_url,
    stargazers_count,
    forks_count,
    language,
    topics = [],
    updated_at,
  } = repo;

  const langColor = LANG_COLORS[language] || LANG_COLORS.default;

  return (
    <article
      className="project-card glass fade-in stagger"
      style={{ '--i': index }}
    >
      {/* Gradient accent line at top */}
      <div className="card-accent" />

      <div className="repo-card-header">
        <div className="repo-title-group">
          <span className="repo-icon">📁</span>
          <h3 className="project-title">{name}</h3>
        </div>
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

      <div className="repo-card-footer">
        {language && (
          <span className="repo-lang">
            <span className="lang-dot" style={{ background: langColor }} />
            {language}
          </span>
        )}
        {updated_at && (
          <span className="repo-updated" title={new Date(updated_at).toLocaleDateString()}>
            🕐 {timeAgo(updated_at)}
          </span>
        )}
      </div>

      <a
        href={html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn project-btn"
      >
        View on GitHub →
      </a>
    </article>
  );
};

export default RepoCard;
