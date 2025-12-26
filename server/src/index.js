import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './rooms/RoomManager.js';
import { setupSocketHandlers } from './sockets/socketHandlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type']
  },
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
  connectTimeout: 45000,
  allowEIO3: true
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Room Manager (singleton)
const roomManager = new RoomManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: roomManager.getRoomStats(),
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get('/api/rooms', (req, res) => {
  res.json(roomManager.getRoomStats());
});

// CORS Debug endpoint
app.get('/debug/cors', (req, res) => {
  res.json({
    configuredOrigin: process.env.CORS_ORIGIN,
    requestOrigin: req.headers.origin,
    allEnvVars: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    }
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  console.log('Transport:', socket.conn.transport.name);
  
  socket.conn.on('upgrade', () => {
    console.log('Transport upgraded to:', socket.conn.transport.name);
  });
  
  setupSocketHandlers(socket, io, roomManager);
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🐍 Karar Yılanı Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
