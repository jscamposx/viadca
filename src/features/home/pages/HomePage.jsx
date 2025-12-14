import React from "react";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import PageTransition from "../../../components/ui/PageTransition";
import { useContactInfo } from "../../../hooks/useContactInfo";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Carousel from "../components/Carousel";
import GrowthSection from "../components/GrowthSection";
import Reviews from "../components/Reviews";
import GetStartedSection from "../components/GetStartedSection";
import LegalFoot from "../components/LegalFoot";
import Logos from "../components/Logos";
import Footer from "../components/Footer";

const Home = () => {
  const { contactInfo, loading: contactLoading } = useContactInfo();

  return (
    <>
      <UnifiedNav contactInfo={contactInfo} transparentOnTop={false} hideNavLinks />
      <PageTransition disableAnimations>
        <main id="main-content" role="main" aria-label="Contenido principal" className="min-h-screen bg-white overflow-x-hidden">
          <Hero />
           <Carousel />
          <Features />
         
          <GrowthSection />
          <Reviews />
          <GetStartedSection />
          <LegalFoot />
          <Logos />
          <Footer contactInfo={contactInfo} contactLoading={contactLoading} />
        </main>
      </PageTransition>
    </>
  );
};

export default Home;
