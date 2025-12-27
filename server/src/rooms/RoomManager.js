import { GameRoom } from './GameRoom.js';

export class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  /**
   * Oyuncu için uygun bir oda bul veya yeni oda oluştur
   */
  findOrCreateRoom() {
    // Dolu olmayan ve başlamamış oda bul
    for (const [id, room] of this.rooms) {
      if (!room.isFull() && !room.isStarted()) {
        return room;
      }
    }

    // Yeni oda oluştur (io parametresi ile)
    const newRoom = new GameRoom(this.io);
    this.rooms.set(newRoom.id, newRoom);
    
    console.log(`Created new room: ${newRoom.id}`);
    
    return newRoom;
  }

  /**
   * Oda ID'si ile oda bul
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  /**
   * Boş odaları temizle
   */
  cleanupEmptyRooms() {
    for (const [id, room] of this.rooms) {
      if (room.isEmpty()) {
        room.destroy();
        this.rooms.delete(id);
        console.log(`Cleaned up empty room: ${id}`);
      }
    }
  }

  /**
   * Oda istatistikleri
   */
  getRoomStats() {
    const stats = [];
    for (const [id, room] of this.rooms) {
      stats.push({
        id,
        players: room.getPlayerCount(),
        maxPlayers: room.maxPlayers,
        isStarted: room.isStarted(),
        isFull: room.isFull()
      });
    }
    return stats;
  }

  /**
   * Toplam oyuncu sayısı
   */
  getTotalPlayers() {
    let total = 0;
    for (const room of this.rooms.values()) {
      total += room.getPlayerCount();
    }
    return total;
  }
}
