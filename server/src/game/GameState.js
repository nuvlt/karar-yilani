import { Snake } from './Snake.js';

export class GameState {
  constructor(players) {
    this.snakes = new Map();
    this.decisionNodes = [];
    this.currentDecision = null; // Aktif karar
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

    // Her 30 saniyede bir karar tetikle (1800 tick @ 60fps)
    if (this.tick % 1800 === 0 && this.tick > 0) {
      this.triggerDecision();
    }

    // Periyodik olarak yeni karar noktaları ekle
    if (this.tick % 180 === 0) { // Her 3 saniyede bir
      this.spawnDecisionNodes();
    }
  }

  triggerDecision() {
    // Rastgele bir karar seç
    const decisions = [
      {
        question: "Sabah erkenden uyanıp spor yapmak mı, daha çok uyumak mı?",
        options: [
          { id: 'A', text: 'Spor yap 🏃', effect: { lengthChange: 3, scoreBonus: 30 } },
          { id: 'B', text: 'Daha çok uyu 😴', effect: { lengthChange: -1, scoreBonus: 5 } }
        ]
      },
      {
        question: "Yeni bir iş teklifi aldınız, maaş %30 daha fazla ama riskli!",
        options: [
          { id: 'A', text: 'Kabul et, büyü 📈', effect: { lengthChange: 5, scoreBonus: 50 } },
          { id: 'B', text: 'Güvenli kal 🛡️', effect: { lengthChange: 1, scoreBonus: 10 } }
        ]
      },
      {
        question: "Arkadaşınız yardım istiyor ama çok meşgulsünüz!",
        options: [
          { id: 'A', text: 'Yardım et 🤝', effect: { lengthChange: 2, speedMultiplier: 1.2, duration: 10000, scoreBonus: 20 } },
          { id: 'B', text: 'Reddet 🚫', effect: { lengthChange: -2, scoreBonus: 5 } }
        ]
      }
    ];

    const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];
    
    this.currentDecision = {
      id: `decision_${this.tick}`,
      ...randomDecision,
      triggeredAt: Date.now(),
      expiresAt: Date.now() + 10000 // 10 saniye
    };

    console.log('Decision triggered:', this.currentDecision.question);

    // 10 saniye sonra otomatik kapat
    setTimeout(() => {
      this.currentDecision = null;
    }, 10000);
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
      decisionNodes: this.decisionNodes,
      currentDecision: this.currentDecision
    };
  }
}
