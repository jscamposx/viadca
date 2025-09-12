import React from "react";

const CategoryTabs = ({ categories, current, onChange }) => {
  return (
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain px-1">
      <div className="inline-flex gap-2 sm:gap-4 py-1.5">
        {categories.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onChange?.(cat.value)}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition shadow-sm border backdrop-blur ${active ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/20" : "bg-white/70 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-white"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              type="button"
            >
              {cat.label}
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
