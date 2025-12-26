# Karar Yılanı - Oyun Kuralları

## 📋 Temel Kurallar

### Oyuna Giriş
1. Nickname gir (3-15 karakter)
2. "OYNA" butonuna tıkla
3. Otomatik olarak bir odaya yerleştirilirsin
4. Oda dolduğunda veya 3 saniye sonra oyun başlar

### Hareket Sistemi
- **Desktop:** Mouse imlecine doğru yılanın gider
- **Mobile:** Dokunulan noktaya doğru yılan gider
- Yılan sürekli hareket eder (duramaz)
- Ani dönüşler yapamaz (max 3° per frame)

### Arena
- **Boyut:** 2000x2000 px sanal grid
- **Sınırlar:** Duvarlara çarpan yılan ölür
- **Spawn:** Oyuncular kenarlardan 200px içeride başlar
- **Başlangıç Uzunluğu:** 5 segment
- **Başlangıç Hızı:** 3 px/frame

## 🎯 Karar Mekanizması

### Karar Noktaları
- Arena'da 8-12 adet aktif karar noktası bulunur
- Parlayan, renkli daire şeklinde (30px çap)
- Üzerinde "?" ikonu vardır
- 20 saniye sonra kaybolur

### Karar Alma Süreci
1. Yılanın başı karar noktasına değer
2. Oyuncu 5 saniye boyunca freeze olur
3. Karar popup'ı açılır
4. 2-3 seçenek sunulur
5. Oyuncu seçim yapar veya zaman aşımı olur
6. Seçilen kararın etkileri uygulanır

### Karar Cooldown
- Karardan sonra 3 saniye başka karar alınamaz
- Aynı karar noktasına başka oyuncu giremez (lock)

## ⚡ Karar Etkileri

### Uzunluk Değişimi
- **Pozitif:** +2 ile +15 segment arası
- **Negatif:** -2 ile -8 segment arası
- Minimum uzunluk: 3 segment

### Hız Değişimi
- **Artış:** %20 - %50 hızlanma (3-8 saniye)
- **Azalma:** %20 - %40 yavaşlama (3-8 saniye)
- Buff süresi bitince normal hıza döner

### Skor Bonusu
- **Küçük:** +30 - +50 puan
- **Orta:** +60 - +100 puan
- **Büyük:** +120 - +200 puan

### Özel Yetenekler (Buff)
- **Hayalet Mod:** 3 saniye duvarlardan geçebilir
- **Hız Patlaması:** 3 saniye %50 daha hızlı

## 💥 Çarpışma Kuralları

### Duvar Çarpışması
- Yılanın başı duvara değerse → ÖLÜM
- Ghost mode buff varsa → Geçer (buff aktifken)

### Yılan Çarpışması
- **Kendi kuyruğuna çarpma:** ÖLÜM
- **Başka yılana çarpma:** ÖLÜM
- Yılanlar birbirini yemez, sadece çarpışır

### Ölüm ve Respawn
- Ölüm anında -100 skor penaltısı
- Yılan 0.5 saniye fade-out olur
- 2 saniye sonra yeni pozisyonda respawn
- Uzunluk 5 segment'e resetlenir
- Toplam skor korunur

## 🏆 Skor Sistemi

### Skor Kazanma
- **Hayatta Kalma:** Her saniye +5 puan
- **Karar Bonusları:** +30 ile +200 arası
- **Maksimum Uzunluk:** Segment başı 10 puan (oyun sonunda)

### Skor Kaybetme
- **Ölme:** -100 puan
- Minimum skor: 0 (negatif olmaz)

### Sıralama Kriterleri (Öncelik Sırasıyla)
1. **Toplam Skor** (ana metrik)
2. Maksimum uzunluk
3. Alınan karar sayısı

## ⏱️ Oyun Süresi

### Süre Sistemi
- Her oyun 5 dakika (300 saniye)
- 4:30'da "30 saniye kaldı!" uyarısı
- 4:50'de "10 saniye kaldı!" uyarısı
- 5:00'da oyun biter

### Oyun Sonu
- Otomatik skor ekranı açılır
- Sıralama gösterilir
- "TEKRAR OYNA" veya "ANA MENÜ" seçenekleri

## 📊 Oyuncu Limitleri

- **Oda Kapasitesi:** 16 oyuncu
- **Minimum Oyuncu:** 2 (test için 1 olabilir)
- **Oda Doluysa:** Yeni oda otomatik açılır

## 🎮 Özel Durumlar

### Bağlantı Koparsa
- Oyuncu 10 saniye bekler
- Yeniden bağlanırsa oyuna devam eder
- Bağlanamazsa otomatik oyundan çıkar

### Afk (Hareketsiz) Oyuncu
- 60 saniye hareket etmezse uyarı
- 90 saniye hareket etmezse otomatik kick

### Tek Oyuncu Kalırsa
- Oyun devam eder
- Zaman dolana kadar oynayabilir
- Sıralamada 1. olur

## 🚫 Yasak Davranışlar

- Hile/cheat kullanımı
- Spam (aşırı hızlı hareket/input)
- Küfür/hakaret içeren nickname
- Bot kullanımı

*Tespit edilirse otomatik kick ve geçici ban*
