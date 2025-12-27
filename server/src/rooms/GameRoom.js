import { randomBytes } from 'crypto';
import { GameState } from '../game/GameState.js';

export class GameRoom {
  constructor(io) {
    this.io = io; // Socket.io instance
    this.id = this.generateRoomId();
    this.maxPlayers = 16;
    this.players = new Map(); // socketId -> PlayerData
    this.gameState = null;
    this.started = false;
    this.startTime = null;
    this.gameDuration = 300000; // 5 dakika (ms)
    this.tickInterval = null;
    this.tickRate = 60; // FPS
    this.autoStartTimeout = null; // Auto-start timer
    this.creatorId = null; // İlk oyuncu (oda kurucusu)
    this.countdownStartTime = null; // Geri sayım başlangıç zamanı
    this.countdownDuration = 30000; // 30 saniye
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

    // İlk oyuncu oda kurucusu olur
    if (!this.creatorId) {
      this.creatorId = socketId;
    }

    console.log(`Player ${playerData.nickname} joined room ${this.id}`);

    // İlk kez 2 oyuncu olduğunda countdown başlat
    if (this.players.size === 2 && !this.started && !this.autoStartTimeout) {
      this.startCountdown();
    }

    return true;
  }

  startCountdown() {
    console.log(`Starting countdown in room ${this.id}`);
    this.countdownStartTime = Date.now();
    
    // Tüm oyunculara countdown başladı mesajı gönder
    this.io.to(this.id).emit('countdown-started', {
      startTime: this.countdownStartTime,
      duration: this.countdownDuration
    });
    
    this.autoStartTimeout = setTimeout(() => {
      if (!this.started) {
        console.log(`Auto-starting game in room ${this.id}`);
        this.start();
      }
    }, this.countdownDuration);
  }

  getRemainingCountdown() {
    if (!this.countdownStartTime) return 30;
    
    const elapsed = Date.now() - this.countdownStartTime;
    const remaining = Math.max(0, Math.ceil((this.countdownDuration - elapsed) / 1000));
    return remaining;
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
    
    // Auto-start timer'ı iptal et
    if (this.autoStartTimeout) {
      clearTimeout(this.autoStartTimeout);
      this.autoStartTimeout = null;
    }
    
    this.started = true;
    this.startTime = Date.now();
    this.gameState = new GameState(this.players);

    // Tüm oyunculara oyun başladı mesajı gönder
    this.io.to(this.id).emit('game-started', {
      roomId: this.id,
      players: this.getPlayers(),
      startTime: this.startTime
    });

    // Game tick loop
    this.tickInterval = setInterval(() => {
      this.tick();
    }, 1000 / this.tickRate);

    // Game end timer
    setTimeout(() => {
      this.end();
    }, this.gameDuration);
  }

  manualStart(requesterId) {
    // Sadece oda kurucusu manuel başlatabilir
    if (requesterId !== this.creatorId) {
      return { success: false, message: 'Sadece oda kurucusu oyunu başlatabilir!' };
    }

    if (this.started) {
      return { success: false, message: 'Oyun zaten başladı!' };
    }

    if (this.players.size < 2) {
      return { success: false, message: 'En az 2 oyuncu gerekli!' };
    }

    this.start();
    return { success: true };
  }

  broadcast(event, data) {
    // Socket.io'nun built-in broadcast kullan
    // io.to(roomId).emit() şeklinde kullanılacak
    // Bu metod artık kullanılmayacak, doğrudan emit edeceğiz
  }

  tick() {
    if (!this.gameState) return;

    // Update game state
    this.gameState.update(1000 / this.tickRate);

    // Broadcast güncel state'i tüm oyunculara gönder
    const state = this.gameState.getState();
    this.io.to(this.id).emit('game-update', state);
    
    // Karar varsa bildir
    if (state.currentDecision) {
      this.io.to(this.id).emit('decision-triggered', state.currentDecision);
    }
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
    return Array.from(this.players.values()).map(p => ({
      socketId: p.socketId,
      nickname: p.nickname
    }));
  }

  getRoomData() {
    return {
      roomId: this.id,
      players: this.getPlayers(),
      isStarted: this.started,
      playerCount: this.players.size,
      maxPlayers: this.maxPlayers,
      remainingCountdown: this.getRemainingCountdown(),
      countdownActive: this.countdownStartTime !== null
    };
  }

  getRemainingTime() {
    if (!this.startTime) return this.gameDuration;
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.gameDuration - elapsed);
  }
}
