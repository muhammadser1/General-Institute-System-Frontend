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
  className = ''
}) => {
  const inputClass = `form-input ${error ? 'error' : ''} ${className}`.trim()

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        required={required}
        disabled={disabled}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

export default Input
