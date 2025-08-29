import React from 'react';

const CategoryTabs = ({ categories, current, onChange }) => {
  const iconMap = {
    'todos': '🌍',
    'ofertas': '🔥',
    'populares': '⭐',
    'larga': '🗓️',
    'cortos': '⚡'
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/40">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => {
            const active = current === cat.value;
            const icon = iconMap[cat.value] || '📍';
            return (
              <button
                key={cat.value}
                onClick={() => onChange?.(cat.value)}
                className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur border hover:scale-105 ${
                  active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-105' 
                    : 'bg-white/80 text-slate-700 border-slate-200/60 hover:border-blue-300 hover:bg-white hover:shadow-md hover:text-blue-700'
                }`}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span className={`text-base transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {icon}
                  </span>
                  <span>{cat.label}</span>
                </span>
                
                {/* Indicador activo mejorado */}
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white/40 blur-sm" />
                  </div>
                )}
                
                {/* Efecto hover sutil */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} bg-gradient-to-r from-blue-500/10 to-indigo-500/10`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
