/* SearchBar.jsx – controlled input for filtering repos */
const SearchBar = ({ value, onChange }) => (
  <div className="search-wrapper">
    <span className="search-icon">🔍</span>
    <input
      id="repo-search"
      type="search"
      className="search-input glass"
      placeholder="Search repositories…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search repositories"
      autoComplete="off"
      spellCheck="false"
    />
    {value && (
      <button
        className="search-clear"
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
  </div>
);

export default SearchBar;
