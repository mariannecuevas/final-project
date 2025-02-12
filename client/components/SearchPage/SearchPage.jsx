import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';
import './Modal.css';
import ReviewModal from '../Modal';

function SearchPage({ accessToken }) {
  const [albums, setAlbums] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (searchInput && accessToken) {
      fetch(`/api/search/${searchInput}`, {
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

  const handleAlbumSelection = (album) => {
    setSelectedAlbum(album);
    setShowModal(true);
    setRating('');
    setComment('');
    console.log(album);
  };

  const handleSubmit = async (reviewData) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container" style={{ marginTop: '10vh' }}>
      <div className="row">
        <div className="col">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <AlbumList albums={albums} onAlbumSelect={handleAlbumSelection} />
        </div>
      </div>
      {showModal && selectedAlbum && (
        <ReviewModal
          selectedAlbum={selectedAlbum}
          handleCloseModal={() => setShowModal(false)}
          rating={rating}
          setRating={setRating}
          comment={comment}
          modalTitle="Review an Album"
          setComment={setComment}
          isEditMode={false}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default SearchPage;
