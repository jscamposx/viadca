import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const PackagesSearchBar = ({ value, onChange, onOpenFilters }) => {
  return (
  <div className="w-full max-w-full flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white/70 backdrop-blur-md rounded-2xl p-4 max-[360px]:p-3 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] border border-white/50">
      <div className="flex-1 min-w-0 relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Buscar destinos, ciudades, tipo..."
          className="w-full pl-12 pr-4 py-3 max-[360px]:pl-10 max-[360px]:py-2.5 rounded-xl bg-white/80 focus:bg-white text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600/50 transition"
        />
      </div>
      <button
        onClick={onOpenFilters}
        className="inline-flex shrink-0 items-center gap-2 px-5 py-3 max-[360px]:px-4 max-[360px]:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow hover:from-blue-700 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition"
        type="button"
      >
        <FiSliders className="w-5 h-5" />
        Filtros
      </button>
    </div>
  );
};

export default PackagesSearchBar;
