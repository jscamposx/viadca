import React from "react";

const CategoryTabs = ({ categories, current, onChange }) => {
  return (
    <div className="box-border w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain px-2">
      <div className="inline-flex gap-2 sm:gap-4 max-[320px]:gap-1.5 py-1.5 whitespace-nowrap px-0.5">
        {categories.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onChange?.(cat.value)}
              className={`relative flex-shrink-0 min-w-0 px-3 sm:px-5 max-[360px]:px-2.5 max-[320px]:px-2 py-1.5 sm:py-2.5 max-[320px]:py-1 rounded-2xl text-[13px] max-[360px]:text-xs max-[320px]:text-[11px] font-semibold transition-all duration-300 shadow-lg border backdrop-blur-sm hover:scale-[1.02] ${active ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-blue-500/30 scale-[1.02]" : "bg-white/80 text-slate-700 border-slate-200/60 hover:border-slate-300 hover:bg-white/90 shadow-slate-200/50"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              type="button"
            >
              {cat.label}
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white/90 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
