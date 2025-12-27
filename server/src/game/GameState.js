import { Snake } from './Snake.js';

export class GameState {
  constructor(players) {
    this.snakes = new Map();
    this.currentDecision = null; // Aktif karar
    this.tick = 0;

    // Her oyuncu için yılan oluştur
    for (const [socketId, playerData] of players) {
      const snake = new Snake(socketId, playerData.nickname);
      this.snakes.set(socketId, snake);
    }
  }

  update(deltaTime) {
    this.tick++;

    // Yılanları güncelle
    for (const snake of this.snakes.values()) {
      snake.update(deltaTime);
    }

    // Çarpışma kontrolü
    this.checkCollisions();

    // Her 30 saniyede bir karar tetikle (1800 tick @ 60fps)
    if (this.tick % 1800 === 0 && this.tick > 0) {
      this.triggerDecision();
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
      currentDecision: this.currentDecision
    };
  }
}
