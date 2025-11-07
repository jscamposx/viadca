import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const PackagesSearchBar = ({ value, onChange, onOpenFilters }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Barra de búsqueda */}
      <div className="flex-1 relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Buscar destinos, ciudades..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-700 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
          aria-label="Buscar paquetes por destino"
        />
      </div>
      
      {/* Botón de filtros */}
      <button
        onClick={onOpenFilters}
        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all sm:w-auto touch-manipulation"
        type="button"
      >
        <FiSliders className="w-4 h-4" />
        <span>Filtros</span>
      </button>
    </div>
  );
};

export default PackagesSearchBar;
