import { React, useState, useEffect } from 'react';

const CLIENT_ID = '603f9a323423429693895f78c5ae0958';
const CLIENT_SECRET = 'ca13fc111b2c446db308dcac752f4523';

function SearchBar({ onAlbumsFetched }) {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //API Access Token
    const authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        'grant_type=client_credentials&client_id=' +
        CLIENT_ID +
        '&client_secret=' +
        CLIENT_SECRET,
    };
    fetch('https://accounts.spotify.com/api/token', authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //search

  async function search() {
    console.log('Searching for ' + searchInput);

    //Get req using search to get the artist ID
    const searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };

    const artistId = await fetch(
      'https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    console.log('Artist ID is ' + artistId);
    //Get req with Artist ID, grab all the albums from that artist
    const returnedAlbums = await fetch(
      'https://api.spotify.com/v1/artists/' +
        artistId +
        '/albums' +
        '?include_groups=album&market=US&limit=50',
      searchParams
    ).then((response) => response.json());
    setAlbums(returnedAlbums.items);
    onAlbumsFetched(returnedAlbums.items);
  }

  console.log(albums);

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search for albums"
        onKeyPress={() => {
          if (event.key === 'Enter') {
            search();
          }
        }}
        onChange={(event) => setSearchInput(event.target.value)}
      />
      <button className="btn btn-primary" type="button" onClick={search}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
