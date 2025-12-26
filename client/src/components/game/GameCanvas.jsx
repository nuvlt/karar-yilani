import { useEffect, useRef } from 'react'

function GameCanvas({ playerData }) {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Canvas boyutlarını ayarla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 60 // Header için boşluk
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Basit yılan simulasyonu
    let snakeX = canvas.width / 2
    let snakeY = canvas.height / 2
    let targetX = snakeX
    let targetY = snakeY

    // Mouse/touch event'leri
    const handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    }

    canvas.addEventListener('mousemove', handlePointer)
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      if (e.touches[0]) {
        const rect = canvas.getBoundingClientRect()
        targetX = e.touches[0].clientX - rect.left
        targetY = e.touches[0].clientY - rect.top
      }
    })

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid çiz
      ctx.strokeStyle = '#16213e'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Yılanı hedefe doğru hareket ettir
      const dx = targetX - snakeX
      const dy = targetY - snakeY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 5) {
        const speed = 3
        snakeX += (dx / distance) * speed
        snakeY += (dy / distance) * speed
      }

      // Yılan başı çiz (basitleştirilmiş)
      ctx.fillStyle = '#00ff88'
      ctx.beginPath()
      ctx.arc(snakeX, snakeY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Nickname göster
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(playerData.nickname, snakeX, snakeY - 25)

      // Mock karar noktası
      ctx.fillStyle = '#ffd700'
      ctx.beginPath()
      ctx.arc(canvas.width / 2 + 200, canvas.height / 2, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.font = 'bold 20px Arial'
      ctx.fillText('?', canvas.width / 2 + 200, canvas.height / 2 + 7)

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [playerData])

  return (
    <canvas 
      ref={canvasRef} 
      className="game-canvas"
      style={{ 
        display: 'block',
        cursor: 'none'
      }}
    />
  )
}

export default GameCanvas
