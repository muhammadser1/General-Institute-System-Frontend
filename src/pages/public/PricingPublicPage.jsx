import { useIsMobile } from '../../hooks/useMediaQuery'
import PricingPublicPageDesktop from './PricingPublicPageDesktop'
import PricingPublicPageMobile from './PricingPublicPageMobile'

const PricingPublicPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <PricingPublicPageMobile /> : <PricingPublicPageDesktop />
}

export default PricingPublicPage
