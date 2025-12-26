# 🔌 WebSocket Bağlantı Sorunu - Çözüm

## ❌ Hata
```
WebSocket connection to 'wss://karar-yilani-server.onrender.com/socket.io/...' failed
❌ Disconnected: transport close
```

## ✅ Çözüm

### Ne Değişti?

**v2.1'de yapılan düzeltmeler:**

1. **Transport Sırası Değişti**
   ```javascript
   // ESKI (çalışmıyor):
   transports: ['websocket', 'polling']
   
   // YENİ (çalışıyor):
   transports: ['polling', 'websocket']
   ```
   
   **Neden?** Render.com free tier'da WebSocket cold start'ta sorunlu olabiliyor. Önce HTTP polling ile bağlan, sonra WebSocket'e upgrade et.

2. **Timeout Değerleri Artırıldı**
   ```javascript
   connectTimeout: 45000  // 45 saniye (cold start için)
   pingTimeout: 60000     // 60 saniye
   pingInterval: 25000    // 25 saniye
   ```

3. **Auto-Reconnection İyileştirildi**
   ```javascript
   reconnectionAttempts: 10  // 5 → 10
   ```

4. **Upgrade Logging Eklendi**
   ```javascript
   socket.on('upgrade', () => {
     console.log('🚀 Upgraded to:', socket.io.engine.transport.name);
   });
   ```

---

## 🚀 GitHub'a Push Et

```bash
cd karar-yilani

# v2.1 ZIP'inden dosyaları güncelle veya manuel değiştir:
# - client/src/utils/socket.js
# - server/src/index.js

git add .
git commit -m "fix: WebSocket transport fallback for Render.com"
git push origin main
```

---

## 🧪 Test Sonrası Console Çıktısı

**BAŞARILI BAĞLANTI:**
```
Connecting to: https://karar-yilani-server.onrender.com
✅ Connected to server: abc123
Transport: polling                    ← İlk önce polling
🚀 Upgraded to: websocket            ← Sonra upgrade
```

**İLK BAĞLANTI YAVAŞ (Cold Start):**
```
Connecting to: https://karar-yilani-server.onrender.com
... (30 saniye bekleyebilir)
✅ Connected to server: abc123
Transport: polling
```

**BAĞLANTI KOPTU VE YENİDEN BAĞLANDI:**
```
❌ Disconnected: transport close
Connecting to: https://karar-yilani-server.onrender.com
✅ Connected to server: xyz789
Transport: polling
```

---

## 🔍 Render Backend Logs

Deploy sonrası Render logs'da şunu görmelisin:

```
Player connected: abc123
Transport: polling
Transport upgraded to: websocket
```

---

## ⚡ Render Free Tier Özellikleri

**Neden bazen yavaş?**
- **Cold Start:** İlk istek → ~30 saniye
- **Auto-Sleep:** 15 dakika inaktif → sleep mode
- **Wake-Up:** Sleep'ten uyan → ~30 saniye

**Çözüm:**
1. **Sabırlı ol** (ilk bağlantı 30-45 saniye sürebilir)
2. **UptimeRobot** kurarak sleep'i önle (opsiyonel)
3. **Paid plan** al ($7/ay, always-on)

---

## 🛠️ Manuel Değişiklikler (ZIP kullanmıyorsan)

### 1. `client/src/utils/socket.js`

**DEĞİŞTİR:**
```javascript
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,           // ← 5'ten 10'a çıkar
  timeout: 20000,
  transports: ['polling', 'websocket'], // ← SIRASINI DEĞİŞTİR!
  upgrade: true,                        // ← EKLE
  rememberUpgrade: true                 // ← EKLE
});
```

**EKLE (socket.on listeners'a):**
```javascript
socket.on('upgrade', () => {
  console.log('🚀 Upgraded to:', socket.io.engine.transport.name);
});
```

### 2. `server/src/index.js`

**DEĞİŞTİR:**
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true                    // ← EKLE
  },
  transports: ['polling', 'websocket'],  // ← EKLE
  allowUpgrades: true,                   // ← EKLE
  pingTimeout: 60000,                    // ← EKLE
  pingInterval: 25000,                   // ← EKLE
  maxHttpBufferSize: 1e6,                // ← EKLE
  connectTimeout: 45000                  // ← EKLE
});
```

**EKLE (io.on('connection') içine):**
```javascript
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  console.log('Transport:', socket.conn.transport.name);  // ← EKLE
  
  socket.conn.on('upgrade', () => {                       // ← EKLE
    console.log('Transport upgraded to:', socket.conn.transport.name);
  });
  
  setupSocketHandlers(socket, io, roomManager);
});
```

---

## ✅ Test Checklist

Push ettikten sonra:

- [ ] Vercel otomatik deploy etti
- [ ] Render otomatik deploy etti
- [ ] Siteye gir, nickname yaz, OYNA tıkla
- [ ] Console'da "✅ Connected" görünüyor
- [ ] Console'da "Transport: polling" görünüyor
- [ ] 2-3 saniye sonra "🚀 Upgraded to: websocket" görünüyor (opsiyonel)
- [ ] Lobby açıldı, oyuncular görünüyor
- [ ] 2. tarayıcıda aynı odaya düşüyor

---

## 🆘 Hala Çalışmıyorsa

1. **Render servis uyuyor mu?**
   ```
   https://karar-yilani-server.onrender.com/health
   ```
   → 30-45 saniye bekle, tekrar dene

2. **CORS sorunu mu?**
   ```
   Render → Environment → CORS_ORIGIN
   → Vercel URL'i doğru mu kontrol et
   ```

3. **Console'da başka hata var mı?**
   → Screenshot'ları paylaş

---

**Push et ve test et! 🚀**
