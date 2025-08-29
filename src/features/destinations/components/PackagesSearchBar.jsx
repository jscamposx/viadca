import React, { useState } from 'react';
import { FiSearch, FiSliders, FiMapPin, FiCalendar } from 'react-icons/fi';

const PackagesSearchBar = ({ value, onChange, onOpenFilters }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-white/60 group hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-500">
      {/* Header con stats rápidas */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Encuentra tu próximo destino</h2>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3" />
            200+ destinos
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            Salidas diarias
          </span>
        </div>
      </div>

      {/* Barra de búsqueda mejorada */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch">
        <div className="flex-1 relative group/search">
          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${focused ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 scale-105' : 'bg-transparent'}`} />
          <div className="relative">
            <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? 'text-blue-600' : 'text-slate-400'}`} />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="¿A dónde quieres viajar? Busca destinos, ciudades, países..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 focus:bg-white text-slate-700 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:shadow-lg transition-all duration-300 text-sm font-medium"
            />
            {value && (
              <button
                onClick={() => onChange?.('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <span className="text-xs">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onOpenFilters}
            className="group inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-all duration-300"
            type="button"
          >
            <FiSliders className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          
          <button
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/90 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline">Sorpréndeme</span>
          </button>
        </div>
      </div>

      {/* Sugerencias rápidas */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-slate-600 font-medium">Populares:</span>
        {['Europa', 'Asia', 'Caribe', 'México', 'Estados Unidos'].map((tag) => (
          <button
            key={tag}
            onClick={() => onChange?.(tag)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-100 text-xs text-slate-600 hover:text-blue-700 font-medium transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PackagesSearchBar;
