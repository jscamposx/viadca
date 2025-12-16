import React from "react";
import { useLocation } from "react-router-dom";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import PageTransition from "../../../components/ui/PageTransition";
import { useContactInfo } from "../../../hooks/useContactInfo";
import { useSEO } from "../../../hooks/useSEO";
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
  const location = useLocation();

  const canonical = `https://www.viadca.app${location.pathname}`;

  useSEO({
    title: "Agencia de viajes en Durango | Viadca: paquetes nacionales e internacionales",
    description:
      "Agencia de viajes en Durango. Paquetes nacionales e internacionales, tours, bloqueos anticipados y pagos en meses con costo financiero. Asesoría personalizada y soporte 24/7.",
    keywords: [
      "agencia de viajes Durango",
      "agencia de viajes en Durango",
      "viajes Durango",
      "tours desde Durango",
      "paquetes nacionales",
      "paquetes internacionales",
      "bloqueos de viaje",
      "pagos a meses",
      "viajar desde Durango",
      "cotizar viaje Durango",
      "viajes todo incluido",
      "viajes familiares",
      "viajes corporativos",
      "turismo Durango",
      "mejores agencias de viajes Durango",
    ],
    canonical,
    themeColor: "#0f172a",
    og: {
      title: "Viadca | Agencia de viajes en Durango",
      description:
        "Paquetes nacionales e internacionales, bloqueos anticipados y soporte 24/7. Cotiza tu viaje con Viadca.",
      url: canonical,
      image: "https://www.viadca.app/HomePage/Hero-Image.avif",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Viadca | Agencia de viajes en Durango",
      description:
        "Viaja con respaldo: paquetes nacionales e internacionales, bloqueos anticipados y pagos en meses.",
      image: "https://www.viadca.app/HomePage/Hero-Image.avif",
    },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "Viadca Agencia de Viajes",
        url: canonical,
        image: "https://www.viadca.app/HomePage/Hero-Image.avif",
        logo: "https://www.viadca.app/HomePage/logo1.avif",
        description:
          "Agencia de viajes en Durango: paquetes nacionales e internacionales, bloqueos anticipados, pagos en meses con costo financiero y soporte 24/7.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Durango",
          addressRegion: "DGO",
          addressCountry: "MX",
        },
        areaServed: ["Durango", "México"],
        priceRange: "$$",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "24",
        },
        review: [
          {
            "@type": "Review",
            reviewBody:
              "Me ayudó mucho para planear y hacer realidad mi viaje a Las Vegas.",
            author: {
              "@type": "Person",
              name: "Ana Victoria Huerta Alcantar",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
        ],
      },
    ],
  });

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
