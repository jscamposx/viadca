import React, { useRef, useCallback } from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PackagesSection = ({
  id,
  title,
  description,
  children,
  carousel = false,
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

  return (
    <section id={id} className="py-14 sm:py-16 lg:py-20">
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
            <a
              href="#top"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto"
            >
              Volver arriba
            </a>
          </div>
        </AnimatedSection>

        {!showCarousel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {children}
          </div>
        )}

        {showCarousel && (
          <div className="relative group">
            <div
              ref={scrollRef}
              className="flex gap-6 lg:gap-7 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-transparent"
            >
              {childArray.map((ch, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[260px] sm:w-[300px] md:w-[320px] lg:w-[340px] first:ml-1 last:mr-1"
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
      </div>
    </section>
  );
};

export default PackagesSection;
