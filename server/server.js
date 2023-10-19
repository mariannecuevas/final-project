/* eslint-disable no-unused-vars  -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import cors from 'cors';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(cors());
// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Vite server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */

app.get('/api/spotify/token', async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );

  const authParams = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  };

  try {
    const response = await fetch(tokenEndpoint, authParams);

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();

    res.status(200).json({ access_token: data.access_token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/search/:searchInput', async (req, res) => {
  const { searchInput } = req.params;

  try {
    if (!searchInput) {
      throw new Error('Search input is empty');
    }

    const accessToken = await getAccessToken();
    const artistId = await getArtistId(searchInput, accessToken);
    const albums = await getArtistAlbums(artistId, accessToken);
    res.json({ albums });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function getAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const authParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  };

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    authParams
  );

  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function getArtistId(searchInput, accessToken) {
  const searchParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await fetch(
    'https://api.spotify.com/v1/search?q=' +
      encodeURIComponent(searchInput) +
      '&type=artist',
    searchParams
  );

  if (!response.ok) {
    throw new Error('Failed to fetch artist ID');
  }

  const data = await response.json();
  const artistID = data.artists.items[0].id;
  return artistID;
}

async function getArtistAlbums(artistId, accessToken) {
  const searchParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=50`,
    searchParams
  );

  if (!response.ok) {
    throw new Error('Failed to fetch artist albums');
  }

  const data = await response.json();
  return data.items;
}

app.get('/reviews', async (req, res) => {
  try {
    const sql = `
      SELECT *
        from "albumReviews"`;
    const result = await db.query(sql);
    const reviews = result.rows;
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const { albumName, artist, albumImg, rating, comment } = req.body;

    if (!rating || !comment) {
      throw new ClientError(400, 'Rating and comment are required fields');
    }

    const sql = `
      INSERT into "albumReviews" ("albumName", "artist", "albumImg", "rating", "comment")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const params = [albumName, artist, albumImg, rating, comment];
    const result = await db.query(sql, params);
    const review = result.rows[0];
    res.status(200).json(review);
  } catch (err) {
    console.error('Error:', err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Failed to post review' });
  }
});

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
