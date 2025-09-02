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
                animation="fadeInRight"
                delay={d(400)}
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
                  animation="fadeInLeft"
                  delay={d(150)}
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
                  animation="fadeInLeft"
                  delay={d(300)}
                  forceVisible={heroVisible}
                >
                  <h1
                    id="hero-heading"
                    className="font-volkhov font-bold leading-tight text-slate-800 text-[clamp(2rem,6vw,3.4rem)] sm:text-5xl md:text-6xl xl:text-7xl tracking-tight"
                  >
                    <span className="block">Vive experiencias</span>
                    <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      extraordinarias,
                    </span>
                    <span className="block">viaja sin límites</span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection
                  animation="fadeInLeft"
                  delay={d(450)}
                  forceVisible={heroVisible}
                >
                  <p className="text-slate-600 text-[15px] sm:text-lg md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Más de 15 años diseñando aventuras únicas, tours
                    personalizados y experiencias inolvidables desde Durango.
                  </p>
                </AnimatedSection>

                {/* CTA */}
                <AnimatedSection
                  animation="fadeInUp"
                  delay={d(650)}
                  forceVisible={heroVisible}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      aria-label="Planifica tu viaje por WhatsApp"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 transform flex items-center justify-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span>Planifica tu viaje</span>
                    </button>
                    <a
                      href={getPhoneHref()}
                      onClick={onPhoneClick}
                      aria-label="Contáctanos por teléfono"
                      className="w-full sm:w-auto border-2 border-slate-300 text-slate-800 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-semibold hover:shadow-md sm:hover:shadow-lg hover:scale-[1.02] sm:hover:scale-105 transform flex items-center justify-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>Contáctanos</span>
                    </a>
                  </div>
                </AnimatedSection>

                {/* Stats desktop + versión comprimida mobile */}
                <AnimatedSection
                  animation="fadeInUp"
                  delay={d(850)}
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
