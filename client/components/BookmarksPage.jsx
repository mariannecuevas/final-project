import React, { useState, useEffect } from 'react';
import './BookmarksPage.css';

function BookmarksPage() {
  const [bookmarkedAlbums, setBookmarkedAlbums] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('http://localhost:8080/bookmarks');
      const data = await response.json();
      setBookmarkedAlbums(data);
    } catch (error) {
      console.error('Error fetching bookmarked albums:', error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (album) => {
    try {
      const isBookmarked = bookmarkedAlbums.some(
        (a) => a.albumName === album.albumName
      );

      if (isBookmarked) {
        setSelectedBookmark(album);
        setShowDeleteModal(true);
      } else {
        await fetch('http://localhost:8080/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            albumName: album.albumName,
            artist: album.artist,
            albumImg: album.albumImg,
          }),
        });

        fetchBookmarks();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedBookmark) {
        await fetch(
          `http://localhost:8080/bookmarks/${selectedBookmark.bookmarkId}`,
          {
            method: 'DELETE',
          }
        );

        const updatedAlbums = bookmarkedAlbums.filter(
          (a) => a.albumName !== selectedBookmark.albumName
        );
        setBookmarkedAlbums(updatedAlbums);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bookmarks-container">
      <h3>Bookmarked Albums</h3>
      {bookmarkedAlbums.length > 0 ? (
        <div className="row">
          {bookmarkedAlbums.map((album) => (
            <div
              key={album.bookmarkId}
              className="col-12 col-md-3 mb-4 album-card">
              <div className="card">
                <img
                  src={album.albumImg}
                  className="card-img-top"
                  alt={`Cover for ${album.albumName}`}
                />
                <div className="card-body">
                  <h5
                    className="card-title text-left"
                    style={{ fontWeight: 'bold' }}>
                    {album.albumName}
                  </h5>
                  <p className="card-text text-left">{album.artist}</p>
                  <i
                    className="fas fa-bookmark"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      margin: '8px',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleBookmark(album)}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookmarked albums found.</p>
      )}

      {showDeleteModal && (
        <div className="delete-modal">
          <p>Are you sure you want to remove this bookmark?</p>
          <button className="delete-btn" onClick={handleDeleteConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={handleDeleteCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;
