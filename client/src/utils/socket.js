import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('Connecting to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
  timeout: 20000,
  transports: ['polling', 'websocket'], // Önce polling dene!
  upgrade: true, // Polling'den websocket'e upgrade etmeyi dene
  rememberUpgrade: true
});

// Connection event listeners
socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
  console.log('Transport:', socket.io.engine.transport.name);
});

socket.on('upgrade', () => {
  console.log('🚀 Upgraded to:', socket.io.engine.transport.name);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
  if (reason === 'io server disconnect') {
    // Server disconnected, reconnect manually
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error.message);
});

socket.on('error', (error) => {
  console.error('🔴 Socket error:', error);
});

export default socket;
