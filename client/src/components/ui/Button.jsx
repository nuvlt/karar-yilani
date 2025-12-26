function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  size = 'medium',
  disabled = false 
}) {
  const baseClass = 'button'
  const variantClass = `button--${variant}`
  const sizeClass = `button--${size}`
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${sizeClass}`}
    >
      {children}
    </button>
  )
}

export default Button
