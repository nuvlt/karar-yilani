function Input({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  maxLength,
  autoFocus = false 
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className="input"
    />
  )
}

export default Input
