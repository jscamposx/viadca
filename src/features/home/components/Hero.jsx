import React from "react";
import { useContactActions } from "../../../hooks/useContactActions";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx";

const Hero = () => {
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="relative min-h-[100svh] md:min-h-[100svh] lg:min-h-[100svh] bg-gradient-to-br from-blue-50 to-orange-50 scroll-mt-32"
      >
        {/* Fondo superior SOLO mobile: transparente */}
        {/* (El degradado se eliminó para dejar el fondo completamente transparente en mobile) */}

        {/* Background Decorations */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-hero-pattern bg-no-repeat bg-right-top opacity-20 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-80 sm:h-80 bg-blue-200 rounded-full opacity-30 md:opacity-25 lg:left-20 lg:translate-x-0 lg:w-96 lg:h-96"
          aria-hidden="true"
        ></div>

        {/* Hero Content - Optimizado para mobile */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-16 md:pt-20 xl:pt-24 2xl:pt-32 pb-8 lg:pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Texto superior SOLO mobile - eliminado */}

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center max-w-3xl md:max-w-4xl lg:max-w-none mx-auto">
              {/* Left Content */}
              <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                <AnimatedSection animation="fadeInLeft" delay={200}>
                  <div className="space-y-4">
                    <p className="text-blue-600 font-bold text-base sm:text-lg lg:text-xl uppercase tracking-wide">
                      VIADCA by Zafiro Tours
                    </p>
                    <p className="text-slate-600 text-sm sm:text-base lg:hidden">
                      Desde Durango para el mundo
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fadeInLeft" delay={400}>
                  <h1
                    id="hero-heading"
                    className="font-volkhov font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-slate-800"
                  >
                    <span className="block">Vive experiencias</span>
                    <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      extraordinarias,
                    </span>
                    <span className="block">viaja sin límites</span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection animation="fadeInLeft" delay={600}>
                  <p className="text-slate-600 text-base sm:text-lg md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Somos tu agencia de viajes de confianza en Durango. Más de 15
                    años creando aventuras únicas, tours personalizados y
                    experiencias inolvidables.
                  </p>
                </AnimatedSection>

                {/* CTA Buttons - Mejorados para mobile */}
                <AnimatedSection animation="fadeInUp" delay={800}>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      aria-label="Planifica tu viaje por WhatsApp"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      className="w-full sm:w-auto border-2 border-slate-300 text-slate-800 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
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

                {/* Stats - Solo visible en desktop */}
                <AnimatedSection animation="fadeInUp" delay={1000}>
                  <div className="hidden lg:flex items-center gap-8 pt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">15+</div>
                      <div className="text-sm text-slate-600 mt-2">
                        Años de experiencia
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        5,000+
                      </div>
                     <div className="text-sm text-slate-600 mt-2">
                        Viajeros felices
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">50+</div>

                      <div className="text-sm text-slate-600 mt-2">Destinos</div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Content - Hero Image optimizada para mobile/tablet y ampliada en laptops */}
              <AnimatedSection animation="fadeInRight" delay={600} className="relative order-first lg:order-last">
                <div className="relative rounded-3xl overflow-visible shadow-none border-0 max-w-xl md:max-w-2xl lg:max-w-none mx-auto xl:pl-6">
                  <OptimizedImage
                    src="/HomePage/Hero-Image.avif"
                    alt="Ilustración de viajero preparando maletas para experiencias de viaje internacionales con la agencia VIADCA en Durango"
                    width={1200}
                    height={800}
                    priority={true}
                    responsive
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 50vw"
                    className="w-full h-auto sm:h-80 md:h-[26rem] lg:h-[30rem] xl:h-[32rem] 2xl:h-[38rem] max-h-[70vh] md:max-h-[65vh] lg:max-h-[68vh] xl:max-h-[70vh] 2xl:max-h-[78vh] object-contain border-0 shadow-none ring-0 outline-none mx-auto"
                    placeholder={false}
                    lazy={false}
                  />

                  {/* Overlay gradient para mobile (transparente) */}
                  <div
                    className="absolute inset-0 bg-transparent lg:hidden pointer-events-none"
                    aria-hidden="true"
                  ></div>
                </div>

                {/* Stats móviles - envueltas en contenedor lg:hidden para asegurar ocultamiento en desktop */}
                <AnimatedSection animation="fadeInUp" delay={1200}>
                  <div className="lg:hidden">
                    <div className="flex justify-center gap-4 mt-6">
                      <div className="bg-white rounded-xl p-4 shadow-none border-0 text-center flex-1 max-w-24">
                        <div className="text-xl font-bold text-blue-600">15+</div>
                        <div className="text-xs text-slate-600">Años</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-none border-0 text-center flex-1 max-w-24">
                        <div className="text-xl font-bold text-green-600">5K+</div>
                        <div className="text-xs text-slate-600">Clientes</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-none border-0 text-center flex-1 max-w-24">
                        <div className="text-xl font-bold text-orange-600">50+</div>
                        <div className="text-xs text-slate-600">Destinos</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Toast montado en portal con diseño centrado, blanco y moderno */}
      <ToastPortal />
    </>
  );
};

export default Hero;
