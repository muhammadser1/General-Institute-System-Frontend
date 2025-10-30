import { useState, useEffect } from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import { pricingService } from '../../services/pricingService'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import '../../styles/pages/public/PricingPublicPage.css'

const PricingPublicPageMobile = () => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  
  // Subject mapping for Arabic labels
  const subjectLabels = {
    'Arabic': 'عربي',
    'Hebrew': 'עברית',
    'English': 'انجليزي',
    'Math': 'رياضيات',
    'Mathematics': 'رياضيات',
    'History': 'تاريخ',
    'Religion': 'دين',
    'Geography': 'جغرافيا',
    'Physics': 'فيزيا',
    'Electronics': 'מכטרוניקה',
    'Civics': 'מדיניות',
    'Chemistry': 'كيميا',
    'Biology': 'بيولوجيا',
    'Environment': 'بيئه',
    'Technology': 'تكنولوجيا',
    'Computer': 'حاسوب',
    'Science': 'علوم',
    'Adapted Teaching': 'הוראה מותאמת',
    'Architecture': 'אדריכלות',
    'Statistics': 'סטטיסטיקה'
  }
  
  const getSubjectLabel = (subject) => {
    return subjectLabels[subject] || subject
  }
  
  const getEducationLevelLabel = (level) => {
    const labels = {
      'elementary': 'ابتدائي',
      'middle': 'اعدادي',
      'secondary': 'ثانوي'
    }
    return labels[level] || level
  }

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await pricingService.getAllPricing()
        setPricing(response.pricing || [])
      } catch (err) {
        console.error('Error fetching pricing:', err)
        setError('فشل تحميل الأسعار')
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  // Group pricing by subject
  const groupedPricing = pricing.reduce((acc, item) => {
    if (!acc[item.subject]) {
      acc[item.subject] = {}
    }
    acc[item.subject][item.education_level] = {
      individual: item.individual_price,
      group: item.group_price
    }
    return acc
  }, {})

  // Filter by education level
  const filteredPricing = selectedLevel === 'all' 
    ? groupedPricing 
    : Object.fromEntries(
        Object.entries(groupedPricing).map(([subject, levels]) => [
          subject,
          { [selectedLevel]: levels[selectedLevel] }
        ]).filter(([, levels]) => levels[selectedLevel])
      )

  return (
    <div className="pricing-public-page pricing-public-page-mobile">
      <PublicHeader />
      
      <div className="pricing-container">
        <div className="page-header">
          <h1 className="page-title">الأسعار</h1>
          <p className="page-subtitle">أسعار الدروس الفردية والجماعية</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {/* Education Level Filter */}
        <div className="pricing-level-filter">
          <button
            className={`level-btn ${selectedLevel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('all')}
          >
            الكل
          </button>
          <button
            className={`level-btn ${selectedLevel === 'elementary' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('elementary')}
          >
            ابتدائي
          </button>
          <button
            className={`level-btn ${selectedLevel === 'middle' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('middle')}
          >
            اعدادي
          </button>
          <button
            className={`level-btn ${selectedLevel === 'secondary' ? 'active' : ''}`}
            onClick={() => setSelectedLevel('secondary')}
          >
            ثانوي
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="pricing-cards-container">
            {Object.keys(filteredPricing).length === 0 ? (
              <div className="no-results">لا توجد أسعار متاحة</div>
            ) : (
              Object.entries(filteredPricing)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([subject, levels]) => (
                  <div key={subject} className="pricing-mobile-card">
                    <h3 className="card-subject">{getSubjectLabel(subject)}</h3>
                    <div className="card-levels">
                      {Object.entries(levels).map(([level, prices]) => (
                        <div key={level} className="level-prices">
                          <h4 className="level-title">{getEducationLevelLabel(level)}</h4>
                          <div className="prices-row">
                            <div className="price-item">
                              <span className="price-label">فردي:</span>
                              <span className="price-value">{prices.individual.toFixed(2)} ₪</span>
                            </div>
                            <div className="price-item">
                              <span className="price-label">جماعي:</span>
                              <span className="price-value">{prices.group.toFixed(2)} ₪</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Pricing Info */}
        <div className="pricing-info">
          <div className="info-card">
            <h3>📚 الدروس الفردية</h3>
            <p>دروس خاصة فردية مع المعلم</p>
          </div>
          <div className="info-card">
            <h3>👥 الدروس الجماعية</h3>
            <p>دروس مع مجموعة صغيرة من الطلاب</p>
          </div>
          <div className="info-card">
            <h3>⏰ الأسعار بالساعة</h3>
            <p>الأسعار بالشيكل لكل ساعة تدريس</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPublicPageMobile
