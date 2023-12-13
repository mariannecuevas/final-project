import React, { useState } from 'react';

function AlbumList({ albums, onAlbumSelect }) {
  const [bookmarkedAlbums, setBookmarkedAlbums] = useState([]);

  const handleSelectedAlbum = (album) => {
    onAlbumSelect(album);
  };

  const toggleBookmark = async (album, event) => {
    event.stopPropagation();

    const isBookmarked = bookmarkedAlbums.includes(album);

    if (isBookmarked) {
      setBookmarkedAlbums(bookmarkedAlbums.filter((a) => a !== album));

      await fetch(`http://localhost:8080/bookmarks/${album.bookmarkId}`, {
        method: 'DELETE',
      });
    } else {
      setBookmarkedAlbums([...bookmarkedAlbums, album]);

      await fetch('http://localhost:8080/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumName: album.name,
          artist: album.artists[0].name,
          albumImg: album.images[0].url,
        }),
      });
    }
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
                      bookmarkedAlbums.includes(album) ? 'fas fa-solid' : ''
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
