import PublicHeader from '../../components/layout/PublicHeader'
import Footer from '../../components/layout/Footer'
import WhyUsSection from '../../components/home/WhyUsSection'
import '../../styles/pages/public/AboutPage.css'

const AboutPageDesktop = () => {
  const features = [
    {
      icon: '🎓',
      title: 'رؤيتنا',
      description: 'نطمح لأن نكون المعهد الرائد في تقديم التعليم المتميز والتدريب المهني'
    },
    {
      icon: '💡',
      title: 'مهمتنا',
      description: 'تقديم برامج تعليمية عالية الجودة لتنمية مهارات الطلاب والمعلمين'
    },
    {
      icon: '⭐',
      title: 'قيمنا',
      description: 'نؤمن بالتميز، الاحترافية، والالتزام بتقديم أفضل الخدمات التعليمية'
    }
  ]

  return (
    <div className="about-page about-page-desktop">
      <PublicHeader />
      
      <div className="about-hero">
        <div className="container">
          <h1 className="about-title">من نحن</h1>
          <p className="about-subtitle">نظام المعهد العام - منصة متكاملة لإدارة التعليم</p>
        </div>
      </div>

      <div className="about-intro">
        <div className="container">
          <div className="intro-content">
            <p className="intro-text">
              نظام المعهد العام هو منصة شاملة مصممة خصيصاً لإدارة المعاهد التعليمية بكفاءة عالية. 
              نقدم حلولاً متقدمة لإدارة الدروس، الطلاب، والمعلمين مع تتبع الأرباح والمدفوعات بشكل دقيق.
            </p>
            <p className="intro-text">
              نسعى لتوفير تجربة سهلة ومريحة للمعلمين والإداريين، مع ضمان أعلى معايير الجودة والأمان 
              في إدارة البيانات والمعلومات.
            </p>
          </div>
        </div>
      </div>

      <div className="about-features">
        <div className="container">
          <h2 className="section-title">رؤيتنا ومهمتنا</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WhyUsSection />

      <Footer />
    </div>
  )
}

export default AboutPageDesktop

