import { useEffect, useRef } from 'react'

function GameCanvas({ playerData, gameState, mySocketId }) {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const cameraRef = useRef({ x: 0, y: 0 })

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

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid çiz
      drawGrid(ctx, canvas)

      // Kamerayı güncelle
      updateCamera(canvas)

      ctx.save()
      ctx.translate(cameraRef.current.x, cameraRef.current.y)

      // Yılanları çiz
      if (gameState?.snakes) {
        gameState.snakes.forEach(snake => {
          drawSnake(ctx, snake, snake.socketId === mySocketId)
        })
      }

      ctx.restore()

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [playerData, gameState, mySocketId])

  const drawGrid = (ctx, canvas) => {
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 1
    
    const gridSize = 50
    const offsetX = cameraRef.current.x % gridSize
    const offsetY = cameraRef.current.y % gridSize
    
    for (let x = offsetX; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = offsetY; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
  }

  const updateCamera = (canvas) => {
    if (!gameState?.snakes || !mySocketId) return

    const mySnake = gameState.snakes.find(s => s.socketId === mySocketId)
    if (!mySnake || !mySnake.segments || mySnake.segments.length === 0) return

    const head = mySnake.segments[0]
    const targetX = canvas.width / 2 - head.x
    const targetY = canvas.height / 2 - head.y

    // Smooth camera
    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.1
    cameraRef.current.y += (targetY - cameraRef.current.y) * 0.1
  }

  const drawSnake = (ctx, snake, isMe) => {
    if (!snake.segments || snake.segments.length === 0) return

    // Renk
    const color = isMe ? '#00ff88' : getSnakeColor(snake.socketId)

    // Segmentleri çiz
    ctx.strokeStyle = color
    ctx.lineWidth = 18
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    snake.segments.forEach((seg, i) => {
      if (i === 0) {
        ctx.moveTo(seg.x, seg.y)
      } else {
        ctx.lineTo(seg.x, seg.y)
      }
    })
    ctx.stroke()

    // Baş çiz
    const head = snake.segments[0]
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(head.x, head.y, 12, 0, Math.PI * 2)
    ctx.fill()

    // Gözler
    const angle = snake.direction || 0
    ctx.fillStyle = '#0a0a1a'
    ctx.beginPath()
    ctx.arc(
      head.x + Math.cos(angle + 0.3) * 6,
      head.y + Math.sin(angle + 0.3) * 6,
      3, 0, Math.PI * 2
    )
    ctx.fill()
    ctx.beginPath()
    ctx.arc(
      head.x + Math.cos(angle - 0.3) * 6,
      head.y + Math.sin(angle - 0.3) * 6,
      3, 0, Math.PI * 2
    )
    ctx.fill()

    // Nickname
    ctx.fillStyle = '#ffffff'
    ctx.font = isMe ? 'bold 14px Arial' : '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(snake.nickname, head.x, head.y - 25)

    // Uzunluk göstergesi
    if (isMe) {
      ctx.fillStyle = '#00ff88'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(`${snake.length}`, head.x, head.y - 40)
    }
  }

  const getSnakeColor = (socketId) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6348', '#95e1d3']
    const hash = socketId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="game-canvas"
      style={{ 
        display: 'block',
        cursor: 'none',
        background: '#0a0a1a'
      }}
    />
  )
}

export default GameCanvas
