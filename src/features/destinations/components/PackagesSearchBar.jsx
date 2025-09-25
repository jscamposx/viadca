import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const PackagesSearchBar = ({ value, onChange, onOpenFilters }) => {
  return (
    <div className="box-border w-full max-w-full min-w-0 overflow-hidden flex flex-col sm:flex-row gap-3 sm:gap-4 max-[320px]:gap-2 items-stretch sm:items-center bg-white/80 backdrop-blur-xl rounded-3xl p-4 max-[360px]:p-3 max-[320px]:p-2.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-white/60 hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] hover:bg-white/85 transition-all duration-300 px-4 sm:px-5" style={{paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))"}}>
      <div className="flex-1 min-w-0 relative group">
        <FiSearch className="absolute left-4 max-[320px]:left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-600" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Buscar destinos, ciudades, tipo..."
          className="w-full min-w-0 pl-12 pr-4 py-3 max-[360px]:pl-10 max-[360px]:py-2.5 max-[320px]:pl-9 max-[320px]:py-2 rounded-2xl bg-white/90 focus:bg-white text-slate-700 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/60 focus:shadow-lg transition-all duration-300 border border-transparent focus:border-blue-200/50"
        />
      </div>
      <button
        onClick={onOpenFilters}
        className="inline-flex items-center gap-2 max-[320px]:gap-1 px-5 py-3 max-[360px]:px-4 max-[360px]:py-2.5 max-[340px]:px-3 max-[340px]:py-2 max-[320px]:px-2 max-[320px]:py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold text-sm max-[340px]:text-xs max-[320px]:text-[11px] leading-none shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-all duration-300 hover:scale-[1.02] w-auto min-w-0 max-w-full self-start sm:self-auto whitespace-nowrap"
        type="button"
      >
        <FiSliders className="w-5 h-5 max-[340px]:w-4 max-[340px]:h-4 max-[320px]:w-3.5 max-[320px]:h-3.5" />
        Filtros
      </button>
    </div>
  );
};

export default PackagesSearchBar;
