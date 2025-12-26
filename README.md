# 🐍 Karar Yılanı (Decision Snake)

Çok oyunculu, web tabanlı bir karar oyunu. Slither.io mekanikleriyle birleştirilmiş hayat ve ofis temalı kararlar!

## 🎮 Oyun Hakkında

Karar Yılanı, klasik yılan oyununu modern bir twist ile sunar. Arena'da dolaşırken **karar noktaları** ile karşılaşırsınız. Aldığınız her karar yılanınızın uzunluğunu, hızını ve skorunuzu etkiler!

### Temel Özellikler
- 🌐 **Multiplayer:** 16 oyuncuya kadar aynı anda
- ⚡ **Real-time:** WebSocket tabanlı gerçek zamanlı oyun
- 📱 **Responsive:** Web ve mobil web uyumlu
- 🎯 **Stratejik:** 30+ farklı karar senaryosu
- ⏱️ **Hızlı oyun:** 5 dakikalık maçlar

## 🏗️ Proje Yapısı

```
karar-yilani/
├── client/          # React + Pixi.js frontend
├── server/          # Node.js + Socket.io backend
├── docs/            # Detaylı dokümantasyon
└── data/            # Oyun verileri (kararlar, metinler)
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Frontend Kurulumu
```bash
cd client
npm install
npm run dev
```

### Backend Kurulumu
```bash
cd server
npm install
npm run dev
```

## 📖 Detaylı Dokümantasyon

- [Oyun Kuralları](docs/GAME_RULES.md)
- [Teknik Mimari](docs/ARCHITECTURE.md)
- [API Dokümantasyonu](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)

## 🎯 MVP Roadmap

### ✅ Sprint 1 (Hafta 1-2)
- [ ] Project setup
- [ ] Basic canvas rendering
- [ ] Snake movement
- [ ] WebSocket bağlantısı
- [ ] Basit multiplayer sync

### ⏳ Sprint 2 (Hafta 3)
- [ ] Decision nodes spawn
- [ ] Decision popup UI
- [ ] Karar efektleri
- [ ] JSON'dan karar yükleme

### ⏳ Sprint 3 (Hafta 4)
- [ ] Collision detection
- [ ] Skor sistemi
- [ ] Oyun timer
- [ ] Death & respawn

### ⏳ Sprint 4 (Hafta 5)
- [ ] Tüm ekranlar (Home, Lobby, Game, GameOver)
- [ ] Mobile responsive
- [ ] Touch controls
- [ ] Polish

### ⏳ Sprint 5 (Hafta 6)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Deploy (Vercel + Render)
- [ ] Monitoring

## 🎨 Tech Stack

### Frontend
- React 18
- Pixi.js v7 (Canvas rendering)
- Zustand (State management)
- Socket.io-client
- Vite

### Backend
- Node.js + Express
- Socket.io (WebSocket)
- (v2: Redis, PostgreSQL)

### Deployment
- Frontend: Vercel
- Backend: Render.com

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

Proje Sahibi: [Onur]

## 🙏 Teşekkürler

Bu proje Anthropic Claude ile birlikte tasarlanmıştır.
