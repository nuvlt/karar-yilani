function Scoreboard({ time, score, length }) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-item">
        <span className="scoreboard-icon">⏱️</span>
        <span className="scoreboard-value">{time}</span>
      </div>
      
      <div className="scoreboard-item">
        <span className="scoreboard-icon">📊</span>
        <span className="scoreboard-label">Skor:</span>
        <span className="scoreboard-value">{score.toLocaleString()}</span>
      </div>
      
      <div className="scoreboard-item">
        <span className="scoreboard-icon">🐍</span>
        <span className="scoreboard-value">x{length}</span>
      </div>
    </div>
  )
}

export default Scoreboard
