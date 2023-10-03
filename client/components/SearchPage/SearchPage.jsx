import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';

function SearchPage({ accessToken }) {
  const [albums, setAlbums] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (searchInput && accessToken) {
      fetch(`http://localhost:8080/search/${searchInput}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch albums');
          }
          return response.json();
        })
        .then((data) => {
          setAlbums(data.albums);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [searchInput, accessToken]);

  const handleSearch = (searchInput) => {
    setSearchInput(searchInput);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <SearchBar onSearch={handleSearch} />
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
