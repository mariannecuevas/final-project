import React, { useState, useEffect } from 'react';

function AlbumList({ albums, onAlbumSelect }) {
  const [bookmarkedAlbums, setBookmarkedAlbums] = useState([]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }

      const data = await response.json();
      setBookmarkedAlbums(data);
    } catch (error) {
      console.error('Error fetching bookmarked albums:', error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (album, event) => {
    event.stopPropagation();

    try {
      const isBookmarked = bookmarkedAlbums.some(
        (a) => a.albumName === album.name
      );

      if (isBookmarked) {
        const albumsWithSameName = bookmarkedAlbums.filter(
          (a) => a.albumName === album.name
        );

        await Promise.all(
          albumsWithSameName.map(async (bookmarkedAlbum) => {
            await fetch(
              `/api/bookmarks/${bookmarkedAlbum.bookmarkId}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
              }
            );
          })
        );

        const updatedAlbums = bookmarkedAlbums.filter(
          (a) => a.albumName !== album.name
        );
        setBookmarkedAlbums(updatedAlbums);
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            albumName: album.name,
            artist: album.artists[0].name,
            albumImg: album.images[0].url,
          }),
        });

        fetchBookmarks();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleSelectedAlbum = (album) => {
    onAlbumSelect(album);
  };

  return (
    <div className="albums-container">
      <div className="row">
        <div className="col d-flex flex-wrap">
          {albums.map((album) => (
            <div className="col-12 col-md-3 mb-4 album-card" key={album.id}>
              <div
                className="card"
                style={{
                  margin: '0',
                  padding: '0',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectedAlbum(album)}>
                <img
                  src={album.images[0].url}
                  className="card-img-top"
                  alt={`Cover for ${album.name}`}
                />
                <div className="card-body">
                  <h5
                    className="card-title text-left"
                    style={{ fontWeight: 'bold' }}>
                    {album.name}
                  </h5>
                  <p className="card-text text-left">{album.artists[0].name}</p>
                  <i
                    className={`fa-regular fa-bookmark ${
                      bookmarkedAlbums.some((a) => a.albumName === album.name)
                        ? 'fas fa-solid'
                        : ''
                    }`}
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      margin: '8px',
                      fontSize: '1.5rem',
                    }}
                    onClick={(event) => toggleBookmark(album, event)}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlbumList;
