import { useState, useRef, useEffect } from 'react'
import './SearchableSelect.css'

const SearchableSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'اختر...', 
  label,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Get the selected option label
  const selectedOption = options.find(opt => opt.id === value)
  const displayValue = selectedOption ? selectedOption.name : placeholder

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort options alphabetically
  const sortedOptions = [...filteredOptions].sort((a, b) => 
    a.name.localeCompare(b.name, 'ar')
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionId) => {
    onChange(optionId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="searchable-select" ref={dropdownRef}>
      {label && <label className="searchable-select-label">{label}</label>}
      
      <div 
        className={`searchable-select-input ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'selected' : 'placeholder'}>
          {displayValue}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="searchable-select-dropdown">
          <input
            type="text"
            className="searchable-select-search"
            placeholder="ابحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          
          <div className="searchable-select-options">
            {sortedOptions.length === 0 ? (
              <div className="searchable-select-option no-results">
                لا توجد نتائج
              </div>
            ) : (
              sortedOptions.map((option) => (
                <div
                  key={option.id}
                  className={`searchable-select-option ${value === option.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.id)}
                >
                  {option.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect

