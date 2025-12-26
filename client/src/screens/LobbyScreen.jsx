import { useState, useEffect } from 'react'

function LobbyScreen({ playerData }) {
  const [players, setPlayers] = useState([playerData.nickname])
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Simüle edilmiş oyuncu ekleme
    const mockPlayers = ['Ali', 'Veli', 'Ayşe', 'Mehmet', 'Zeynep']
    let currentIndex = 0
    
    const addPlayerInterval = setInterval(() => {
      if (currentIndex < mockPlayers.length) {
        setPlayers(prev => [...prev, mockPlayers[currentIndex]])
        currentIndex++
      }
    }, 500)

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(addPlayerInterval)
      clearInterval(countdownInterval)
    }
  }, [])

  return (
    <div className="screen lobby-screen">
      <div className="lobby-container">
        <h2>Oda: #ABC123</h2>
        
        <div className="players-section">
          <h3>Oyuncular ({players.length}/16)</h3>
          <ul className="players-list">
            {players.map((player, index) => (
              <li key={index} className="player-item">
                • {player}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lobby-status">
          {countdown > 0 ? (
            <p className="starting-message">
              Oyun {countdown} saniye içinde başlıyor!
            </p>
          ) : (
            <p className="starting-message">Başlıyor...</p>
          )}
          
          <div className="loader">⏳</div>
        </div>
      </div>
    </div>
  )
}

export default LobbyScreen
