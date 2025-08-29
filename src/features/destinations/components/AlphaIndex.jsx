import React, { useState } from 'react';

const AlphaIndex = ({ letters, onJump, active }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className="hidden xl:flex flex-col fixed top-1/2 -translate-y-1/2 right-6 z-40 group"
      aria-label="Índice alfabético destinos"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Contenedor principal con glassmorphism mejorado */}
      <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 transition-all duration-500 ${isExpanded ? 'p-3 shadow-xl' : 'p-2'}`}>
        
        {/* Header del índice */}
        <div className={`mb-2 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>
          <div className="text-xs font-bold text-slate-700 text-center mb-1">DESTINOS</div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* Grid de letras */}
        <div className={`grid gap-1 transition-all duration-300 ${isExpanded ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {letters.map((l, index) => (
            <button
              key={l}
              onClick={() => onJump?.(l)}
              className={`relative w-9 h-9 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden group/btn ${
                active === l 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:scale-110'
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
              aria-current={active === l ? 'true' : 'false'}
              type="button"
              title={`Ir a destinos con letra ${l}`}
            >
              {/* Efecto ripple en hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              
              {/* Letra */}
              <span className="relative z-10 transition-transform duration-200 group-hover/btn:scale-110">
                {l}
              </span>
              
              {/* Indicador activo mejorado */}
              {active === l && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer del índice */}
        <div className={`mt-2 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 mt-0 overflow-hidden'}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-1" />
          <div className="text-[10px] text-slate-500 text-center font-medium">
            {letters.length} categorías
          </div>
        </div>
      </div>

      {/* Tooltip expansión */}
      <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100 group-hover:opacity-0'}`}>
        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
          Índice alfabético
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-800" />
        </div>
      </div>
    </nav>
  );
};

export default AlphaIndex;
