import '../../styles/components/home/RulesSection.css'

const RulesSection = () => {
  const rules = [
    {
      icon: '📱',
      title: 'إغلاق الهاتف',
      description: 'يجب إغلاق الهاتف المحمول أو وضعه على الوضع الصامت أثناء الدرس'
    },
    {
      icon: '🤐',
      title: 'الهدوء والانضباط',
      description: 'يجب الحفاظ على الهدوء والانضباط داخل قاعات الدراسة'
    },
    {
      icon: '⏰',
      title: 'الالتزام بالمواعيد',
      description: 'يجب الالتزام بمواعيد الدروس والحضور في الوقت المحدد'
    },
    {
      icon: '🚫',
      title: 'منع الغياب',
      description: 'يجب إعلام المعهد مسبقاً في حالة الغياب مع عذر مقبول'
    },
    {
      icon: '🤝',
      title: 'الاحترام المتبادل',
      description: 'يجب الاحترام المتبادل بين الطلاب والمعلمين والإداريين'
    },
    {
      icon: '📝',
      title: 'إكمال الواجبات',
      description: 'يجب إكمال جميع الواجبات والأنشطة في الوقت المحدد'
    }
  ]

  return (
    <section className="rules-section">
      <div className="container">
        <h2 className="section-title">قوانين المعهد</h2>
        <div className="rules-grid">
          {rules.map((rule, index) => (
            <div key={index} className="rule-card">
              <div className="rule-icon">{rule.icon}</div>
              <h3 className="rule-title">{rule.title}</h3>
              <p className="rule-description">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RulesSection

