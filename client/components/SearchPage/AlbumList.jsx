import React from 'react';
import './AlbumList.css';

function AlbumList() {
  const albums = [
    {
      id: 1,
      albumName: 'Album 1',
      artist: 'Artist 1',
      coverUrl: '../public/images/bb2.png',
    },
    {
      id: 2,
      albumName: 'Album 2',
      artist: 'Artist 2',
      coverUrl: '../public/images/bb2.png',
    },
    {
      id: 3,
      albumName: 'Album 3',
      artist: 'Artist 3',
      coverUrl: '../public/images/bb2.png',
    },
    {
      id: 4,
      albumName: 'Album 4',
      artist: 'Artist 4',
      coverUrl: '../public/images/bb2.png',
    },
  ];

  return (
    <div className="row row-cols-1 row-cols-md-3">
      {albums.map((album) => (
        <div className="col mb-4" key={album.id}>
          <div className="card">
            <img
              src={album.coverUrl}
              className="card-img-top"
              alt={`Cover for ${album.albumName}`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <div className="card-body">
              <h5 className="card-title text-left">{album.albumName}</h5>
              <p className="card-text text-left">{album.artist}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlbumList;
