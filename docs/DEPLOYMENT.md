# Deployment Rehberi

## 🚀 Vercel (Frontend)

### Gereksinimler
- Vercel hesabı
- GitHub repository

### Adımlar

1. **GitHub'a push et:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Vercel'e bağlan:**
- https://vercel.com adresine git
- "Import Project" → GitHub repo seç
- Root directory: `client`

3. **Build ayarları:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4. **Environment Variables:**
```
VITE_API_URL=https://karar-yilani-server.onrender.com
```

5. **Deploy et:**
- "Deploy" butonuna tıkla
- 2-3 dakika bekle
- https://karar-yilani.vercel.app adresinde yayında!

### Custom Domain (Opsiyonel)
- Vercel Dashboard → Settings → Domains
- Domain adı ekle (örn: kararylani.com)
- DNS ayarlarını güncelle

---

## 🐍 Render.com (Backend)

### Gereksinimler
- Render.com hesabı
- GitHub repository

### Adımlar

1. **Yeni Web Service oluştur:**
- https://dashboard.render.com → "New" → "Web Service"
- GitHub repo bağla

2. **Ayarlar:**
```
Name: karar-yilani-server
Region: Frankfurt (EU)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

3. **Environment Variables:**
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://karar-yilani.vercel.app
```

4. **Plan seç:**
- Free tier (başlangıç için yeterli)
- Otomatik sleep: 15 dakika inaktif sonra
- Cold start: ~30 saniye

5. **Deploy et:**
- "Create Web Service"
- 5-10 dakika bekle
- https://karar-yilani-server.onrender.com adresinde aktif!

### WebSocket Desteği
Render.com otomatik WebSocket destekler, ekstra ayar gerektirmez.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          cd client
          npm install
          npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### GitHub Secrets Ekle
- Settings → Secrets → Actions
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- RENDER_DEPLOY_HOOK

---

## 🛠️ Alternatif Deployment Seçenekleri

### Railway.app (Backend Alternatif)
**Avantajları:**
- Daha hızlı cold start
- Daha iyi WebSocket performansı
- Free tier: 500 saat/ay

**Kurulum:**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Netlify (Frontend Alternatif)
**Avantajları:**
- Vercel'e çok benzer
- Otomatik SSL
- Edge functions

**Kurulum:**
```bash
npm i -g netlify-cli
netlify init
netlify deploy --prod
```

---

## 📊 Monitoring ve Logging

### Frontend (Vercel)
- Vercel Dashboard → Analytics
- Real-time visitor stats
- Error tracking built-in

### Backend (Render)
- Render Dashboard → Logs
- Real-time log streaming
- Metrics (CPU, Memory, Network)

### Harici Monitoring (Önerilen)
1. **Sentry** (Error tracking)
```bash
npm install @sentry/node
```

2. **Plausible** (Analytics)
```html
<script defer data-domain="kararylani.com" 
  src="https://plausible.io/js/script.js"></script>
```

3. **Uptime Robot** (Uptime monitoring)
- https://uptimerobot.com
- Free 50 monitor
- 5 dakikada bir ping

---

## 🔒 Güvenlik Önlemleri

### Environment Variables
```bash
# .env (production)
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://kararylani.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Rate Limiting
```javascript
// server/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // max 100 request
});
```

### CORS
```javascript
// server/src/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

## 🚨 Troubleshooting

### "Cannot connect to server"
- Backend URL'i kontrol et
- CORS ayarlarını kontrol et
- Render servisinin aktif olduğunu kontrol et

### "Cold start çok uzun"
- Railway'e geç (daha hızlı)
- Paid plan al (always-on)
- Cron job ile ping at (free tier için)

### "WebSocket bağlantısı kesildi"
- Socket.io reconnection ayarlarını kontrol et
- Client tarafında auto-reconnect ekle
- Timeout değerlerini artır

---

## 📈 Ölçeklendirme Planı

### Faz 1: MVP (0-100 kullanıcı)
- Vercel Free
- Render Free
- Tek instance

### Faz 2: Büyüme (100-1000 kullanıcı)
- Vercel Pro ($20/ay)
- Render Standard ($7/ay)
- Horizontal scaling

### Faz 3: Ölçek (1000+ kullanıcı)
- CDN (Cloudflare)
- Redis caching
- Load balancer
- Multiple regions
- Database (PostgreSQL)

---

## ✅ Deployment Checklist

- [ ] GitHub repo oluşturuldu
- [ ] Frontend Vercel'e deploy edildi
- [ ] Backend Render'a deploy edildi
- [ ] Environment variables ayarlandı
- [ ] CORS doğru ayarlandı
- [ ] WebSocket çalışıyor
- [ ] Mobile responsive test edildi
- [ ] SSL sertifikası aktif
- [ ] Custom domain bağlandı (opsiyonel)
- [ ] Monitoring kuruldu
- [ ] Error tracking aktif
- [ ] CI/CD pipeline çalışıyor
