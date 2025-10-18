import { Link } from 'react-router-dom'
import '../../styles/components/home/HeroSection.css'

const HeroSection = () => {
  const features = [
    { icon: '📚', title: 'إدارة الدروس', description: 'إنشاء وإدارة الدروس بسهولة' },
    { icon: '💰', title: 'تتبع الأرباح', description: 'متابعة أرباحك وسجل المدفوعات' },
    { icon: '📊', title: 'لوحة التحكم', description: 'عرض الإحصائيات والتحليلات' }
  ]

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-pattern"></div>
        <svg className="hero-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <div className="hero-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
        <div className="hero-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎓</span>
            <span className="badge-text">نظام إدارة متكامل</span>
          </div>
          
          <h1 className="hero-title">
            نظام المعهد العام
            <span className="title-highlight"> لإدارة التعليم</span>
          </h1>
          
          <p className="hero-subtitle">
            منصة شاملة لإدارة الدروس، الطلاب، والأرباح
            <br />
            <span className="subtitle-accent">سهولة في الاستخدام • أمان عالي • تقارير مفصلة</span>
          </p>
          
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              <span className="btn-icon">🔐</span>
              تسجيل الدخول
            </Link>
          </div>

          <div className="hero-feature-cards">
            {features.map((feature, index) => (
              <div key={index} className="hero-feature-card">
                <div className="hero-feature-icon">{feature.icon}</div>
                <h3 className="hero-feature-title">{feature.title}</h3>
                <p className="hero-feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

