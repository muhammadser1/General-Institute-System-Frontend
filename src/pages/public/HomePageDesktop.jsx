import PublicHeader from '../../components/layout/PublicHeader'
import Footer from '../../components/layout/Footer'
import HeroSection from '../../components/home/HeroSection'
import FeaturesSection from '../../components/home/FeaturesSection'
import RulesSection from '../../components/home/RulesSection'
import HowItWorksSection from '../../components/home/HowItWorksSection'
import DriveMaterialsSection from '../../components/home/DriveMaterialsSection'
import '../../styles/pages/public/HomePage.css'

const HomePageDesktop = () => {
  return (
    <div className="home-page home-page-desktop">
      <PublicHeader />
      <HeroSection />
      <FeaturesSection />
      <RulesSection />
      <HowItWorksSection />
      <DriveMaterialsSection />
      <Footer />
    </div>
  )
}

export default HomePageDesktop
