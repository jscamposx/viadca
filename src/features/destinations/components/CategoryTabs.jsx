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
    <div 
      ref={scrollContainerRef}
      className="category-tabs-scroll overflow-x-auto overflow-y-hidden py-1"
      style={{ 
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="inline-flex gap-2 lg:justify-center lg:w-full">
        {categories.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              ref={active ? activeButtonRef : null}
              onClick={() => onChange?.(cat.value)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-200 touch-manipulation whitespace-nowrap
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${active 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
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
  );
};

export default CategoryTabs;
