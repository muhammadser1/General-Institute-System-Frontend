import { useIsMobile } from '../../hooks/useMediaQuery'
import PricingPageDesktop from './PricingPageDesktop'
import PricingPageMobile from './PricingPageMobile'

const PricingPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <PricingPageMobile /> : <PricingPageDesktop />
}

export default PricingPage
