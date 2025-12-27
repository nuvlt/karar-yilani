import { useState, useEffect } from 'react'

function DecisionPopup({ decision, onChoice }) {
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    setTimeLeft(10) // Reset
    
    if (timeLeft === 0) {
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, decision])

  return (
    <div className="decision-overlay">
      <div className="decision-popup">
        <div className="decision-header">
          <h3>⚡ KARAR ANI!</h3>
          <div className="decision-timer">⏱️ {timeLeft}s</div>
        </div>
        
        <p className="decision-scenario">{decision.question}</p>
        
        <div className="decision-options">
          {decision.options?.map((option) => (
            <button
              key={option.id}
              className="decision-option"
              onClick={() => onChoice(option.id)}
            >
              <span className="option-label">{option.text}</span>
              <div className="option-effects">
                {option.effect?.lengthChange !== 0 && (
                  <span className={`effect ${option.effect.lengthChange > 0 ? 'positive' : 'negative'}`}>
                    {option.effect.lengthChange > 0 ? '+' : ''}{option.effect.lengthChange} 🐍
                  </span>
                )}
                {option.effect?.speedMultiplier && option.effect.speedMultiplier !== 1.0 && (
                  <span className={`effect ${option.effect.speedMultiplier > 1 ? 'positive' : 'negative'}`}>
                    {option.effect.speedMultiplier > 1 ? '+' : ''}{((option.effect.speedMultiplier - 1) * 100).toFixed(0)}% ⚡
                  </span>
                )}
                {option.effect?.scoreBonus && option.effect.scoreBonus !== 0 && (
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
