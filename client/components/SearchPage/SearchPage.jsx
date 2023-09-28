import React, { useState } from 'react';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';

function SearchPage() {
  const [albums, setAlbums] = useState([]);

  // Function to receive albums data from SearchBar component
  const handleAlbumsFetched = (fetchedAlbums) => {
    setAlbums(fetchedAlbums);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <SearchBar onAlbumsFetched={handleAlbumsFetched} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <AlbumList albums={albums} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
