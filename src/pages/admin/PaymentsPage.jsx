import { useIsMobile } from '../../hooks/useMediaQuery'
import PaymentsPageDesktop from './PaymentsPageDesktop'
import PaymentsPageMobile from './PaymentsPageMobile'

const PaymentsPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <PaymentsPageMobile /> : <PaymentsPageDesktop />
}

export default PaymentsPage
