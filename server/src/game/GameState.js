import { Snake } from './Snake.js';

export class GameState {
  constructor(players) {
    this.snakes = new Map();
    this.decisionNodes = [];
    this.tick = 0;

    // Her oyuncu için yılan oluştur
    for (const [socketId, playerData] of players) {
      const snake = new Snake(socketId, playerData.nickname);
      this.snakes.set(socketId, snake);
    }

    // İlk karar noktalarını spawn et
    this.spawnDecisionNodes();
  }

  update(deltaTime) {
    this.tick++;

    // Yılanları güncelle
    for (const snake of this.snakes.values()) {
      snake.update(deltaTime);
    }

    // Çarpışma kontrolü
    this.checkCollisions();

    // Karar noktalarını güncelle
    this.updateDecisionNodes(deltaTime);

    // Periyodik olarak yeni karar noktaları ekle
    if (this.tick % 180 === 0) { // Her 3 saniyede bir
      this.spawnDecisionNodes();
    }
  }

  spawnDecisionNodes() {
    // Hedef: 8-12 adet aktif karar noktası
    while (this.decisionNodes.length < 10) {
      const node = {
        id: `dn_${Date.now()}_${Math.random()}`,
        x: 200 + Math.random() * 1600,
        y: 200 + Math.random() * 1600,
        active: true,
        lifetime: 20000, // 20 saniye
        createdAt: Date.now()
      };
      this.decisionNodes.push(node);
    }
  }

  updateDecisionNodes(deltaTime) {
    const now = Date.now();
    
    // Süresi dolmuş karar noktalarını kaldır
    this.decisionNodes = this.decisionNodes.filter(node => {
      return (now - node.createdAt) < node.lifetime;
    });
  }

  checkCollisions() {
    // TODO: Duvar, yılan-yılan, ve kendi kendine çarpışma kontrolü
  }

  getSnake(socketId) {
    return this.snakes.get(socketId);
  }

  removeSnake(socketId) {
    this.snakes.delete(socketId);
  }

  getState() {
    const snakesArray = [];
    for (const snake of this.snakes.values()) {
      snakesArray.push(snake.toJSON());
    }

    return {
      tick: this.tick,
      snakes: snakesArray,
      decisionNodes: this.decisionNodes
    };
  }
}
