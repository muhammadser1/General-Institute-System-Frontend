import '../../styles/components/home/FeaturesSection.css'

const FeaturesSection = () => {
  const features = [
    {
      icon: '📚',
      title: 'إدارة الدروس',
      description: 'إنشاء وإدارة الدروس بسهولة'
    },
    {
      icon: '💰',
      title: 'تتبع الأرباح',
      description: 'متابعة أرباحك وسجل المدفوعات'
    },
    {
      icon: '👥',
      title: 'إدارة الطلاب',
      description: 'تتبع جميع طلابك'
    },
    {
      icon: '📊',
      title: 'لوحة التحكم',
      description: 'عرض الإحصائيات والتحليلات'
    }
  ]

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">المميزات الرئيسية</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

