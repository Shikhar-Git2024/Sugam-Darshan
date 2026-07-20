import Navbar from "../../components/homepage/Navbar";
import HeroSection from "../../components/homepage/HeroSection";
import LiveInsightsSection from "../../components/homepage/LiveInsightsSection";
import ForecastSection from "../../components/homepage/ForecastSection";
import WhySugamSection from "../../components/homepage/WhySugamSection";
import FeaturesSection from "../../components/homepage/FeaturesSection";
import HowItWorksSection from "../../components/homepage/HowItWorksSection";
import HackathonSection from "../../components/homepage/HackathonSectionNew";
import MissionSection from "../../components/homepage/MissionSection";
import RoleAccessSection from "../../components/homepage/RoleAccessSection";
import FooterSection from "../../components/homepage/FooterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <HeroSection />

      <LiveInsightsSection />

      <ForecastSection />

      <WhySugamSection />

      <FeaturesSection />

      <HowItWorksSection />

      <HackathonSection />

      <MissionSection />

      <RoleAccessSection />

      <FooterSection />
    </>
  );
}