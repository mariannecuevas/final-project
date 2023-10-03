import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');

  const search = () => {
    if (searchInput) {
      onSearch(searchInput);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search for Artist"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="btn btn-primary" type="button" onClick={search}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
