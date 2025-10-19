import './Input.css'

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  name,
  showIcon = false
}) => {
  const inputClass = `form-input ${error ? 'error' : ''} ${className}`.trim()
  
  // Determine icon based on field type/name (only if showIcon is true)
  const getIcon = () => {
    if (!showIcon) return ''
    if (name === 'username' || name === 'email') return '👤'
    if (name === 'password') return '🔒'
    return ''
  }

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {getIcon() && <span className="input-icon">{getIcon()}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          required={required}
          disabled={disabled}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

export default Input
