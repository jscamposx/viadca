import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiCompass,
  FiPhoneCall,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useContactActions } from "../../../hooks/useContactActions";
import {
  AnimatedSection,
  useSectionReveal,
} from "../../../hooks/scrollAnimations"; // actualizado
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Services = () => {
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal } =
    useContactActions();

  // Hook que detecta la visibilidad de la sección y fuerza todas las animaciones internas
  const [sectionRef, sectionVisible] = useSectionReveal({ threshold: 0.1 });
  // Nuevo: detectar mobile (< lg)
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // nuevo estado para indicadores externos
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023.5px)"); // breakpoint lg tailwind
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="relative overflow-hidden py-10 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-white via-blue-50/40 to-white"
      aria-labelledby="servicios-heading"
    >
      {/* Background Decoration - Oculto en mobile */}
      <div
        className="absolute top-0 right-0 opacity-20 hidden lg:grid lg:grid-cols-5 lg:gap-4 pointer-events-none select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-8 ${i === 10 ? "text-purple" : i === 4 ? "text-orange" : "text-light-gray"}`}
          >
            +
          </div>
        ))}
      </div>

      {/* Blobs decorativos sutiles para profundidad */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-200/60 blur-3xl opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200/50 to-rose-200/50 blur-3xl opacity-40"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Encabezado animado */}
        <AnimatedSection
          animation="fadeInUp"
          className="text-center mb-12 lg:mb-16"
          forceVisible={sectionVisible}
        >
          <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
            NUESTROS SERVICIOS
          </p>
          <h2
            id="servicios-heading"
            className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700"
          >
            Te ofrecemos experiencias completas
          </h2>
          <div
            className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
            aria-hidden="true"
          />
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Descubre nuestros servicios especializados diseñados para hacer de
            tu viaje una experiencia inolvidable
          </p>
        </AnimatedSection>

        {/* Carrusel Mobile */}
        {isMobile && (
          <div className="lg:hidden -mx-4 px-1 pb-8">
            {/* padding extra para indicadores */}
            <Carousel
              showThumbs={false}
              showStatus={false}
              showArrows={false}
              showIndicators={false} // ocultamos los nativos
              emulateTouch
              swipeable
              infiniteLoop
              autoPlay
              interval={6500}
              transitionTime={600}
              dynamicHeight={false}
              selectedItem={currentSlide}
              onChange={(idx) => setCurrentSlide(idx)}
            >
              {/* Slide 1 */}
              <div className="px-3 pb-2">
                <AnimatedSection
                  animation="fadeInUp"
                  delay={0}
                  className="h-full"
                  forceVisible={sectionVisible}
                >
                  {/* Card 1 - Tours Personalizados */}
                  <article
                    className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100 hover:border-orange-300 group h-full"
                    role="article"
                    aria-labelledby="svc-tours-title"
                  >
                    {/* Glow suave */}
                    <span
                      className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-orange-200/0 via-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    {/* Blob de acento */}
                    <span
                      className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-200 to-amber-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                      aria-hidden="true"
                    />

                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-orange-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-orange-300/40"
                      aria-hidden="true"
                    >
                      <FiCompass
                        className="w-7 h-7 lg:w-8 lg:h-8 text-orange-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id="svc-tours-title"
                      className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
                    >
                      Tours Personalizados
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                      Diseñamos itinerarios únicos adaptados a tus gustos,
                      presupuesto y tiempo disponible.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-900">
                        Personalizado
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        Flexibilidad
                      </span>
                    </div>
                  </article>
                </AnimatedSection>
              </div>
              {/* Slide 2 */}
              <div className="px-3 pb-2">
                <AnimatedSection
                  animation="fadeInUp"
                  delay={150}
                  className="h-full"
                  forceVisible={sectionVisible}
                >
                  {/* Card 2 - Destinos Nacionales e Internacionales */}
                  <article
                    className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group h-full"
                    role="article"
                    aria-labelledby="svc-paquetes-title"
                  >
                    <span
                      className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-blue-200/0 via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                      aria-hidden="true"
                    />

                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-blue-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-blue-300/40"
                      aria-hidden="true"
                    >
                      <FiGlobe
                        className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id="svc-paquetes-title"
                      className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
                    >
                      Destinos Nacionales e Internacionales
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                      Explora México y el mundo con nuestros paquetes completos
                      que incluyen vuelos, hospedaje y actividades.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900">
                        Nacional / Internacional
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Todo incluido
                      </span>
                    </div>
                  </article>
                </AnimatedSection>
              </div>
              {/* Slide 3 */}
              <div className="px-3 pb-2">
                <AnimatedSection
                  animation="fadeInUp"
                  delay={300}
                  className="h-full"
                  forceVisible={sectionVisible}
                >
                  {/* Card 3 - Viajes Corporativos */}
                  <article
                    className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100 hover:border-green-300 group h-full"
                    role="article"
                    aria-labelledby="svc-corp-title"
                  >
                    <span
                      className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-green-200/0 via-green-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-green-200 to-emerald-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                      aria-hidden="true"
                    />

                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-green-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-green-300/40"
                      aria-hidden="true"
                    >
                      <FiBriefcase
                        className="w-7 h-7 lg:w-8 lg:h-8 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id="svc-corp-title"
                      className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
                    >
                      Viajes Corporativos
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                      Soluciones empresariales para convenciones, reuniones de
                      trabajo y eventos corporativos.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">
                        Empresarial
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                        Optimización
                      </span>
                    </div>
                  </article>
                </AnimatedSection>
              </div>
              {/* Slide 4 */}
              <div className="px-3 pb-2">
                <AnimatedSection
                  animation="fadeInUp"
                  delay={450}
                  className="h-full"
                  forceVisible={sectionVisible}
                >
                  {/* Card 4 - Asesoría Especializada */}
                  <article
                    className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 hover:border-purple-300 group h-full"
                    role="article"
                    aria-labelledby="svc-asesoria-title"
                  >
                    <span
                      className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-purple-200/0 via-purple-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-purple-200 to-fuchsia-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                      aria-hidden="true"
                    />

                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-purple-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-purple-300/40"
                      aria-hidden="true"
                    >
                      <FiMapPin
                        className="w-7 h-7 lg:w-8 lg:h-8 text-purple-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id="svc-asesoria-title"
                      className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
                    >
                      Asesoría Especializada
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                      Más de 15 años de experiencia respaldándonos para
                      brindarte la mejor asesoría y recomendaciones.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-900">
                        Expertos
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        Confianza
                      </span>
                    </div>
                  </article>
                </AnimatedSection>
              </div>
            </Carousel>
            {/* Indicadores personalizados */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Ir al slide ${i + 1}`}
                  style={{ width: '8px', height: '8px', minWidth: '8px', minHeight: '8px', padding: 0, border: 'none' }}
                  className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 ${currentSlide === i ? "bg-blue-600" : "bg-slate-300 hover:bg-slate-400"}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid Desktop (oculto en mobile) */}
        <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Card 1 */}
          <AnimatedSection
            animation="fadeInUp"
            delay={0}
            className="h-full"
            forceVisible={sectionVisible}
          >
            <article
              className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100 hover:border-orange-300 group h-full"
              role="article"
              aria-labelledby="svc-tours-title"
            >
              {/* Glow suave */}
              <span
                className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-orange-200/0 via-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                aria-hidden="true"
              />
              {/* Blob de acento */}
              <span
                className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-200 to-amber-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                aria-hidden="true"
              />

              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-orange-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-orange-300/40"
                aria-hidden="true"
              >
                <FiCompass
                  className="w-7 h-7 lg:w-8 lg:h-8 text-orange-600"
                  aria-hidden="true"
                />
              </div>
              <h3
                id="svc-tours-title"
                className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
              >
                Tours Personalizados
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                Diseñamos itinerarios únicos adaptados a tus gustos, presupuesto
                y tiempo disponible.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-900">
                  Personalizado
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                  Flexibilidad
                </span>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 2 */}
          <AnimatedSection
            animation="fadeInUp"
            delay={150}
            className="h-full"
            forceVisible={sectionVisible}
          >
            <article
              className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group h-full"
              role="article"
              aria-labelledby="svc-paquetes-title"
            >
              <span
                className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-blue-200/0 via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                aria-hidden="true"
              />

              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-blue-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-blue-300/40"
                aria-hidden="true"
              >
                <FiGlobe
                  className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h3
                id="svc-paquetes-title"
                className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
              >
                Destinos Nacionales e Internacionales
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                Explora México y el mundo con nuestros paquetes completos que
                incluyen vuelos, hospedaje y actividades.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900">
                  Nacional / Internacional
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Todo incluido
                </span>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 3 */}
          <AnimatedSection
            animation="fadeInUp"
            delay={300}
            className="h-full"
            forceVisible={sectionVisible}
          >
            <article
              className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100 hover:border-green-300 group h-full"
              role="article"
              aria-labelledby="svc-corp-title"
            >
              <span
                className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-green-200/0 via-green-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-green-200 to-emerald-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                aria-hidden="true"
              />

              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-green-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-green-300/40"
                aria-hidden="true"
              >
                <FiBriefcase
                  className="w-7 h-7 lg:w-8 lg:h-8 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <h3
                id="svc-corp-title"
                className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
              >
                Viajes Corporativos
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                Soluciones empresariales para convenciones, reuniones de trabajo
                y eventos corporativos.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">
                  Empresarial
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                  Optimización
                </span>
              </div>
            </article>
          </AnimatedSection>

          {/* Card 4 */}
          <AnimatedSection
            animation="fadeInUp"
            delay={450}
            className="h-full"
            forceVisible={sectionVisible}
          >
            <article
              className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 hover:border-purple-300 group h-full"
              role="article"
              aria-labelledby="svc-asesoria-title"
            >
              <span
                className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-purple-200/0 via-purple-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-purple-200 to-fuchsia-200 blur-2xl opacity-40 group-hover:opacity-60 transition"
                aria-hidden="true"
              />

              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-purple-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-purple-300/40"
                aria-hidden="true"
              >
                <FiMapPin
                  className="w-7 h-7 lg:w-8 lg:h-8 text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <h3
                id="svc-asesoria-title"
                className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
              >
                Asesoría Especializada
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
                Más de 15 años de experiencia respaldándonos para brindarte la
                mejor asesoría y recomendaciones.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-900">
                  Expertos
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  Confianza
                </span>
              </div>
            </article>
          </AnimatedSection>
        </div>

        {/* CTA animada */}
        <AnimatedSection
          animation="fadeInUp"
          delay={600}
          className="mt-12 lg:mt-16 text-center"
          forceVisible={sectionVisible}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 border border-blue-200">
            {/* brillo sutil */}
            <span
              className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-blue-200/0 via-indigo-200/20 to-transparent blur-3xl opacity-70"
              aria-hidden="true"
            />

            <h3 className="relative font-semibold text-xl lg:text-2xl text-slate-800 mb-3 lg:mb-4">
              ¿Listo para tu próxima aventura?
            </h3>
            <p className="relative text-slate-600 text-sm lg:text-base mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está aquí para ayudarte a planificar el
              viaje perfecto
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                className="btn-cta-primary w-full sm:w-auto max-w-full sm:max-w-fit bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 md:px-7 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 text-sm md:text-base"
                aria-label="Contactar al equipo por teléfono"
                href={getPhoneHref()}
                onClick={onPhoneClick}
              >
                {/* SVG original del diseño (teléfono con ondas) */}
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Contáctanos</span>
              </a>
              <button
                className="btn-cta-secondary w-full sm:w-auto max-w-full sm:max-w-fit border-2 border-blue-600 text-blue-700 px-6 md:px-7 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 text-sm md:text-base"
                type="button"
                aria-label="Abrir chat en línea por WhatsApp"
                onClick={openWhatsApp}
              >
                <FaWhatsapp
                  className="w-5 h-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>Chatea con nosotros</span>
              </button>
            </div>
            <p className="relative mt-3 text-xs text-slate-500">
              Respuesta en minutos • Atención personalizada
            </p>
          </div>
        </AnimatedSection>
      </div>
      <ToastPortal />
    </section>
  );
};

export default Services;
