import { useState, useEffect } from 'react'
import socket from '../utils/socket'

function LobbyScreen({ playerData, roomData }) {
  const [players, setPlayers] = useState(roomData?.players || [])
  const [countdown, setCountdown] = useState(roomData?.remainingCountdown || 30)
  const [isCreator, setIsCreator] = useState(roomData?.isCreator || false)

  useEffect(() => {
    setIsCreator(roomData?.isCreator || false);
    
    // Server'dan countdown başladı event'i geldiğinde
    socket.on('countdown-started', (data) => {
      console.log('Countdown started:', data);
      // Server'dan gelen başlangıç zamanını kullan
      const updateCountdown = () => {
        const elapsed = Date.now() - data.startTime;
        const remaining = Math.max(0, Math.ceil((data.duration - elapsed) / 1000));
        setCountdown(remaining);
        
        if (remaining > 0) {
          requestAnimationFrame(updateCountdown);
        }
      };
      updateCountdown();
    });
    
    // Socket event listeners
    socket.on('player-joined', (data) => {
      console.log('Player joined:', data);
      setPlayers(prev => [...prev, { nickname: data.nickname, socketId: data.socketId }]);
    });

    socket.on('player-left', (data) => {
      console.log('Player left:', data);
      setPlayers(prev => prev.filter(p => p.socketId !== data.socketId));
    });

    return () => {
      socket.off('countdown-started');
      socket.off('player-joined');
      socket.off('player-left');
    }
  }, [roomData])

  const handleManualStart = () => {
    socket.emit('manual-start');
  }

  return (
    <div className="screen lobby-screen">
      <div className="lobby-container">
        <h2>Oda: #{roomData?.roomId || 'LOADING'}</h2>
        
        <div className="players-section">
          <h3>Oyuncular ({players.length}/16)</h3>
          <ul className="players-list">
            {players.map((player, index) => (
              <li key={player.socketId || index} className="player-item">
                • {player.nickname} {player.socketId === socket.id ? '(Sen)' : ''}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lobby-status">
          {countdown > 0 ? (
            <>
              <p className="starting-message">
                Oyun {countdown} saniye içinde başlıyor!
              </p>
              {isCreator && (
                <button 
                  onClick={handleManualStart} 
                  className="button button--primary button--large"
                  style={{ marginTop: '16px' }}
                >
                  HEMEN BAŞLAT
                </button>
              )}
            </>
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
