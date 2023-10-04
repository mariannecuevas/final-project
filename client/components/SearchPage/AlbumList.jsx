import React from 'react';

function AlbumList({ albums }) {
  return (
    <div className="row">
      <div className="col d-flex flex-wrap">
        {albums.map((album) => (
          <div className="col-12 col-md-4 mb-4 album-card" key={album.id}>
            <div
              className="card"
              style={{
                margin: '0',
                padding: '0',
                height: '100%',
              }}>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AlbumList;
