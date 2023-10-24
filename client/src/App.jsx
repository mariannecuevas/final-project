import React, { useState, useEffect } from 'react';
import SearchPage from '../components/SearchPage/SearchPage';
import './App.css';
import '../components/AppDrawer.css';
import AppDrawer from '../components/AppDrawer';

export default function App() {
  const [accessToken, setAccessToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, title: 'Home' },
    { id: 2, title: 'Reviews' },
  ];

  const menuHeading = 'Menu';

  function handleToggle() {
    setIsOpen(!isOpen);
  }

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
      <div className={`App ${isOpen ? 'open' : ''}`}>
        <AppDrawer
          isOpen={isOpen}
          menuHeading={menuHeading}
          menuItems={menuItems}
          handleToggle={handleToggle}
        />
        {isOpen && <div className="shade" onClick={handleToggle} />}
      </div>
      <div>
        <SearchPage accessToken={accessToken} />
      </div>
    </>
  );
}
