export class Snake {
  constructor(socketId, nickname) {
    this.socketId = socketId;
    this.nickname = nickname;
    
    // Rastgele spawn pozisyonu
    this.x = 200 + Math.random() * 1600;
    this.y = 200 + Math.random() * 1600;
    
    // Yılan segmentleri
    this.segments = [];
    this.initializeSegments();
    
    // Hareket
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = 0;
    this.speed = 3;
    this.speedMultiplier = 1.0;
    
    // Oyun durumu
    this.score = 0;
    this.isAlive = true;
    this.buffs = [];
    
    // İstatistikler
    this.maxLength = 5;
    this.decisionsMade = 0;
    this.deaths = 0;
  }

  initializeSegments() {
    // Başlangıç uzunluğu: 5 segment
    for (let i = 0; i < 5; i++) {
      this.segments.push({
        x: this.x - i * 8,
        y: this.y
      });
    }
  }

  update(deltaTime) {
    if (!this.isAlive) return;

    // Buff'ları güncelle
    this.updateBuffs(deltaTime);

    // Hedefe doğru hareket
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const currentSpeed = this.speed * this.speedMultiplier;
      this.x += (dx / distance) * currentSpeed;
      this.y += (dy / distance) * currentSpeed;
      this.direction = Math.atan2(dy, dx);
    }

    // Segment güncelleme (basitleştirilmiş)
    if (this.segments.length > 0) {
      // Yeni head pozisyonu
      this.segments.unshift({ x: this.x, y: this.y });
      
      // Fazla segmentleri sil
      while (this.segments.length > this.maxLength) {
        this.segments.pop();
      }
    }
  }

  updateBuffs(deltaTime) {
    const now = Date.now();
    this.buffs = this.buffs.filter(buff => buff.expiry > now);
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  grow(amount) {
    this.maxLength = Math.max(3, this.maxLength + amount);
  }

  shrink(amount) {
    this.maxLength = Math.max(3, this.maxLength - amount);
  }

  addScore(points) {
    this.score += points;
  }

  applyDecisionEffect(effect) {
    // Uzunluk değişimi
    if (effect.lengthChange) {
      if (effect.lengthChange > 0) {
        this.grow(effect.lengthChange);
      } else {
        this.shrink(Math.abs(effect.lengthChange));
      }
    }

    // Hız değişimi
    if (effect.speedMultiplier && effect.duration) {
      this.speedMultiplier = effect.speedMultiplier;
      
      // Buff ekle
      this.buffs.push({
        type: 'speed',
        multiplier: effect.speedMultiplier,
        expiry: Date.now() + effect.duration
      });

      // Duration sonunda reset
      setTimeout(() => {
        this.speedMultiplier = 1.0;
      }, effect.duration);
    }

    // Skor bonusu
    if (effect.scoreBonus) {
      this.addScore(effect.scoreBonus);
    }

    this.decisionsMade++;
  }

  die() {
    this.isAlive = false;
    this.deaths++;
    this.score = Math.max(0, this.score - 100); // Ölme penaltısı

    // 2 saniye sonra respawn
    setTimeout(() => {
      this.respawn();
    }, 2000);
  }

  respawn() {
    this.x = 200 + Math.random() * 1600;
    this.y = 200 + Math.random() * 1600;
    this.maxLength = 5;
    this.segments = [];
    this.initializeSegments();
    this.isAlive = true;
    this.speedMultiplier = 1.0;
    this.buffs = [];
  }

  toJSON() {
    return {
      socketId: this.socketId,
      nickname: this.nickname,
      segments: this.segments,
      direction: this.direction,
      speed: this.speed * this.speedMultiplier,
      score: this.score,
      length: this.segments.length,
      isAlive: this.isAlive,
      buffs: this.buffs.map(b => ({ type: b.type }))
    };
  }
}
