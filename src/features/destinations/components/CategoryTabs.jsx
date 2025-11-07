import React, { useRef, useEffect } from "react";

const CategoryTabs = ({ categories, current, onChange }) => {
  const scrollContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

  // Auto-scroll al tab activo cuando cambia
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeButtonRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      const scrollLeft = button.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [current]);

  return (
    <div className="relative">
      {/* Gradientes indicadores de scroll */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-xl bg-gradient-to-r from-white via-white/80 to-transparent z-10 lg:hidden"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-xl bg-gradient-to-l from-white via-white/80 to-transparent z-10 lg:hidden"
        aria-hidden="true"
      />
      
      <div
        ref={scrollContainerRef}
        className="category-tabs-scroll overflow-x-auto overflow-y-hidden px-2 py-3 sm:py-3.5"
        style={{ 
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="inline-flex lg:flex lg:justify-center gap-2 sm:gap-2.5 min-w-full lg:min-w-0">
          {categories.map((cat) => {
            const active = current === cat.value;
            return (
              <button
                key={cat.value}
                ref={active ? activeButtonRef : null}
                onClick={() => onChange?.(cat.value)}
                className={`
                  flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 touch-manipulation whitespace-nowrap
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                  ${active 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105" 
                    : "bg-white/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  }
                `}
                type="button"
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
