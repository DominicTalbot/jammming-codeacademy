// src/Spotify.js
import axios from 'axios';

const SPOTIFY_CLIENT_ID = '774d3b2d39814a9dbf511964a454750e';
const SPOTIFY_REDIRECT_URI = 'http://localhost:3000';
const SPOTIFY_SCOPES = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;

// Function to log in to Spotify
export const login = () => {
    window.location.href = AUTH_URL; 
};

// Function to retrieve access token from URL
export const getAccessToken = () => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
        token = hash.split('&')[0].split('=')[1];
        window.location.hash = ''; 
    }

    return token;
};

// Function to search for tracks
export const searchTracks = async (token, query) => {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            q: query,
            type: 'track',
        },
    });
    return response.data.tracks.items; 
};

// Function to create a new playlist
export const createPlaylist = async (token, userId, name) => {
    const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, 
    {
        name: name,
        public: false,
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; 
};

// Function to save a user's playlist with tracks
export const savePlaylist = async (token, playlistName, tracks) => {
    try {
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const userId = userResponse.data.id;

        // Create the new playlist
        const playlist = await createPlaylist(token, userId, playlistName);

        // Prepare the track URIs for the playlist
        const trackUris = tracks.map(track => track.uri);

        // Add tracks to the new playlist
        await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
                uris: trackUris,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return playlist; 
    } catch (error) {
        console.error('Error saving playlist: ', error);
        throw error; 
    }
};
