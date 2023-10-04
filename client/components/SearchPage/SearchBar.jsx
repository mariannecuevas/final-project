import React, { useState } from 'react';
import './SearchBar.css';

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
        className="form-control rounded-start"
        placeholder="Search for Artist"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="btn btn-primary rounded-end"
        type="button"
        onClick={search}>
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
}

export default SearchBar;
