import '../../styles/components/home/InfoSection.css'

const InfoSection = () => {
  const infoCards = [
    {
      title: 'للمعلمين',
      description: 'إدارة دروسك، طلابك، وأرباحك في مكان واحد'
    },
    {
      title: 'للإدارة',
      description: 'إدارة المعلمين، الطلاب، والمدفوعات بسهولة'
    }
  ]

  return (
    <section className="info-section">
      <div className="container">
        <div className="info-grid">
          {infoCards.map((card, index) => (
            <div key={index} className="info-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InfoSection

