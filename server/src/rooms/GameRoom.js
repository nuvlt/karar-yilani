import { randomBytes } from 'crypto';
import { GameState } from '../game/GameState.js';

export class GameRoom {
  constructor() {
    this.id = this.generateRoomId();
    this.maxPlayers = 16;
    this.players = new Map(); // socketId -> PlayerData
    this.gameState = null;
    this.started = false;
    this.startTime = null;
    this.gameDuration = 300000; // 5 dakika (ms)
    this.tickInterval = null;
    this.tickRate = 60; // FPS
  }

  generateRoomId() {
    return randomBytes(3).toString('hex').toUpperCase();
  }

  addPlayer(socketId, playerData) {
    if (this.isFull()) {
      return false;
    }

    this.players.set(socketId, {
      socketId,
      nickname: playerData.nickname,
      joinedAt: Date.now()
    });

    console.log(`Player ${playerData.nickname} joined room ${this.id}`);

    // Oda doluysa veya belli bir süre geçtiyse oyunu başlat
    if (this.players.size >= 2 && !this.started) {
      setTimeout(() => {
        if (!this.started) {
          this.start();
        }
      }, 3000); // 3 saniye bekleme
    }

    return true;
  }

  removePlayer(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      this.players.delete(socketId);
      console.log(`Player ${player.nickname} left room ${this.id}`);

      // Oyun bitmiş ve oda boşsa temizle
      if (this.isEmpty() && this.started) {
        this.destroy();
      }
    }
  }

  start() {
    if (this.started) return;

    console.log(`Starting game in room ${this.id} with ${this.players.size} players`);
    
    this.started = true;
    this.startTime = Date.now();
    this.gameState = new GameState(this.players);

    // Game tick loop
    this.tickInterval = setInterval(() => {
      this.tick();
    }, 1000 / this.tickRate);

    // Game end timer
    setTimeout(() => {
      this.end();
    }, this.gameDuration);
  }

  tick() {
    if (!this.gameState) return;

    // Update game state
    this.gameState.update(1000 / this.tickRate);

    // TODO: Broadcast state to all players
  }

  end() {
    console.log(`Game ended in room ${this.id}`);
    
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    // TODO: Calculate final scores and broadcast results
  }

  destroy() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    this.players.clear();
    this.gameState = null;
  }

  isFull() {
    return this.players.size >= this.maxPlayers;
  }

  isEmpty() {
    return this.players.size === 0;
  }

  isStarted() {
    return this.started;
  }

  getPlayerCount() {
    return this.players.size;
  }

  getPlayers() {
    return Array.from(this.players.values());
  }

  getRemainingTime() {
    if (!this.startTime) return this.gameDuration;
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.gameDuration - elapsed);
  }
}
