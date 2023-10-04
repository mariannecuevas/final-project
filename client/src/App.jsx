import React, { useState, useEffect } from 'react';
import SearchPage from '../components/SearchPage/SearchPage';
import './App.css';

export default function App() {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    fetch('http://localhost:5173/api/spotify/token')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        return response.json();
      })
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);
  return (
    <>
      <div>
        <SearchPage accessToken={accessToken} />
      </div>
    </>
  );
}
