import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const PackagesSearchBar = ({ value, onChange, onOpenFilters }) => {
  return (
    <div className="box-border w-full max-w-full min-w-0 overflow-hidden flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md border border-white/50 hover:shadow-lg transition-shadow duration-300" style={{paddingLeft: "max(0.75rem, env(safe-area-inset-left))", paddingRight: "max(0.75rem, env(safe-area-inset-right))"}}>
      <div className="flex-1 min-w-0 relative group">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 transition-colors group-focus-within:text-blue-600" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Buscar destinos, ciudades..."
          className="w-full min-w-0 pl-9 pr-3 py-3 text-sm rounded-lg bg-white/80 focus:bg-white text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 border border-transparent focus:border-blue-200"
        />
      </div>
      <button
        onClick={onOpenFilters}
        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-600 transition-all duration-300 w-full sm:w-auto touch-manipulation"
        type="button"
      >
        <FiSliders className="w-4 h-4" />
        <span>Filtros</span>
      </button>
    </div>
  );
};

export default PackagesSearchBar;
