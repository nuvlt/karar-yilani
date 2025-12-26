# Render.com Configuration

## Web Service Settings

**Health Check Path:**
```
/health
```

**Auto-Deploy:**
```
Yes
```

## Environment Variables (Render Dashboard)

```bash
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://karar-yilani.vercel.app
```

## Important Notes

### WebSocket Support
Render.com **automatically supports WebSocket** connections, but:

1. **Free Tier Limitations:**
   - Cold starts (30s)
   - Auto-sleep after 15 min inactivity
   - WebSocket may disconnect during sleep/wake

2. **Transport Strategy:**
   - Start with HTTP polling (reliable)
   - Upgrade to WebSocket when stable
   - Auto-reconnect on disconnect

### Timeout Settings
```javascript
pingTimeout: 60000    // 60 seconds
pingInterval: 25000   // 25 seconds
connectTimeout: 45000 // 45 seconds
```

These settings help prevent disconnects during:
- Cold starts
- Network hiccups
- Server wake-up from sleep

### Headers Required
Render automatically adds these headers for WebSocket:
- `Connection: Upgrade`
- `Upgrade: websocket`

**No additional configuration needed!**

## Troubleshooting

### "WebSocket connection failed"
**Cause:** Server is waking up from sleep

**Solution:** 
1. Wait 30 seconds and retry
2. Use polling first (already configured)
3. Enable UptimeRobot to prevent sleep

### "Transport close"
**Cause:** Connection timeout during cold start

**Solution:**
- Increased `connectTimeout` to 45s
- Auto-reconnection enabled
- Polling fallback

### Keep Server Awake (Optional)

**UptimeRobot Setup:**
```
URL: https://karar-yilani-server.onrender.com/health
Interval: 5 minutes
Monitor Type: HTTP(s)
```

This prevents free tier sleep mode.

## Health Check Endpoint

Test if server is running:
```bash
curl https://karar-yilani-server.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "rooms": [],
  "timestamp": "2024-12-26T12:00:00.000Z"
}
```
