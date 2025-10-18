import { useIsMobile } from '../../hooks/useMediaQuery'
import ContactPageDesktop from './ContactPageDesktop'
import ContactPageMobile from './ContactPageMobile'

const ContactPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <ContactPageMobile /> : <ContactPageDesktop />
}

export default ContactPage

