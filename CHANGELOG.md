# 🎮 Karar Yılanı v2 - Değişiklikler ve Güncelleme

## ✨ Yeni Özellikler

### 1. ✅ Oyun Başlatma Düzeltildi
- Backend'de `game-started` eventi artık gönderiliyor
- Oyun başladığında oyuncular oyun ekranına yönlendiriliyor

### 2. ⏱️ Lobby Süresi Uzatıldı
- **Eski:** 3 saniye → **Yeni:** 30 saniye
- Oyunculara katılmak için daha fazla zaman

### 3. 🎯 Manuel Başlatma Butonu
- İlk odaya katılan oyuncu **"oda kurucusu"** olur
- Oda kurucusuna **"HEMEN BAŞLAT"** butonu görünür
- 30 saniye beklemeden oyunu başlatabilir
- Diğer oyuncular bu butonu görmez

### 4. 🐍 Snake Icon Eklendi
- 404 hatası veren icon sorunu çözüldü
- Basit SVG snake icon eklendi

### 5. 👤 Oyuncu Tanımlama
- Lobby'de kendi nickname'inin yanında **(Sen)** etiketi görünür
- Hangi oyuncunun sen olduğunu kolayca görebilirsin

---

## 🔧 GitHub'a Güncelleme

### Yöntem 1: Zip İndir ve Üzerine Yaz

```bash
# Mevcut klasörüne git
cd karar-yilani

# ZIP'i aç ve dosyaları üzerine kopyala
# Özellikle bu dosyalar değişti:
# - server/src/rooms/GameRoom.js
# - server/src/sockets/socketHandlers.js
# - client/src/screens/LobbyScreen.jsx
# - client/public/snake-icon.svg (YENİ)

# Git commit
git add .
git commit -m "feat: Add manual start, fix game-started event, extend lobby time"
git push origin main
```

### Yöntem 2: Manuel Değişiklikler

Sadece şu dosyaları güncelle:

#### 1. `server/src/rooms/GameRoom.js`
- Constructor'a `autoStartTimeout` ve `creatorId` ekle
- `addPlayer` metodunu güncelle (30 saniye timeout)
- `start` metoduna `broadcast` ekle
- `manualStart` metodu ekle
- `broadcast` helper metod ekle

#### 2. `server/src/sockets/socketHandlers.js`
- `join-game` event'inde `socket` referansını ekle
- `game-joined` emit'ine `isCreator` ekle
- `manual-start` event handler'ı ekle

#### 3. `client/src/screens/LobbyScreen.jsx`
- Countdown'u 30'a çıkar
- `isCreator` state'i ekle
- "HEMEN BAŞLAT" butonu ekle
- Oyuncu listesinde **(Sen)** etiketi göster

#### 4. `client/public/snake-icon.svg` (YENİ DOSYA)
- Basit SVG icon ekle

---

## 🚀 Deploy Sonrası Test

### 1. İki Tarayıcı Aç

**Tarayıcı 1:**
```
https://karar-yilani.vercel.app
Nickname: ali
```

**Tarayıcı 2 (İnkognito):**
```
https://karar-yilani.vercel.app
Nickname: veli
```

### 2. Beklenen Davranış

**Ali'nin ekranı (Oda kurucusu):**
```
Oda: #ABC123

Oyuncular (2/16)
• ali (Sen)
• veli

Oyun 30 saniye içinde başlıyor!

[HEMEN BAŞLAT]  ← Bu buton görünür

⏳
```

**Veli'nin ekranı:**
```
Oda: #ABC123

Oyuncular (2/16)
• ali
• veli (Sen)

Oyun 30 saniye içinde başlıyor!

⏳
```

### 3. Manuel Başlatma Testi

- Ali **"HEMEN BAŞLAT"** butonuna tıklar
- Her iki tarayıcıda da **oyun ekranı açılır**
- Console'da: `Game started!` mesajı görünür

### 4. Otomatik Başlatma Testi

- Kimse butona tıklamazsa
- 30 saniye sonra otomatik başlar

---

## 🐛 Sorun Giderme

### "Manuel başlatma çalışmıyor"

**Kontrol:**
1. Console'da hata var mı?
2. Backend logs'da `manual-start` görünüyor mu?
3. `isCreator` doğru set edilmiş mi?

### "Oyun hala başlamıyor"

**Kontrol:**
1. Console'da `Game started!` mesajı var mı?
2. Backend'de `game-started` emit ediliyor mu?
3. Socket bağlantısı aktif mi?

### "30 saniye çok uzun"

**Değiştirmek için:**

`server/src/rooms/GameRoom.js`:
```javascript
}, 30000); // 15000 yap (15 saniye)
```

`client/src/screens/LobbyScreen.jsx`:
```javascript
const [countdown, setCountdown] = useState(15) // 15 yap
```

---

## 📝 Changelog

### v2.0 (26 Aralık 2024)

**Eklenenler:**
- ✅ Manuel başlatma butonu (oda kurucusu için)
- ✅ Oyuncu tanımlama (Sen) etiketi
- ✅ Snake icon SVG
- ✅ Game-started event broadcast

**Değişenler:**
- ⏱️ Lobby süresi: 3 → 30 saniye
- 🎯 Auto-start: İlk oyuncu sonrası → 30 saniye sonra

**Düzeltilenler:**
- 🐛 Oyun başlamama sorunu
- 🐛 Snake icon 404 hatası

---

## 🎯 Gelecek Özellikler (v3)

- [ ] Özel oda oluşturma (kod ile)
- [ ] Arkadaş davet linki
- [ ] Oda ayarları (oyuncu sayısı, süre)
- [ ] Chat özelliği
- [ ] Spectator modu

---

**Keyifli oyunlar! 🐍🎮**
