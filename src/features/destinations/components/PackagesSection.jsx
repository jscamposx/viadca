import React, { useRef, useCallback, useEffect, useState } from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const scrollBy = useCallback((dir) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
            {progressive ? childArray.slice(0, visibleCount) : childArray}
          </div>
        )}

        {showCarousel && (
          <div className="relative group overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 lg:gap-7 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-transparent overscroll-x-contain"
            >
              {childArray.map((ch, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[84%] max-[360px]:w-[82%] xs:w-[88%] sm:w-[300px] md:w-[320px] lg:w-[340px] first:ml-1 last:mr-1"
                >
                  {ch}
                </div>
              ))}
            </div>
            {/* Controles */}
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Desplazar a la izquierda"
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Desplazar a la derecha"
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
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
