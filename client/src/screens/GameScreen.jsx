import { useState, useEffect, useRef } from 'react'
import GameCanvas from '../components/game/GameCanvas'
import Scoreboard from '../components/game/Scoreboard'
import DecisionPopup from '../components/game/DecisionPopup'
import socket from '../utils/socket'

function GameScreen({ playerData, onGameOver }) {
  const [gameState, setGameState] = useState(null)
  const [currentDecision, setCurrentDecision] = useState(null)
  const [gameTime, setGameTime] = useState(300) // 5 dakika
  const timerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    console.log('GameScreen mounted, waiting for game-update...')

    // Server'dan game state güncellemeleri
    socket.on('game-update', (state) => {
      setGameState(state)
    })

    // Karar tetiklendi
    socket.on('decision-triggered', (decision) => {
      console.log('Decision triggered:', decision)
      setCurrentDecision(decision)
    })

    // Oyun timer'ı
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleGameEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Mouse movement -> server
    const handleMouseMove = (e) => {
      if (!gameState) return
      
      // Canvas pozisyonunu al
      const canvas = document.querySelector('.game-canvas')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // World koordinatlarına çevir (basitleştirilmiş)
      socket.emit('player-input', { x: mouseX, y: mouseY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      socket.off('game-update')
      socket.off('decision-triggered')
      window.removeEventListener('mousemove', handleMouseMove)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState])

  const handleDecisionChoice = (optionId) => {
    if (!currentDecision) return

    const option = currentDecision.options.find(o => o.id === optionId)
    if (!option) return

    // Server'a gönder
    socket.emit('decision-choice', {
      decisionId: currentDecision.id,
      optionIndex: optionId,
      effect: option.effect
    })

    // Popup'ı kapat
    setCurrentDecision(null)
  }

  const handleGameEnd = () => {
    const mySnake = gameState?.snakes.find(s => s.socketId === socket.id)
    
    onGameOver({
      score: mySnake?.score || 0,
      maxLength: mySnake?.length || 5,
      rank: 1,
      totalPlayers: gameState?.snakes.length || 1
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const mySnake = gameState?.snakes.find(s => s.socketId === socket.id)

  return (
    <div className="screen game-screen">
      <Scoreboard
        time={formatTime(gameTime)}
        score={mySnake?.score || 0}
        length={mySnake?.length || 5}
        players={gameState?.snakes || []}
        mySocketId={socket.id}
      />
      
      <GameCanvas 
        playerData={playerData}
        gameState={gameState}
        mySocketId={socket.id}
      />
      
      {currentDecision && (
        <DecisionPopup
          decision={currentDecision}
          onChoice={handleDecisionChoice}
        />
      )}
    </div>
  )
}

export default GameScreen
