import '../../styles/components/home/WhyUsSection.css'

const WhyUsSection = () => {
  const features = [
    {
      icon: '📊',
      title: 'تقارير دقيقة',
      description: 'نظام ذكي لتتبع الأرباح، الحضور، والمدفوعات'
    },
    {
      icon: '⚙️',
      title: 'سهولة الاستخدام',
      description: 'واجهة مبسطة تناسب جميع المستويات'
    },
    {
      icon: '☁️',
      title: 'إدارة سحابية',
      description: 'إمكانية الوصول من أي مكان وفي أي وقت'
    },
    {
      icon: '🔔',
      title: 'إشعارات فورية',
      description: 'تنبيهات فورية للطلاب والمعلمين حول الحصص والتغييرات'
    }
  ]

  return (
    <section className="why-us-section">
      <div className="container">
        <h2 className="section-title">لماذا نظام المعهد العام؟</h2>
        <div className="why-us-grid">
          {features.map((feature, index) => (
            <div key={index} className="why-us-card">
              <div className="why-us-icon">{feature.icon}</div>
              <h3 className="why-us-title">{feature.title}</h3>
              <p className="why-us-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUsSection

