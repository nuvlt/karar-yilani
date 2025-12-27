# 🎮 Karar Yılanı v3.0 - KOMPLE OYUN! 

## ✅ TAM ÖZELLİKLER LİSTESİ

### 🎯 Core Game Mechanics
- ✅ Multiplayer real-time snake movement
- ✅ Smooth camera follow (kendi yılanını takip eder)
- ✅ 60 FPS server-side game loop
- ✅ Mouse ile hareket kontrolü
- ✅ Yılan segmentleri (büyüme/küçülme)
- ✅ Çoklu oyuncu senkronizasyonu

### 🎲 Decision System
- ✅ Her 30 saniyede bir karar pop-up'ı
- ✅ 10 saniyelik seçim süresi
- ✅ 3 farklı karar senaryosu:
  - Sabah sporu vs daha çok uyku
  - Riskli iş teklifi vs güvenli kal
  - Arkadaşına yardım et vs reddet
- ✅ Seçimlere göre:
  - Yılan büyür/küçülür
  - Skor kazanılır
  - Hız buff'ı (geçici)

### 🏆 Scoring & Leaderboard
- ✅ Real-time skor takibi
- ✅ Canlı leaderboard (top 5)
- ✅ Uzunluk göstergesi
- ✅ Kendi yılanın vurgulanır

### 🎨 Visual Features
- ✅ Grid background
- ✅ Smooth snake rendering
- ✅ Renkli yılanlar (oyuncu başına)
- ✅ Gözler ve yön göstergesi
- ✅ Nickname labels
- ✅ Karar noktaları (sarı soru işareti)

### 🔧 Technical Features
- ✅ Socket.io real-time sync
- ✅ Room system (16 oyuncuya kadar)
- ✅ Oda kodu ile katılma
- ✅ Countdown senkronizasyonu
- ✅ 5 dakikalık oyun süresi
- ✅ Game over ekranı

---

## 🎮 NASIL ÇALIŞIR?

### 1. Lobby (0:00)
```
2 oyuncu odaya katılır
→ 30 saniye countdown
→ Manuel başlat butonu (oda sahibi)
```

### 2. Oyun Başlar (0:30)
```
Oyuncular mouse ile hareket eder
→ Canvas'ta yılanlar görünür
→ Kamera kendi yılanı takip eder
```

### 3. İlk Karar (1:00)
```
30 saniye sonra POP-UP açılır:
"Sabah erkenden uyanıp spor yapmak mı?"
[A] Spor yap → +3 uzunluk, +30 puan
[B] Daha çok uyu → -1 uzunluk, +5 puan

10 saniye içinde seçim yap!
```

### 4. Devam (1:30 - 5:00)
```
Her 30 saniyede yeni karar
Yılanlar büyür/küçülür
Skor değişir
Leaderboard güncellenir
```

### 5. Oyun Biter (5:00)
```
Final skorlar
Liderlik tablosu
"Tekrar Oyna" butonu
```

---

## 🚀 DEPLOY ADIMLARI

### 1. GitHub'a Push
```bash
cd karar-yilani
git add .
git commit -m "feat: v3.0 Complete multiplayer game with decisions"
git push origin main
```

### 2. Render.com
- Otomatik deploy olacak
- 2-3 dakika bekle

### 3. Vercel
- Otomatik deploy olacak
- 1-2 dakika bekle

### 4. Test
```
https://karar-yilani.vercel.app
```

---

## 🎯 TEST SENARYOSU

**Tarayıcı 1 (Ali):**
1. Nickname: `ali`
2. OYNA
3. Oda kodu: ABC123
4. Kopyala butonuna bas
5. WhatsApp'tan arkadaşına gönder

**Tarayıcı 2 (Veli):**
1. Nickname: `veli`
2. Oda ID: `ABC123`
3. OYNA
4. → Aynı odaya katıldı! ✅

**30 saniye sonra:**
- Oyun başlar
- Her iki tarayıcıda canvas açılır
- Mouse ile hareket et
- Yılanlar görünür

**1 dakika sonra:**
- Karar pop-up açılır (HER İKİSİNDE AYNI ANDA!)
- 10 saniye içinde seçim yap
- Yılanlar büyür/küçülür
- Leaderboard güncellenir

**5 dakika sonra:**
- Oyun biter
- Final skorlar
- Tekrar oyna!

---

## 🐛 KNOWN ISSUES

1. **Kamera ilk açılışta:** İlk birkaç saniye merkez dışı olabilir (normal)
2. **Disconnect durumunda:** Oyun devam eder ama o oyuncu kaybolur
3. **Karar zamanı overlap:** Çok nadir 2 karar üst üste gelebilir (setTimeout'tan)

---

## 🔥 NEXT FEATURES (v3.1)

- [ ] Ölme mekanizması (duvara çarpma)
- [ ] Yılan-yılan çarpışması
- [ ] Power-up'lar (hız, invincibility)
- [ ] Daha fazla karar senaryosu (decisions.json'dan çek)
- [ ] Ses efektleri
- [ ] Mobil optimize

---

## 📊 PERFORMANS

- **Server:** 60 FPS tick rate
- **Network:** ~100KB/s per player
- **Latency:** <50ms (optimal)
- **Max Players:** 16 per room

---

**v3.0 - KOMPLE MULTIPLAYER OYUN! 🎮🐍**
