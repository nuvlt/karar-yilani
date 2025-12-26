import { useState } from 'react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function HomeScreen({ onStartGame }) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

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
    
    setError('')
    onStartGame(nickname)
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
          />
          
          {error && <p className="error-message">{error}</p>}
          
          <Button type="submit" variant="primary" size="large">
            OYNA
          </Button>
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
