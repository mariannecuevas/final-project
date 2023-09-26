import React from 'react';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';

function SearchPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <SearchBar />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <AlbumList />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
