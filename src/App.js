import React, { useEffect, useState } from 'react';
import './App.css';
import { login, getAccessToken, searchTracks, savePlaylist } from './Spotify'; 

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (accessToken) {
      const results = await searchTracks(accessToken, query);
      setTracks(results);
    }
  };

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks([...playlistTracks, track]);
  };

  const handleCreatePlaylist = async () => {
    if (accessToken && playlistName && playlistTracks.length) {
      await savePlaylist(accessToken, playlistName, playlistTracks);
      alert('Playlist saved!');
      setPlaylistTracks([]);  
      setPlaylistName('');
    }
  };

  const handleLogin = () => {
    login();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jammming</h1>
        {!accessToken ? (
          <button onClick={handleLogin}>Login to Spotify</button>
        ) : (
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search for a song"
              aria-label="Search for a song"
              required
            />
            <button type="submit">Search</button>
          </form>
        )}
      </header>

      <div className="sidebar">
        <h2>Search Results</h2>
        <ul className="track-list">
          {tracks.map(track => (
            <li className="track" key={track.id}>
              <h4>{track.name}</h4>
              <p>{track.artists[0].name}</p>
              <p>{track.album.name}</p>
              <button onClick={() => handleAddToPlaylist(track)}>Add to Playlist</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="playlist-section">
        <h2>Create Playlist</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            value={playlistName} 
            onChange={(e) => setPlaylistName(e.target.value)} 
            placeholder="Playlist Name"
            required
          />
          <button onClick={handleCreatePlaylist}>Save Playlist</button>
        </form>

        <h3>Tracks in Playlist:</h3>
        <ul className="track-list">
          {playlistTracks.map(track => (
            <li className="track" key={track.id}>
              <h4>{track.name}</h4>
              <p>{track.artists[0].name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
