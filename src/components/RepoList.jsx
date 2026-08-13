/* RepoList.jsx – renders the grid of RepoCard components */
import RepoCard from './RepoCard';

const RepoList = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return (
      <p className="no-results">No repositories match your search.</p>
    );
  }

  return (
    <div className="projects-grid">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

export default RepoList;
