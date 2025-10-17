import './Select.css'

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  const selectClass = `form-select ${error ? 'error' : ''} ${className}`.trim()

  return (
    <div className="select-group">
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={selectClass}
        required={required}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  )
}

export default Select
