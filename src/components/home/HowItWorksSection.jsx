import '../../styles/components/home/HowItWorksSection.css'

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'سجل حسابك',
      description: 'قم بإنشاء حساب جديد كمعلم أو إداري في دقائق معدودة'
    },
    {
      number: '2',
      title: 'ابدأ بإضافة الدروس',
      description: 'أضف دروسك وطلابك وحدد التفاصيل بسهولة'
    },
    {
      number: '3',
      title: 'تابع التقدم',
      description: 'راقب تقدم الطلاب والإحصائيات بشكل مباشر'
    },
    {
      number: '4',
      title: 'احصل على التقارير',
      description: 'قم بإنشاء تقارير مفصلة عن الأداء والأرباح'
    }
  ]

  return (
    <section className="how-it-works-section">
      <div className="container">
        <h2 className="section-title">كيف يعمل النظام؟</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection

