import React from 'react';

function SearchBar() {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search for albums"
      />
      <button className="btn btn-primary" type="button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
