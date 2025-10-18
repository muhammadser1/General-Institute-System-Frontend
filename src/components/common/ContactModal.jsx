import { useEffect } from 'react'
import '../../styles/components/common/ContactModal.css'

const ContactModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        
        <h2 className="modal-title">تواصل معنا</h2>
        <p className="modal-subtitle">نحن دائما هنا لمساعدتك</p>

        <div className="contact-cards-modal">
          <div className="contact-card-modal phone-card">
            <div className="card-icon-circle phone-icon">
              <span className="card-icon">📞</span>
            </div>
            <h3 className="card-title-modal">اتصل بنا</h3>
            <p className="card-info">0538250579</p>
          </div>

          <div className="contact-card-modal email-card">
            <div className="card-icon-circle email-icon">
              <span className="card-icon">👨‍💼</span>
            </div>
            <h3 className="card-title-modal">تواصل مع صاحب المعهد</h3>
            <p className="card-info">أو يمكنك التواصل شخصياً</p>
          </div>

          <div className="contact-card-modal support-card">
            <div className="card-icon-circle support-icon">
              <span className="card-icon">💻</span>
            </div>
            <h3 className="card-title-modal">الدعم الفني</h3>
            <p className="card-info">Mohammad Sarahni</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactModal

