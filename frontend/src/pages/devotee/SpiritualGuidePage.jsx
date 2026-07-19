import Header from "../../components/SpiritualGuide/Header";
import NavigationTabs from "../../components/SpiritualGuide/NavigationTabs";
import SpiritualHeroCarousel from "../../components/SpiritualGuide/SpiritualHeroCarousel";
import ImmersiveVirtualTour from "../../components/SpiritualGuide/ImmersiveVirtualTour";
import DailySpiritualHub from "../../components/SpiritualGuide/DailySpiritualHub";


export default function SpiritualGuidePage() {

  return (
  <div className="min-h-screen bg-orange-50">

    <Header />

    <NavigationTabs />

    <section id="hero">
      <SpiritualHeroCarousel />
    </section>

    <section id="virtual-tour">
      <ImmersiveVirtualTour />
    </section>

    <section id="daily-prayer">
      <DailySpiritualHub />
    </section>

  </div>
);
}