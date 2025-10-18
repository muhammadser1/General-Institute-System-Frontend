import PublicHeader from '../../components/layout/PublicHeader'
import '../../styles/pages/public/PricingPublicPage.css'

const PricingPublicPageDesktop = () => {
  return (
    <div className="pricing-public-page pricing-public-page-desktop">
      <PublicHeader />
      <div className="pricing-content">
        <h1>Pricing Plans</h1>
        <p>Choose the plan that works best for you</p>
      </div>
    </div>
  )
}

export default PricingPublicPageDesktop
