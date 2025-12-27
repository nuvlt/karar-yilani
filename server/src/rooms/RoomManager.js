import { GameRoom } from './GameRoom.js';

export class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  /**
   * Oyuncu için uygun bir oda bul veya yeni oda oluştur
   * Mantık: En son oluşturulan dolu olmayan odaya ekle
   */
  findOrCreateRoom() {
    // Dolu olmayan ve başlamamış en son odayı bul
    let availableRoom = null;
    
    for (const [id, room] of this.rooms) {
      if (!room.isFull() && !room.isStarted()) {
        availableRoom = room;
        // En son oluşturulan uygun odayı kullan (break yapma, son odayı al)
      }
    }

    // Uygun oda varsa onu döndür
    if (availableRoom) {
      return availableRoom;
    }

    // Uygun oda yoksa yeni oda oluştur (io parametresi ile)
    const newRoom = new GameRoom(this.io);
    this.rooms.set(newRoom.id, newRoom);
    
    console.log(`Created new room: ${newRoom.id}`);
    
    return newRoom;
  }

  /**
   * Oda kodu ile odaya katıl
   */
  joinRoomByCode(roomCode) {
    const room = this.rooms.get(roomCode.toUpperCase());
    
    if (!room) {
      return { success: false, message: 'Oda bulunamadı!' };
    }

    if (room.isFull()) {
      return { success: false, message: 'Oda dolu!' };
    }

    if (room.isStarted()) {
      return { success: false, message: 'Oyun zaten başlamış!' };
    }

    return { success: true, room };
  }

  /**
   * Belirli bir odaya katıl (oda ID ile)
   */
  joinRoomById(roomId) {
    const room = this.rooms.get(roomId.toUpperCase());
    
    if (!room) {
      return { success: false, message: 'Oda bulunamadı!' };
    }
    
    if (room.isFull()) {
      return { success: false, message: 'Oda dolu!' };
    }
    
    if (room.isStarted()) {
      return { success: false, message: 'Oyun zaten başlamış!' };
    }
    
    return { success: true, room };
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
