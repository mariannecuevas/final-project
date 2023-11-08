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

  const handleAlbumSelection = (album) => {
    setSelectedAlbum(album);
    setShowModal(true);
    setRating('');
    setComment('');
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmitRating = async (event) => {
    event.preventDefault();
    if (!rating || !comment) {
      return;
    }

    const reviewData = {
      albumName: selectedAlbum.name,
      artist: selectedAlbum.artists[0].name,
      albumImg: selectedAlbum.images[1].url,
      rating,
      comment,
    };

    try {
      const response = await fetch('http://localhost:8080/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      console.log(data);
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRating('');
    setComment('');
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
      <ReviewModal
        selectedAlbum={selectedAlbum}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        rating={rating}
        handleRatingChange={handleRatingChange}
        comment={comment}
        setComment={setComment}
        handleSubmitRating={handleSubmitRating}
      />
    </div>
  );
}

export default SearchPage;
