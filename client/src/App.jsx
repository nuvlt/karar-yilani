import { useState, useEffect } from 'react'
import HomeScreen from './screens/HomeScreen'
import LobbyScreen from './screens/LobbyScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import socket from './utils/socket'
import './styles/App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [playerData, setPlayerData] = useState(null)
  const [gameResults, setGameResults] = useState(null)
  const [roomData, setRoomData] = useState(null)

  useEffect(() => {
    // Socket event listeners
    socket.on('game-joined', (data) => {
      console.log('Game joined:', data);
      setRoomData(data);
      setCurrentScreen('lobby');
      
      // Oyun başlamışsa direkt game ekranına git
      if (data.isStarted) {
        setCurrentScreen('game');
      }
    });

    socket.on('game-started', () => {
      console.log('Game started!');
      setCurrentScreen('game');
    });

    socket.on('error', (error) => {
      console.error('Server error:', error);
      alert(error.message || 'Bir hata oluştu!');
    });

    return () => {
      socket.off('game-joined');
      socket.off('game-started');
      socket.off('error');
    };
  }, []);

  const handleStartGame = (nickname, roomId = null) => {
    setPlayerData({ nickname });
    
    // Socket'e bağlan
    if (!socket.connected) {
      socket.connect();
    }
    
    // Oyuna katıl (roomId varsa gönder)
    socket.emit('join-game', { nickname, roomId });
  }

  const handleGameOver = (results) => {
    setGameResults(results)
    setCurrentScreen('gameOver')
  }

  const handlePlayAgain = () => {
    setCurrentScreen('lobby')
    // TODO: Yeni oyun başlat
  }

  const handleMainMenu = () => {
    setCurrentScreen('home')
    setPlayerData(null)
    setGameResults(null)
    setRoomData(null)
    
    // Socket'ten ayrıl
    if (socket.connected) {
      socket.emit('leave-game');
      socket.disconnect();
    }
  }

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen onStartGame={handleStartGame} />
      )}
      
      {currentScreen === 'lobby' && (
        <LobbyScreen playerData={playerData} roomData={roomData} />
      )}
      
      {currentScreen === 'game' && (
        <GameScreen 
          playerData={playerData}
          onGameOver={handleGameOver}
        />
      )}
      
      {currentScreen === 'gameOver' && (
        <GameOverScreen 
          results={gameResults}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  )
}

export default App
