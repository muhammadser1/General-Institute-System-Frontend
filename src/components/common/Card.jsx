import './Card.css'

const Card = ({ children, className = '', onClick }) => {
  const cardClass = `card ${className}`.trim()

  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
