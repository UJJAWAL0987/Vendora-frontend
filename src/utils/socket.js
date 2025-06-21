import { io } from 'socket.io-client';

// Use the same base URL as the API, but replace http/https with ws/wss for WebSocket
const getSocketUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // If it's localhost, use localhost for socket too
  if (apiUrl.includes('localhost')) {
    return 'http://localhost:5000';
  }
  
  // For production, use the same domain but with WebSocket protocol
  const url = new URL(apiUrl);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}`;
};

const SOCKET_URL = getSocketUrl();

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  withCredentials: true
}); 