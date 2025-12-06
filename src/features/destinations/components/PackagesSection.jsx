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
  const [canScroll, setCanScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0); // 0=inicio, 1=medio, 2=final

  const scrollBy = useCallback((dir) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const amount = el.clientWidth * 0.8 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  // Detectar posición de scroll para mostrar/ocultar flechas e indicadores
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const atStart = el.scrollLeft <= 5;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    const hasOverflow = el.scrollWidth > el.clientWidth;

    setCanScroll(hasOverflow);
    setShowLeftArrow(!atStart && hasOverflow);
    setShowRightArrow(!atEnd && hasOverflow);

    // Calcular posición para indicadores (0=inicio, 1=medio, 2=final)
    if (atStart) {
      setScrollPosition(0);
    } else if (atEnd) {
      setScrollPosition(2);
    } else {
      setScrollPosition(1);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !carousel) return;

    // Verificar estado inicial
    handleScroll();

    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(el);

    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [carousel, handleScroll, children]);

  const childArray = React.Children.toArray(children);
  const showCarousel = carousel && childArray.length > 1;
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
      { rootMargin: "600px 0px", threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [progressive, childArray.length, step]);

  return (
    <section id={id} className="py-10 sm:py-12 lg:py-16 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeUpPremium" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-volkhov text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {title}
              </h2>
              {description && (
                <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>

        {!showCarousel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 py-2">
            {progressive ? childArray.slice(0, visibleCount) : childArray}
          </div>
        )}

        {showCarousel && (
          <div className="relative pt-4 pb-2">
            <div
              ref={scrollRef}
              className="carousel-scroll flex gap-4 sm:gap-5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 py-8"
              style={{
                scrollSnapType: 'x mandatory',
                scrollPadding: '0 1rem',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {childArray.map((ch, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {ch}
                </div>
              ))}
            </div>

            {/* Controles de navegación desktop */}
            {showLeftArrow && (
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Desplazar a la izquierda"
                className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-5 lg:-left-6 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl border border-slate-200 items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-20 hover:scale-110 active:scale-95"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            )}
            {showRightArrow && (
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Desplazar a la derecha"
                className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-5 lg:-right-6 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl border border-slate-200 items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 z-20 hover:scale-110 active:scale-95"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Indicador de posición para mobile - Simplificado */}
            {canScroll && (
              <div className="sm:hidden flex justify-center gap-2 mt-6">
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${scrollPosition === 0 ? 'bg-blue-600 scale-125' : 'bg-slate-300'
                    }`}
                />
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${scrollPosition === 1 ? 'bg-blue-600 scale-125' : 'bg-slate-300'
                    }`}
                />
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${scrollPosition === 2 ? 'bg-blue-600 scale-125' : 'bg-slate-300'
                    }`}
                />
              </div>
            )}
          </div>
        )}

        {/* Sentinel para carga progresiva */}
        {progressive && !showCarousel && (
          <div ref={sentinelRef} className="mt-6 py-2">
            {visibleCount < childArray.length && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {Array.from({
                  length: Math.min(step, childArray.length - visibleCount),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"
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
