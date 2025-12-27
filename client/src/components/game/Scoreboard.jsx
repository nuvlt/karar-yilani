function Scoreboard({ time, score, length, players, mySocketId }) {
  // Top 5 oyuncu
  const sortedPlayers = players
    ?.sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5) || []

  return (
    <div className="scoreboard">
      <div className="scoreboard-item">
        <span className="scoreboard-icon">⏱️</span>
        <span className="scoreboard-value">{time}</span>
      </div>
      
      <div className="scoreboard-item">
        <span className="scoreboard-icon">📊</span>
        <span className="scoreboard-label">Skor:</span>
        <span className="scoreboard-value">{score?.toLocaleString() || 0}</span>
      </div>
      
      <div className="scoreboard-item">
        <span className="scoreboard-icon">🐍</span>
        <span className="scoreboard-value">x{length || 5}</span>
      </div>

      {sortedPlayers.length > 0 && (
        <div className="scoreboard-leaderboard">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.socketId} 
              className={`leaderboard-item ${player.socketId === mySocketId ? 'is-me' : ''}`}
            >
              <span className="rank">#{index + 1}</span>
              <span className="nickname">{player.nickname}</span>
              <span className="player-score">{player.score || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Scoreboard
