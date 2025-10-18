import PublicHeader from '../../components/layout/PublicHeader'
import Footer from '../../components/layout/Footer'
import '../../styles/pages/public/ContactPage.css'

const ContactPageMobile = () => {
  return (
    <div className="contact-page contact-page-mobile">
      <PublicHeader />
      
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-title">اتصل بنا</h1>
          <p className="contact-subtitle">نحن هنا لمساعدتك في أي وقت</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-cards">
            <div className="contact-card support-card">
              <div className="card-icon">💻</div>
              <h2 className="card-title">الدعم الفني</h2>
              <p className="card-description">
                إذا واجهت أي مشكلة تقنية، تواصل معنا عبر واتساب
              </p>
              <p className="card-availability">متاح 24/7</p>
              <a 
                href="https://wa.me/966538250579" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-btn whatsapp-btn"
              >
                <span className="btn-icon">💬</span>
                تواصل عبر واتساب
              </a>
            </div>

            <div className="contact-card admin-card">
              <div className="card-icon">👨‍💼</div>
              <h2 className="card-title">الإدارة</h2>
              <p className="card-description">
                يمكنك التواصل مع الإدارة مباشرة
              </p>
              <a 
                href="https://wa.me/966538250579" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-btn admin-btn"
              >
                <span className="btn-icon">📞</span>
                تواصل مع الإدارة
              </a>
            </div>
          </div>

          <div className="contact-info">
            <div className="info-item">
              <span className="info-label">الهاتف:</span>
              <span className="info-value">0538250579</span>
            </div>
            <div className="info-item">
              <span className="info-label">الدعم الفني:</span>
              <span className="info-value">Mohammad Sarahni</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ContactPageMobile

