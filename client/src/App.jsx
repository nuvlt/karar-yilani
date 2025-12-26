import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import LobbyScreen from './screens/LobbyScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import './styles/App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [playerData, setPlayerData] = useState(null)
  const [gameResults, setGameResults] = useState(null)

  const handleStartGame = (nickname) => {
    setPlayerData({ nickname })
    setCurrentScreen('lobby')
    
    // TODO: Socket bağlantısı ve oda bulma
    // Simüle edilmiş lobby geçişi
    setTimeout(() => {
      setCurrentScreen('game')
    }, 3000)
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
  }

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen onStartGame={handleStartGame} />
      )}
      
      {currentScreen === 'lobby' && (
        <LobbyScreen playerData={playerData} />
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
