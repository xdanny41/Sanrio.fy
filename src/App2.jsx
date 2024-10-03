// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert, ListGroup } from 'react-bootstrap';

function App2() {
  const [character, setCharacter] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // State to store Spotify user profile
  const [error, setError] = useState(null);
  const client_id = 'fa7da4a9abb84378a9ed2f3db97da161'; //Spotify client ID
  const scopes = 'user-read-recently-played user-read-private user-read-email user-top-read';
  const redirect_uri = 'http://localhost:3000/callback'; // Replace with your redirect URI

  // Function to generate the login URL and redirect the user to Spotify's authorization page
  const loginWithSpotify = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const authUrl = `${authEndpoint}?response_type=token&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}`;
    window.location = authUrl;
  };

  // Extract access token from URL hash fragment
  const getAccessToken = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  };

  // Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserProfile(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch user profile.');
      console.error('Error fetching profile:', error);
    }
  };

  // Function to fetch Spotify user's top artists and their genres
  const fetchTopArtists = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTopArtists(response.data.items);
      setError(null);
    } catch (err) {
      setTopArtists([]);
      setError('Failed to fetch top artists from Spotify.');
      console.error('Error:', err);
    }
  };

  const getSanrioCharacter = (genres) => {
    const sanrioMapping = {
      'pop': 'Hello Kitty',
      'dance': 'Hello Kitty',
      'k-pop': 'Hello Kitty',
      'r&b': 'Cinnamoroll',
      'alternative': 'Keroppi',
      'contemporary ': 'My Melody',
      'indie ': 'My Melody',
      'hip hop': 'Badtz-Maru',
      'rap': 'Badtz-Maru',
      'trap': 'Badtz-Maru',
      'country': 'Snoopy'
    };

    let scores = {};

    // Initialize scores for each Sanrio character
    for (let key in sanrioMapping) {
      const character = sanrioMapping[key];
      if (!scores[character]) {
        scores[character] = 0; // Initialize score to 0
      }
    }
  
    // Check how many times each key appears in the genre
    for (let genre of genres) {
      const lowerCaseGenre = genre.toLowerCase();
  
      for (let key in sanrioMapping) {
        const character = sanrioMapping[key];
  
        // Count instances of the key in the genre
        const keyOccurrences = (lowerCaseGenre.match(new RegExp(key, 'g')) || []).length;
  
        // Add the occurrences to the character's score
        if (keyOccurrences > 0) {
          scores[character] += keyOccurrences;
        }
      }
    }
  
    // Find the character with the highest score
    let bestMatch = 'Pochacco'; // Default character
    let highestScore = 0;
  
    for (let character in scores) {
      if (scores[character] > highestScore) {
        highestScore = scores[character];
        bestMatch = character;
      }
    }
  
    // Return the best match along with the scores for each character
    return { bestMatch, scores };
  }

  // Function to fetch Hello Kitty's data
  const fetchHelloKitty = async () => {
    try {
      const response = await axios.get('http://localhost:5000/character/hellokitty');
      setCharacter(response.data);
      setError(null);
    } catch (err) {
      setCharacter(null);
      setError('Failed to fetch Hello Kitty data.');
      console.error('Error:', err);
    }
  };

  // Fetch Hello Kitty data on component mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchUserProfile(token);
      fetchTopArtists(token);
    }
    fetchHelloKitty();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Sanrio Character: Hello Kitty & Spotify User Data</h1>
      
      {/* Spotify User's Profile */}
      <h2 className="mt-5 text-center"> Spotify Profile</h2>
      {userProfile ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>{userProfile.display_name}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {userProfile.email}<br />
              <strong>Spotify ID:</strong> {userProfile.display_name}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        error && <Alert variant="danger" className="mt-3">Failed to load user profile</Alert>
      )}
      
      {/* Spotify User's Top Artists */}
      {topArtists.length > 0 ? (
        topArtists.map((artist, index) => {
          const { bestMatch, scores } = getSanrioCharacter(artist.genres);
          return (
            <Card key={index} className="mt-3">
              <Card.Body>
                <Card.Title>{artist.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Genres:</Card.Subtitle>
                <ListGroup variant="flush">
                  {artist.genres.length > 0 ? (
                    artist.genres.map((genre, idx) => (
                      <ListGroup.Item key={idx}>{genre}</ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No genres available</ListGroup.Item>
                  )}
                </ListGroup>
                  {/* Display the best Sanrio character */}
                  <h5 className="mt-3">Best Sanrio Character: {bestMatch}</h5>

                  {/* Display scores for each Sanrio character */}
                  <h6>Character Scores:</h6>
                  <ul>
                    {Object.entries(scores).map(([character, score]) => (
                      <li key={character}>{character}: {score}</li>
                    ))}
                  </ul>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        error && <Alert variant="danger" className="mt-3">{error}</Alert>
      )}

      {/* Hello Kitty's Data */}
      {character ? (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>{character.name}</Card.Title>
            <Card.Text>{character.description}</Card.Text>
            <h5>Favorite Genres:</h5>
            <ul>
              {character.genres.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      ) : (
        error && <Alert variant="danger" className="mt-3">{error}</Alert>
      )}

      {/* Refresh Buttons */}
      <div className="mt-4 text-center">
        <Button variant="primary" onClick={fetchHelloKitty}>
          Refresh Hello Kitty Data
        </Button>
        <Button variant="secondary" onClick={fetchTopArtists} className="ml-3">
          Refresh Spotify Data
        </Button>

<Button variant="success" onClick={loginWithSpotify}>
  Login with Spotify
</Button>
      </div>
    </Container>
  );
}

export default App2;
