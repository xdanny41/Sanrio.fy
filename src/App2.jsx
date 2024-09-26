// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert, ListGroup } from 'react-bootstrap';

function App2() {
  const [character, setCharacter] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [error, setError] = useState(null);

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

  // Function to fetch Spotify user's top artists and their genres
  const fetchTopArtists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user-top-artists');
      setTopArtists(response.data);
      setError(null);
    } catch (err) {
      setTopArtists([]);
      setError('Failed to fetch top artists from Spotify.');
      console.error('Error:', err);
    }
  };

  // Fetch Hello Kitty data on component mount
  useEffect(() => {
    fetchHelloKitty();
    fetchTopArtists();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Sanrio Character: Hello Kitty & Spotify User Data</h1>

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

      {/* Spotify User's Top Artists and Genres */}
      <h2 className="mt-5 text-center">Spotify User's Top Artists</h2>
      {topArtists.length > 0 ? (
        topArtists.map((artist, index) => (
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
            </Card.Body>
          </Card>
        ))
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

<Button variant="success" onClick={() => window.location.href = 'http://localhost:5000/login'}>
  Login with Spotify
</Button>
      </div>
    </Container>
  );
}

export default App2;
