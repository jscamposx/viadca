import React from "react";

const CategoryTabs = ({ categories, current, onChange }) => {
  return (
    <div className="box-border w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1">
      <div className="inline-flex gap-2 py-2 whitespace-nowrap">
        {categories.map((cat) => {
          const active = current === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onChange?.(cat.value)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 touch-manipulation ${active ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1`}
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
