import { useState, useEffect, useRef } from 'react'
import GameCanvas from '../components/game/GameCanvas'
import Scoreboard from '../components/game/Scoreboard'
import DecisionPopup from '../components/game/DecisionPopup'

function GameScreen({ playerData, onGameOver }) {
  const [gameTime, setGameTime] = useState(300) // 5 dakika = 300 saniye
  const [score, setScore] = useState(0)
  const [length, setLength] = useState(5)
  const [showDecision, setShowDecision] = useState(false)
  const [currentDecision, setCurrentDecision] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Oyun timer'ı
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleGameEnd()
          return 0
        }
        
        // Her saniye hayatta kalma bonusu
        setScore(s => s + 5)
        return prev - 1
      })
    }, 1000)

    // Simüle edilmiş karar noktası
    setTimeout(() => {
      triggerDecision()
    }, 5000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const triggerDecision = () => {
    // Mock decision
    const mockDecision = {
      id: 'd001',
      scenario: 'Toplantıya 5 dakika geç kalacaksın!',
      options: [
        {
          label: 'Koşarak git',
          effect: { lengthChange: -3, speedMultiplier: 1.4, scoreBonus: 50 }
        },
        {
          label: 'Yavaş ama sakin git',
          effect: { lengthChange: 2, speedMultiplier: 0.8, scoreBonus: 30 }
        }
      ]
    }
    
    setCurrentDecision(mockDecision)
    setShowDecision(true)
  }

  const handleDecisionChoice = (option) => {
    // Karar etkilerini uygula
    setLength(prev => Math.max(3, prev + option.effect.lengthChange))
    setScore(prev => prev + option.effect.scoreBonus)
    
    setShowDecision(false)
    setCurrentDecision(null)
    
    // Feedback göster (TODO)
    console.log('Karar seçildi:', option.label)
  }

  const handleGameEnd = () => {
    onGameOver({
      score,
      maxLength: length,
      decisions: 1,
      rank: 3,
      totalPlayers: 12
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="screen game-screen">
      <Scoreboard
        time={formatTime(gameTime)}
        score={score}
        length={length}
      />
      
      <GameCanvas playerData={playerData} />
      
      {showDecision && currentDecision && (
        <DecisionPopup
          decision={currentDecision}
          onChoice={handleDecisionChoice}
        />
      )}
    </div>
  )
}

export default GameScreen
