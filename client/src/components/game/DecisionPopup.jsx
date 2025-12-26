import { useState, useEffect } from 'react'

function DecisionPopup({ decision, onChoice }) {
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (timeLeft === 0) {
      // Timeout - rastgele seçim yap
      const randomOption = decision.options[
        Math.floor(Math.random() * decision.options.length)
      ]
      onChoice(randomOption)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, decision, onChoice])

  return (
    <div className="decision-overlay">
      <div className="decision-popup">
        <div className="decision-header">
          <h3>Karar Ver!</h3>
          <div className="decision-timer">⏱️ {timeLeft}s</div>
        </div>
        
        <p className="decision-scenario">{decision.scenario}</p>
        
        <div className="decision-options">
          {decision.options.map((option, index) => (
            <button
              key={index}
              className="decision-option"
              onClick={() => onChoice(option)}
            >
              <span className="option-label">{option.label}</span>
              <div className="option-effects">
                {option.effect.lengthChange !== 0 && (
                  <span className={`effect ${option.effect.lengthChange > 0 ? 'positive' : 'negative'}`}>
                    {option.effect.lengthChange > 0 ? '+' : ''}{option.effect.lengthChange} 🐍
                  </span>
                )}
                {option.effect.speedMultiplier !== 1.0 && (
                  <span className={`effect ${option.effect.speedMultiplier > 1 ? 'positive' : 'negative'}`}>
                    {option.effect.speedMultiplier > 1 ? '+' : ''}{((option.effect.speedMultiplier - 1) * 100).toFixed(0)}% ⚡
                  </span>
                )}
                {option.effect.scoreBonus !== 0 && (
                  <span className="effect positive">
                    +{option.effect.scoreBonus} 💯
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DecisionPopup
