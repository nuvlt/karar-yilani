# 🚀 Hızlı Başlangıç Rehberi

## 📦 Kurulum

### 1. Projeyi İndir/Kopyala

```bash
# ZIP'i aç
unzip karar-yilani.zip
cd karar-yilani
```

### 2. Frontend Kurulum

```bash
cd client
npm install
```

**`.env` dosyası oluştur (opsiyonel, development için):**
```bash
echo "VITE_API_URL=http://localhost:3001" > .env
```

### 3. Backend Kurulum

```bash
cd ../server
npm install
```

**`.env` dosyası oluştur:**
```bash
cp .env.example .env
```

**`.env` içeriğini düzenle:**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🎮 Lokal Çalıştırma

### Terminal 1: Backend Başlat
```bash
cd server
npm run dev
```

Çıktı:
```
🐍 Karar Yılanı Server running on port 3001
Environment: development
```

### Terminal 2: Frontend Başlat
```bash
cd client
npm run dev
```

Çıktı:
```
  VITE v5.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
```

### Tarayıcıda Aç
- http://localhost:3000

## 🧪 Test Etme

### Multiplayer Test (Lokal)
1. İlk tarayıcı: http://localhost:3000
2. İkinci tarayıcı (inkognito): http://localhost:3000
3. Her ikisinde farklı nickname gir
4. Aynı odada oynamaya başlayın!

### Mobile Test
1. Bilgisayar ve telefon aynı WiFi'de olmalı
2. Bilgisayarın IP adresini bul: `ipconfig` (Windows) veya `ifconfig` (Mac/Linux)
3. Telefonda: http://192.168.1.X:3000 (X = bilgisayarın IP'si)

## 📁 Proje Yapısı

```
karar-yilani/
├── client/              # React frontend
│   ├── src/
│   │   ├── screens/     # Ana ekranlar
│   │   ├── components/  # UI ve oyun component'leri
│   │   ├── styles/      # CSS dosyaları
│   │   └── main.jsx     # Entry point
│   └── package.json
│
├── server/              # Node.js backend
│   ├── src/
│   │   ├── rooms/       # Oda yönetimi
│   │   ├── game/        # Oyun mantığı
│   │   ├── sockets/     # WebSocket handlers
│   │   └── index.js     # Entry point
│   ├── data/
│   │   ├── decisions.json    # Karar senaryoları
│   │   └── ui-texts.json     # UI metinleri
│   └── package.json
│
└── docs/                # Dokümantasyon
    ├── GAME_RULES.md    # Oyun kuralları
    └── DEPLOYMENT.md    # Deploy rehberi
```

## 🎨 Özelleştirme

### Kararları Değiştir
`server/data/decisions.json` dosyasını düzenle:

```json
{
  "id": "d031",
  "scenario": "Yeni senaryonu yaz!",
  "theme": "risk",
  "options": [
    {
      "label": "Seçenek 1",
      "effect": {
        "lengthChange": 10,
        "speedMultiplier": 1.2,
        "scoreBonus": 100,
        "duration": 5000
      }
    }
  ]
}
```

### UI Metinlerini Değiştir
`server/data/ui-texts.json` dosyasını düzenle.

### Renkleri Değiştir
`client/src/styles/index.css` dosyasındaki CSS variables:

```css
:root {
  --primary: #00ff88;      /* Ana renk */
  --secondary: #ffd700;    /* İkincil renk */
  --bg-dark: #0f0f1e;     /* Arka plan */
}
```

## 🐛 Sorun Giderme

### Port zaten kullanılıyor
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### npm install hataları
```bash
# Cache temizle
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### WebSocket bağlantı hatası
1. Backend'in çalıştığından emin ol (port 3001)
2. CORS ayarlarını kontrol et
3. Firewall'u kontrol et

## 📚 Sonraki Adımlar

1. ✅ **Oyunu Test Et:** Lokal ortamda oyna
2. 📖 **Kuralları Öğren:** `docs/GAME_RULES.md`
3. 🚀 **Deploy Et:** `docs/DEPLOYMENT.md`
4. 🎨 **Özelleştir:** Kararları ve UI'ı değiştir
5. 🔧 **Geliştir:** Yeni özellikler ekle

## 💡 Geliştirme İpuçları

### Hot Reload
- Frontend: Otomatik (Vite sayesinde)
- Backend: `--watch` flag ile otomatik restart

### Debug
```javascript
// Client tarafında
console.log('Debug:', data);

// Server tarafında
console.log('Server Debug:', data);
```

### Git Workflow
```bash
git checkout -b feature/yeni-ozellik
# Değişiklikleri yap
git add .
git commit -m "feat: Yeni özellik eklendi"
git push origin feature/yeni-ozellik
# GitHub'da Pull Request aç
```

## 🤝 Katkıda Bulunma

1. Fork et
2. Feature branch oluştur
3. Commit et
4. Push et
5. Pull Request aç

## ❓ Sorular

GitHub Issues'da soru sorabilirsin:
https://github.com/[username]/karar-yilani/issues

---

**Keyifli kodlamalar! 🐍**
