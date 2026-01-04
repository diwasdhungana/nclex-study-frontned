import axios from 'axios';
import { app } from '../config';

export const client = axios.create({
  baseURL: app.apiBaseUrl,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export function setClientTokens(tokens: { accessToken: string; refreshToken: string }) {
  localStorage.setItem(app.accessTokenStoreKey, tokens.accessToken);
  localStorage.setItem(app.refreshTokenStoreKey, tokens.refreshToken);
  client.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
}

export function removeClientAccessToken() {
  localStorage.removeItem(app.accessTokenStoreKey);
  localStorage.removeItem(app.refreshTokenStoreKey);
  delete client.defaults.headers.common.Authorization;
}

export function loadAccessToken() {
  const token = localStorage.getItem(app.accessTokenStoreKey);
  const refreshToken = localStorage.getItem(app.refreshTokenStoreKey);
  setClientTokens({ accessToken: token ?? '', refreshToken: refreshToken ?? '' });
}

// Function to refresh the access token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(app.refreshTokenStoreKey);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await client.post('/auth/refresh-token', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    if (!accessToken || !newRefreshToken) {
      throw new Error('Invalid token response');
    }

    // Update tokens in localStorage and Axios headers
    setClientTokens({ accessToken, refreshToken: newRefreshToken });
    // console.log('Access token refreshed successfully');
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    removeClientAccessToken(); // Clear tokens
    throw error; // Re-throw the error for further handling
  }
}

// Set up a timer to refresh the token every 55 minutes
// const TOKEN_REFRESH_INTERVAL = 3300000; // 55 minutes

// const startTokenRefreshInterval = () => {
//   setInterval(async () => {
//     try {
//       await refreshAccessToken();
//       // console.log('Access token refreshed successfully');
//     } catch (error) {
//       console.error('Failed to refresh access token:', error);
//       removeClientAccessToken(); // Clear tokens
//       window.location.href = '/auth/login'; // Redirect to login page
//     }
//   }, TOKEN_REFRESH_INTERVAL);
// };

// startTokenRefreshInterval();
