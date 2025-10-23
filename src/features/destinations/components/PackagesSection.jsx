import React, { useRef, useCallback, useEffect, useState } from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/destinations.css";

const PackagesSection = ({
  id,
  title,
  description,
  children,
  carousel = false,
  progressive = false,
  initialCount = 8,
  step = 8,
}) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollBy = useCallback((dir) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  // Detectar posición de scroll para mostrar/ocultar flechas
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const atStart = el.scrollLeft <= 10;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    setShowLeftArrow(!atStart);
    setShowRightArrow(!atEnd);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !carousel) return;
    
    // Verificar estado inicial
    handleScroll();
    
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [carousel, handleScroll]);

  const childArray = React.Children.toArray(children);
  const showCarousel = carousel && childArray.length > 1; // activar solo si hay más de un item
  const [visibleCount, setVisibleCount] = useState(
    progressive ? Math.min(initialCount, childArray.length) : childArray.length,
  );

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!progressive) return;
    setVisibleCount(Math.min(initialCount, childArray.length));
  }, [childArray.length, initialCount, progressive]);

  useEffect(() => {
    if (!progressive) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisibleCount((c) => Math.min(c + step, childArray.length));
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [progressive, childArray.length, step]);

  return (
    <section id={id} className="py-14 sm:py-16 lg:py-20 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h2 className="font-volkhov text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
                {title}
              </h2>
              {description && (
                <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                  {description}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>

        {!showCarousel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {progressive ? childArray.slice(0, visibleCount) : childArray}
          </div>
        )}

        {showCarousel && (
          <div className="relative -mx-4 sm:mx-0">
            {/* Gradiente indicador de más contenido a la derecha (mobile) */}
            {showRightArrow && (
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-[5]" />
            )}
            {/* Gradiente indicador de más contenido a la izquierda (mobile) */}
            {showLeftArrow && (
              <div className="md:hidden absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-[5]" />
            )}
            
            <div
              ref={scrollRef}
              className="carousel-scroll flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 px-4 sm:px-0 overscroll-x-contain touch-pan-x scroll-smooth"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {childArray.map((ch, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[85%] xs:w-[80%] sm:w-[280px] md:w-[300px] lg:w-[320px]"
                >
                  {ch}
                </div>
              ))}
            </div>
            {/* Controles de navegación - Mejorados para mejor visibilidad */}
            {showLeftArrow && (
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Desplazar a la izquierda"
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-20 hover:scale-110 active:scale-95"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            )}
            {showRightArrow && (
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Desplazar a la derecha"
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-20 hover:scale-110 active:scale-95"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            )}
            
            {/* Indicador de scroll para mobile */}
            <div className="md:hidden flex justify-center gap-1.5 mt-3">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  showLeftArrow ? 'w-6 bg-blue-600' : 'w-1 bg-slate-300'
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  !showLeftArrow && !showRightArrow ? 'w-6 bg-blue-600' : 'w-1 bg-slate-300'
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  showRightArrow ? 'w-6 bg-blue-600' : 'w-1 bg-slate-300'
                }`}
              />
            </div>
          </div>
        )}

        {/* Sentinel para carga progresiva */}
        {progressive && !showCarousel && (
          <div ref={sentinelRef} className="mt-6">
            {visibleCount < childArray.length && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
                {Array.from({
                  length: Math.min(step, childArray.length - visibleCount),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 bg-slate-100 rounded-xl animate-pulse border border-slate-200"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PackagesSection;
