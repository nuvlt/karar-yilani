import { useState, useEffect } from 'react'
import socket from '../utils/socket'

function LobbyScreen({ playerData, roomData }) {
  const [players, setPlayers] = useState(roomData?.players || [])
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Socket event listeners
    socket.on('player-joined', (data) => {
      console.log('Player joined:', data);
      setPlayers(prev => [...prev, { nickname: data.nickname, socketId: data.socketId }]);
    });

    socket.on('player-left', (data) => {
      console.log('Player left:', data);
      setPlayers(prev => prev.filter(p => p.socketId !== data.socketId));
    });

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
      socket.off('player-joined');
      socket.off('player-left');
      clearInterval(countdownInterval)
    }
  }, [])

  return (
    <div className="screen lobby-screen">
      <div className="lobby-container">
        <h2>Oda: #{roomData?.roomId || 'LOADING'}</h2>
        
        <div className="players-section">
          <h3>Oyuncular ({players.length}/16)</h3>
          <ul className="players-list">
            {players.map((player, index) => (
              <li key={player.socketId || index} className="player-item">
                • {player.nickname}
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
