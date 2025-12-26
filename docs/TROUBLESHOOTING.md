# 🔧 Deployment Sorun Giderme

## ❌ Hata: 404 veya Bağlantı Hatası

### Sorun 1: CORS Yapılandırması

**Render.com Environment Variables:**
```
CORS_ORIGIN=https://karar-yilani.vercel.app
```

⚠️ **DİKKAT:**
- URL tam olmalı (`https://` dahil)
- Sonda `/` olmamalı
- Vercel'in verdiği tam URL olmalı

**Vercel URL'ini bulmak için:**
1. Vercel Dashboard → Projeniz
2. En üstte URL gösterilir
3. Kopyala yapıştır (tırnaksız)

---

### Sorun 2: Frontend Environment Variable

**Vercel Environment Variables:**
```
VITE_API_URL=https://karar-yilani-server.onrender.com
```

⚠️ **DİKKAT:**
- Render'ın verdiği tam URL
- `https://` ile başlamalı
- Sonda `/` olmamalı
- Variable adı TAM OLARAK `VITE_API_URL` olmalı (Vite için `VITE_` prefix zorunlu)

**Değiştirdikten sonra:**
1. Vercel Dashboard → Deployments
2. En son deployment'ın yanında "•••" → **Redeploy**

---

### Sorun 3: GitHub'da Yeni Kod

Yeni dosyaları GitHub'a push edin:

```bash
# Lokal'de
cd karar-yilani
git add .
git commit -m "fix: Add socket.io client connection"
git push origin main
```

**Otomatik deploy olacak:**
- Vercel: GitHub push'tan sonra otomatik
- Render: GitHub push'tan sonra otomatik

---

## ✅ Test Checklist

### 1. Backend Çalışıyor mu?
```
https://karar-yilani-server.onrender.com/health
```

**Beklenen yanıt:**
```json
{
  "status": "ok",
  "rooms": [],
  "timestamp": "2024-12-26T..."
}
```

❌ **404 geliyorsa:** Render deploy tamamlanmamış, bekle
❌ **CORS hatası:** Environment variable yanlış

### 2. Frontend Çalışıyor mu?
```
https://karar-yilani.vercel.app
```

**Tarayıcı Console'u aç (F12):**

✅ **İyi durumlar:**
```
Connecting to: https://karar-yilani-server.onrender.com
✅ Connected to server: abc123
```

❌ **Kötü durumlar:**
```
Connecting to: undefined
🔴 Connection error: ...
```

### 3. Console'da Ne Görmelisin

**Doğru bağlantı:**
```javascript
Connecting to: https://karar-yilani-server.onrender.com
✅ Connected to server: FgH7jK9L
```

**CORS hatası:**
```javascript
🔴 Connection error: Error: CORS policy blocked
```

**Fix:** Render'da `CORS_ORIGIN` kontrol et

**Backend bulunamıyor:**
```javascript
Connecting to: undefined
🔴 Connection error: ...
```

**Fix:** Vercel'de `VITE_API_URL` kontrol et ve redeploy

---

## 🔍 Debug Adımları

### 1. Render Logs'u İncele
```
Render Dashboard → karar-yilani-server → Logs
```

**Aranacak şeyler:**
```
🐍 Karar Yılanı Server running on port 10000
Environment: production
```

**Hata varsa:**
```
Error: Cannot find module...
npm ERR! ...
```

### 2. Vercel Build Logs
```
Vercel Dashboard → Deployments → Latest → View Function Logs
```

**Başarılı build:**
```
✓ built in 1.23s
```

**Başarısız build:**
```
✗ Build failed
```

### 3. Network Tab (Chrome DevTools)

1. F12 → Network sekmesi
2. "OYNA" butonuna tıkla
3. İstek gönderildi mi?

**WebSocket bağlantısı:**
```
Status: 101 Switching Protocols  ✅
Status: 404 Not Found            ❌
Status: CORS error               ❌
```

---

## 🚨 Yaygın Hatalar ve Çözümleri

### Hata 1: "Connecting to: undefined"

**Sebep:** Environment variable tanımlı değil veya yanlış yazılmış

**Çözüm:**
```bash
# Vercel'de kontrol et:
VITE_API_URL=https://karar-yilani-server.onrender.com

# Prefix MUTLAKA VITE_ ile başlamalı!
```

### Hata 2: "CORS policy blocked"

**Sebep:** Backend'de CORS origin yanlış

**Çözüm:**
```bash
# Render'da kontrol et:
CORS_ORIGIN=https://karar-yilani.vercel.app

# Vercel'in GERÇEK URL'i olmalı (custom domain değil)
```

### Hata 3: "Error: Cannot GET /"

**Sebep:** Yanlış endpoint'e istek atıyor

**Çözüm:**
- Backend'de sadece `/health` endpoint'i var
- Root `/` endpoint'i yok, bu normal
- Socket.io bağlantısı `/socket.io/` üzerinden

### Hata 4: "Cold start timeout"

**Sebep:** Render free tier ilk istekte 30 saniye sürebilir

**Çözüm:**
```bash
# 1. Sabırla bekle (30 saniye)
# 2. Tekrar dene
# 3. UptimeRobot ile ping at (opsiyonel)
```

---

## 📋 Doğru Konfigürasyon

### Render.com (Backend)
```
Name: karar-yilani-server
Region: Frankfurt
Branch: main
Root Directory: server         ← ÖNEMLİ!
Runtime: Node
Build Command: npm install
Start Command: npm start

Environment Variables:
  NODE_ENV=production
  PORT=10000
  CORS_ORIGIN=https://karar-yilani.vercel.app
```

### Vercel (Frontend)
```
Framework Preset: Vite
Root Directory: client          ← ÖNEMLİ!
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
  VITE_API_URL=https://karar-yilani-server.onrender.com
```

---

## 🔄 Yeniden Deploy

### Her İkisini De Yeniden Deploy Et:

**1. Render:**
```
Dashboard → Manual Deploy → Deploy latest commit
```

**2. Vercel:**
```
Dashboard → Deployments → Latest → Redeploy
```

**3. Cache temizle:**
```bash
# Tarayıcıda
Ctrl + Shift + R (hard refresh)
# veya
F12 → Network tab → "Disable cache" ✓
```

---

## ✅ Başarılı Deployment Kriterleri

1. ✅ Render `/health` endpoint'i 200 döndürüyor
2. ✅ Vercel sitesi açılıyor
3. ✅ Console'da "Connected to server" mesajı var
4. ✅ Nickname girip "OYNA" çalışıyor
5. ✅ 2 tarayıcıda aynı odaya düşebiliyor

---

## 💡 Pro İpuçları

### Backend URL'i Konsol'da Test Et:
```javascript
// Tarayıcı console'da:
console.log(import.meta.env.VITE_API_URL)
// Çıktı: https://karar-yilani-server.onrender.com
```

### Manuel Socket Test:
```javascript
// Console'da:
import('socket.io-client').then(module => {
  const io = module.io;
  const socket = io('https://karar-yilani-server.onrender.com');
  socket.on('connect', () => console.log('CONNECTED!'));
});
```

### Render Health Check:
```bash
curl https://karar-yilani-server.onrender.com/health
```

Beklenen:
```json
{"status":"ok","rooms":[],"timestamp":"..."}
```

---

Hala çalışmıyorsa:
1. Screenshot'lar al (Render logs, Vercel settings, browser console)
2. Tam hata mesajlarını paylaş
3. URL'leri paylaş (hem Render hem Vercel)
