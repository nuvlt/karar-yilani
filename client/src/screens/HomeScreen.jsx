import { useState } from 'react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function HomeScreen({ onStartGame }) {
  const [nickname, setNickname] = useState('')
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (nickname.length < 3) {
      setError('Nickname en az 3 karakter olmalı')
      return
    }
    
    if (nickname.length > 15) {
      setError('Nickname en fazla 15 karakter olabilir')
      return
    }
    
    if (!/^[a-zA-ZğüşöçİĞÜŞÖÇ0-9]+$/.test(nickname)) {
      setError('Sadece harf ve rakam kullanabilirsin')
      return
    }

    // Oda ID varsa validate et
    if (roomId && roomId.length !== 6) {
      setError('Oda ID 6 karakter olmalı (örn: ABC123)')
      return
    }
    
    setError('')
    setIsConnecting(true)
    onStartGame(nickname, roomId.toUpperCase() || null)
  }

  return (
    <div className="screen home-screen">
      <div className="home-container">
        <h1 className="game-title">🐍 KARAR YILANI</h1>
        <p className="game-subtitle">Hayat kararların yılanını büyütsün!</p>
        
        <form onSubmit={handleSubmit} className="nickname-form">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname'ini gir..."
            maxLength={15}
            autoFocus
            disabled={isConnecting}
          />

          <Input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="Oda ID (opsiyonel - örn: ABC123)"
            maxLength={6}
            disabled={isConnecting}
            style={{ marginTop: '12px' }}
          />
          
          {error && <p className="error-message">{error}</p>}
          
          {isConnecting && (
            <p className="info-message" style={{ color: '#00ff88', marginTop: '8px' }}>
              ⏳ Sunucuya bağlanıyor... (30-60 saniye sürebilir)
            </p>
          )}
          
          <Button type="submit" variant="primary" size="large" disabled={isConnecting}>
            {isConnecting ? 'BAĞLANIYOR...' : 'OYNA'}
          </Button>

          <p className="info-text" style={{ fontSize: '12px', marginTop: '12px', opacity: 0.7 }}>
            💡 Arkadaşınla oynamak için aynı Oda ID'yi kullanın
          </p>
        </form>
        
        <div className="home-actions">
          <button className="link-button">Nasıl Oynanır?</button>
          <button className="link-button">🏆 Sıralama</button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
