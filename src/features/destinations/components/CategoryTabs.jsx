import React from "react";

const CategoryTabs = ({ categories, current, onChange }) => {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute inset-y-1 left-1 w-6 rounded-l-2xl bg-gradient-to-r from-white via-white/70 to-transparent md:hidden"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-1 right-1 w-6 rounded-r-2xl bg-gradient-to-l from-white via-white/70 to-transparent md:hidden"
        aria-hidden="true"
      />
      <div
        className="category-tabs-scroll box-border w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 py-1.5 sm:py-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="inline-flex w-full sm:w-auto gap-2 py-0.5 whitespace-nowrap items-stretch snap-x snap-mandatory">
          {categories.map((cat) => {
            const active = current === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onChange?.(cat.value)}
                className={`flex-shrink-0 snap-start px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${active ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white/70 text-slate-600 hover:bg-white"}`}
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
