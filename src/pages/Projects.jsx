import { useState, useEffect } from 'react';
import './Projects.css';

import Spinner      from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar    from '../components/SearchBar';
import RepoList     from '../components/RepoList';

/* ── Static fallback shown when the GitHub API is unavailable ── */
const FALLBACK = [
  {
    id: 1,
    name: 'Student Portfolio',
    description:
      'A responsive multi-page React portfolio with dark/light mode, React Router navigation, and reusable component architecture.',
    html_url: 'https://github.com/jeel-kankadiya',
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['react', 'vite', 'css'],
  },
  {
    id: 2,
    name: 'Todo App',
    description:
      'A task-management web app built with React Hooks. Supports add, complete, delete, and filter operations with localStorage persistence.',
    html_url: 'https://github.com/jeel-kankadiya',
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['react', 'hooks', 'localstorage'],
  },
  {
    id: 3,
    name: 'Weather Dashboard',
    description:
      'Fetches live weather data from OpenWeatherMap API and displays temperature, humidity, and a 5-day forecast.',
    html_url: 'https://github.com/jeel-kankadiya',
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: ['api', 'css-grid', 'openweathermap'],
  },
];

/* ── Replace with your GitHub username to load live repos ── */
const GITHUB_USERNAME = 'jeel-kankadiya';

const Projects = () => {
  const [repos,   setRepos]   = useState(FALLBACK);
  const [loading, setLoading] = useState(true);   // show spinner immediately
  const [error,   setError]   = useState(null);
  const [query,   setQuery]   = useState('');

  useEffect(() => {
    if (!GITHUB_USERNAME) return;   // fallback already in state

    const controller = new AbortController();

    /* Reject after 8 s so the spinner never hangs forever */
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 8000)
    );

    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await Promise.race([
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
            {
              signal: controller.signal,
              headers: {
                'Accept': 'application/vnd.github.mercy-preview+json',
              },
            }
          ),
          timeout,
        ]);

        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

        const data = await res.json();
        const owned = data.filter((r) => !r.fork);
        setRepos(owned.length ? owned : FALLBACK);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setRepos(FALLBACK);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
    return () => controller.abort();
  }, []);

  /* ── Client-side filtering ── */
  const filtered = repos.filter(({ name, description, topics = [], language }) => {
    const q = query.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      (description && description.toLowerCase().includes(q)) ||
      topics.some((t) => t.toLowerCase().includes(q)) ||
      (language && language.toLowerCase().includes(q))
    );
  });

  return (
    <main className="page fade-in">
      <h1 className="section-title">Projects</h1>

      <SearchBar value={query} onChange={setQuery} />

      {loading && <Spinner />}

      {!loading && error && <ErrorMessage message={error} />}

      {!loading && <RepoList repos={filtered} />}
    </main>
  );
};

export default Projects;
