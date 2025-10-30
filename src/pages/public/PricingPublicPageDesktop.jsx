import { useState, useEffect } from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import { pricingService } from '../../services/pricingService'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'
import '../../styles/pages/public/PricingPublicPage.css'

const PricingPublicPageDesktop = () => {
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
    <div className="pricing-public-page pricing-public-page-desktop">
      <PublicHeader />
      
      <div className="pricing-container">
        <div className="page-header">
          <h1 className="page-title">الأسعار</h1>
          <p className="page-subtitle">أسعار الدروس الفردية والجماعية لجميع المواد</p>
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
            جميع المراحل
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
          <div className="pricing-table-wrapper">
            <table className="public-pricing-table">
              <thead>
                <tr>
                  <th rowSpan="2">المادة</th>
                  {selectedLevel === 'all' && <th colSpan="2">ابتدائي</th>}
                  {(selectedLevel === 'all' || selectedLevel === 'elementary') && selectedLevel !== 'middle' && selectedLevel !== 'secondary' && <th colSpan="2">ابتدائي</th>}
                  {selectedLevel === 'all' && <th colSpan="2">اعدادي</th>}
                  {(selectedLevel === 'all' || selectedLevel === 'middle') && selectedLevel !== 'elementary' && selectedLevel !== 'secondary' && <th colSpan="2">اعدادي</th>}
                  {selectedLevel === 'all' && <th colSpan="2">ثانوي</th>}
                  {(selectedLevel === 'all' || selectedLevel === 'secondary') && selectedLevel !== 'elementary' && selectedLevel !== 'middle' && <th colSpan="2">ثانوي</th>}
                </tr>
                <tr>
                  {(selectedLevel === 'all' || selectedLevel === 'elementary') && (
                    <>
                      <th>فردي</th>
                      <th>جماعي</th>
                    </>
                  )}
                  {(selectedLevel === 'all' || selectedLevel === 'middle') && (
                    <>
                      <th>فردي</th>
                      <th>جماعي</th>
                    </>
                  )}
                  {(selectedLevel === 'all' || selectedLevel === 'secondary') && (
                    <>
                      <th>فردي</th>
                      <th>جماعي</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.keys(filteredPricing).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      لا توجد أسعار متاحة
                    </td>
                  </tr>
                ) : (
                  Object.entries(filteredPricing)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([subject, levels]) => (
                      <tr key={subject}>
                        <td className="subject-cell">{getSubjectLabel(subject)}</td>
                        {(selectedLevel === 'all' || selectedLevel === 'elementary') && (
                          <>
                            <td>{levels.elementary ? `${levels.elementary.individual.toFixed(2)} ₪` : '-'}</td>
                            <td>{levels.elementary ? `${levels.elementary.group.toFixed(2)} ₪` : '-'}</td>
                          </>
                        )}
                        {(selectedLevel === 'all' || selectedLevel === 'middle') && (
                          <>
                            <td>{levels.middle ? `${levels.middle.individual.toFixed(2)} ₪` : '-'}</td>
                            <td>{levels.middle ? `${levels.middle.group.toFixed(2)} ₪` : '-'}</td>
                          </>
                        )}
                        {(selectedLevel === 'all' || selectedLevel === 'secondary') && (
                          <>
                            <td>{levels.secondary ? `${levels.secondary.individual.toFixed(2)} ₪` : '-'}</td>
                            <td>{levels.secondary ? `${levels.secondary.group.toFixed(2)} ₪` : '-'}</td>
                          </>
                        )}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Info */}
        <div className="pricing-info">
          <div className="info-card">
            <h3>📚 الدروس الفردية</h3>
            <p>دروس خاصة فردية مع المعلم، تركيز كامل على احتياجات الطالب</p>
          </div>
          <div className="info-card">
            <h3>👥 الدروس الجماعية</h3>
            <p>دروس مع مجموعة صغيرة من الطلاب، تفاعل وتعلم جماعي</p>
          </div>
          <div className="info-card">
            <h3>⏰ الأسعار بالساعة</h3>
            <p>جميع الأسعار المعروضة هي بالشيكل لكل ساعة تدريس</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPublicPageDesktop
