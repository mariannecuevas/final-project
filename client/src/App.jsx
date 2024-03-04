import React, { useState, useEffect } from 'react';
import SearchPage from '../components/SearchPage/SearchPage';
import './App.css';
import '../components/AppDrawer.css';
import AppDrawer from '../components/AppDrawer';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AlbumReviews from '../components/AlbumReviewsPage';
import BookmarksPage from '../components/BookmarksPage';
import SignIn from '../components/Register';

export default function App() {
  const [accessToken, setAccessToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const menuItems = [
    { id: 1, title: 'Home', path: '/' },
    { id: 2, title: 'Reviews', path: '/albumreviews' },
    { id: 3, title: 'Bookmarks', path: '/bookmarks' },
    { id: 4, title: 'Testing', path: '/test' },
    { id: 5, title: 'Sign Out', path: '/sign-out' },
  ];

  const menuHeading = 'Menu';

  function handleToggle() {
    setIsOpen(!isOpen);
  }
  const navigate = useNavigate();

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

  const handleSignIn = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <div className={`App ${isOpen ? 'open' : ''}`}>
        <AppDrawer
          isOpen={isOpen}
          menuHeading={menuHeading}
          menuItems={menuItems}
          handleToggle={handleToggle}
          onSignOut={handleSignOut}
        />
        {isOpen && <div className="shade" onClick={handleToggle} />}

        <div>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <SearchPage accessToken={accessToken} />
                ) : (
                  <SignIn onSignIn={handleSignIn} />
                )
              }
            />
            <Route path="/albumreviews" element={<AlbumReviews />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/test" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
