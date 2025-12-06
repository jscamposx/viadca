import React, { useEffect, useState } from "react";
import { useContactActions } from "../../../hooks/useContactActions";
import {
  AnimatedSection,
  useSectionReveal,
} from "../../../hooks/scrollAnimations";
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx";

const Hero = () => {
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();

  // Detectar mobile para ajustar delays
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Revelar todo el hero tan pronto como cualquier parte entre al viewport (mobile: inmediato)
  const [heroRef, heroVisible] = useSectionReveal({
    threshold: 0.01,
    rootMargin: isMobile ? "0px 0px 0px 0px" : "0px 0px -5% 0px",
  });

  const d = (base) =>
    isMobile ? Math.min(Math.round(base * 0.35), 180) : base;

  // Inyectar preload de la imagen Hero solo cuando este componente se monta (evita warning en otras rutas)
  useEffect(() => {
    const id = "preload-hero-image";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "preload";
      link.as = "image";
      link.href = "/HomePage/Hero-Image.avif";
      link.type = "image/avif";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        id="hero"
        aria-labelledby="hero-heading"
        className="relative min-h-[100svh] md:min-h-[100svh] lg:min-h-[100svh] bg-gradient-to-br from-blue-50 to-orange-50 scroll-mt-32"
      >
        {/* Fondo decorativo desktop (mobile limpio para foco en contenido) */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-hero-pattern bg-no-repeat bg-right-top opacity-10 pointer-events-none hidden sm:block"
          aria-hidden="true"
        ></div>
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-blue-200 rounded-full opacity-25 md:opacity-20 lg:left-20 lg:translate-x-0 lg:w-96 lg:h-96 blur-2xl"
          aria-hidden="true"
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-14 md:pt-18 xl:pt-24 2xl:pt-28 pb-8 lg:pb-14">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-3xl md:max-w-4xl lg:max-w-none mx-auto">
              {/* Imagen primero en mobile */}
              <AnimatedSection
                animation="scaleInPremium"
                delay={d(200)}
                forceVisible={heroVisible}
                className="relative order-first lg:order-last"
              >
                <div className="relative rounded-3xl overflow-visible max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-none mx-auto">
                  <OptimizedImage
                    src="/HomePage/Hero-Image.avif"
                    alt="Ilustración viajero preparando maletas con agencia de viajes VIADCA"
                    width={1200}
                    height={800}
                    priority={true}
                    responsive
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 50vw"
                    className="w-full h-auto sm:h-80 md:h-[26rem] lg:h-[30rem] xl:h-[32rem] 2xl:h-[38rem] max-h-[60vh] md:max-h-[65vh] object-contain"
                    placeholder={false}
                    lazy={false}
                    fadeIn={false}
                  />
                </div>
              </AnimatedSection>

              {/* Texto */}
              <div className="space-y-6 lg:space-y-8 text-center lg:text-left relative bg-transparent">
                {/* Backdrop sutil solo mobile para mejorar contraste (sin borde ni sombra) */}
                <div className="absolute inset-0 -z-10 rounded-3xl sm:hidden"></div>
                <AnimatedSection
                  animation="fadeUpPremium"
                  delay={d(100)}
                  forceVisible={heroVisible}
                >
                  <div className="space-y-3">
                    <p className="text-blue-600 font-semibold text-sm tracking-wide sm:text-base uppercase">
                      VIADCA by Zafiro Tours
                    </p>
                    <p className="text-slate-600 text-xs sm:text-sm lg:hidden font-medium">
                      Desde Durango para el mundo
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection
                  animation="fadeUpPremium"
                  delay={d(250)}
                  forceVisible={heroVisible}
                >
                  <h1
                    id="hero-heading"
                    className="font-volkhov font-bold leading-tight text-slate-800 text-[clamp(2rem,6vw,3.4rem)] sm:text-5xl md:text-6xl xl:text-7xl tracking-tight"
                  >
                    <span className="block">Vive experiencias</span>
                    <span className="block text-indigo-700">
                      extraordinarias,
                    </span>
                    <span className="block">viaja sin límites</span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection
                  animation="fadeUpPremium"
                  delay={d(400)}
                  forceVisible={heroVisible}
                >
                  <p className="text-slate-600 text-[15px] sm:text-lg md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Más de 15 años diseñando aventuras únicas, tours
                    personalizados y experiencias inolvidables desde Durango.
                  </p>
                </AnimatedSection>

                {/* CTA */}
                <AnimatedSection
                  animation="fadeUpPremium"
                  delay={d(550)}
                  forceVisible={heroVisible}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      aria-label="Planifica tu viaje por WhatsApp"
                      className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 font-semibold hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 transform flex items-center justify-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {/* Icono oficial estilo WhatsApp (SVG) */}
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        fill="currentColor"
                        focusable="false"
                      >
                        <path d="M16.04 3C9.4 3 4 8.4 4 15.05c0 2.65.87 5.11 2.35 7.1L4 29l7.07-2.32a12.97 12.97 0 0 0 4.97 1c6.63 0 12.03-5.4 12.03-12.05C28.07 8.4 22.67 3 16.04 3Zm7.1 17.18c-.3.84-1.73 1.6-2.4 1.7-.62.1-1.4.14-2.26-.14-.52-.17-1.18-.38-2.04-.74-3.6-1.56-5.94-5.2-6.12-5.44-.18-.24-1.46-1.94-1.46-3.7 0-1.76.92-2.63 1.25-2.99.33-.36.72-.45.96-.45.24 0 .48 0 .69.01.22.01.52-.08.82.63.3.7 1.04 2.42 1.13 2.6.09.18.15.4.03.64-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.73.21.36.93 1.53 2 2.48 1.37 1.22 2.48 1.6 2.84 1.78.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.14 1.01 2.5 1.2.36.18.6.27.69.42.09.15.09.87-.21 1.71Z" />
                      </svg>
                      <span className="whitespace-nowrap">Planifica tu viaje</span>
                    </button>
                  </div>
                </AnimatedSection>

                {/* Stats desktop + versión comprimida mobile */}
                <AnimatedSection
                  animation="staggeredReveal"
                  delay={d(700)}
                  forceVisible={heroVisible}
                >
                  <div className="hidden lg:flex items-center gap-8 pt-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        15+
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Años de experiencia
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        5,000+
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Viajeros felices
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        50+
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Destinos
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-1 max-w-xs mx-auto lg:hidden">
                    <div className="bg-white/80 rounded-lg p-2.5 text-center shadow-sm border border-slate-100">
                      <div className="text-sm font-bold text-blue-600">15+</div>
                      <div className="text-[10px] text-slate-600">Años</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2.5 text-center shadow-sm border border-slate-100">
                      <div className="text-sm font-bold text-green-600">
                        5K+
                      </div>
                      <div className="text-[10px] text-slate-600">Clientes</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2.5 text-center shadow-sm border border-slate-100">
                      <div className="text-sm font-bold text-orange-600">
                        50+
                      </div>
                      <div className="text-[10px] text-slate-600">Destinos</div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastPortal />
    </>
  );
};

export default Hero;
