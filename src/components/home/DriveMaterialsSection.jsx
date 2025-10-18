import '../../styles/components/home/DriveMaterialsSection.css'

const DriveMaterialsSection = () => {
  const gradeLevels = [
    {
      name: 'ابتدائي',
      english: 'ELEMENTARY',
      bgColor: '#FFF5F5',
      iconBg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      icon: '📚',
      description: 'مواد دراسية للمرحلة الابتدائية',
      link: 'https://drive.google.com'
    },
    {
      name: 'متوسط',
      english: 'MIDDLE',
      bgColor: '#F0FDFA',
      iconBg: 'linear-gradient(135deg, #4ECDC4 0%, #6EE5DD 100%)',
      icon: '📖',
      description: 'مواد دراسية للمرحلة المتوسطة',
      link: 'https://drive.google.com'
    },
    {
      name: 'ثانوي',
      english: 'HIGH',
      bgColor: '#F0F9FF',
      iconBg: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      icon: '📘',
      description: 'مواد دراسية للمرحلة الثانوية',
      link: 'https://drive.google.com'
    }
  ]

  return (
    <section className="drive-materials-section">
      <div className="container">
        <h2 className="section-title">المواد الدراسية</h2>
        <p className="section-subtitle">احصل على جميع المواد الدراسية من Google Drive</p>
        
        <div className="drive-grid">
          {gradeLevels.map((level, index) => (
            <div 
              key={index} 
              className="drive-card"
              style={{ '--card-bg': level.bgColor, '--icon-gradient': level.iconBg }}
            >
              <div className="drive-icon-wrapper">
                <div className="drive-icon">{level.icon}</div>
              </div>
              <div className="drive-content">
                <div className="drive-english">{level.english}</div>
                <h3 className="drive-name">{level.name}</h3>
                <p className="drive-description">{level.description}</p>
                <a 
                  href={level.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="drive-button"
                >
                  <span className="button-text">فتح Drive</span>
                  <span className="button-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DriveMaterialsSection

