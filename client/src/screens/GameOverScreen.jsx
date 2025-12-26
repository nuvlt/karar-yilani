import Button from '../components/ui/Button'

function GameOverScreen({ results, onPlayAgain, onMainMenu }) {
  const { score, maxLength, decisions, rank, totalPlayers } = results

  return (
    <div className="screen game-over-screen">
      <div className="game-over-container">
        <h1 className="game-over-title">🎉 OYUN BİTTİ! 🎉</h1>
        
        <div className="player-stats">
          <div className="main-stat">
            <span className="stat-label">Skorun</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          
          <div className="rank-stat">
            Sıralaman: <strong>{rank} / {totalPlayers}</strong>
          </div>
          
          <div className="additional-stats">
            <div className="stat-item">
              <span className="stat-icon">🐍</span>
              <span className="stat-text">Max Uzunluk: {maxLength}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span className="stat-text">Karar Sayısı: {decisions}</span>
            </div>
          </div>
        </div>
        
        <div className="leaderboard">
          <h3>Sıralama</h3>
          <div className="leaderboard-list">
            <div className="leaderboard-item">
              <span className="rank">🥇</span>
              <span className="name">Ayşe</span>
              <span className="score">1,890</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">🥈</span>
              <span className="name">Mehmet</span>
              <span className="score">1,456</span>
            </div>
            <div className="leaderboard-item highlight">
              <span className="rank">🥉</span>
              <span className="name">Sen</span>
              <span className="score">{score.toLocaleString()}</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">4.</span>
              <span className="name">Zeynep</span>
              <span className="score">1,102</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">5.</span>
              <span className="name">Can</span>
              <span className="score">980</span>
            </div>
          </div>
        </div>
        
        <div className="game-over-actions">
          <Button onClick={onPlayAgain} variant="primary" size="large">
            TEKRAR OYNA
          </Button>
          <Button onClick={onMainMenu} variant="secondary" size="large">
            ANA MENÜ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
