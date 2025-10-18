import { Link } from 'react-router-dom'
import '../../styles/components/layout/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🎓</span>
          <span className="footer-text">نظام المعهد العام</span>
        </div>
        
        <div className="footer-links">
          <Link to="/" className="footer-link">الرئيسية</Link>
          <Link to="/about" className="footer-link">من نحن</Link>
          <Link to="/contact" className="footer-link">اتصل بنا</Link>
          <Link to="/pricing" className="footer-link">الأسعار</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 نظام المعهد العام. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  )
}

export default Footer
