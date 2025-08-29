import React from 'react';

const AlphaIndex = ({ letters, onJump, active }) => {
  return (
    <nav className="hidden xl:flex flex-col gap-1 fixed top-1/2 -translate-y-1/2 right-4 z-30 bg-white/70 backdrop-blur rounded-2xl p-2 shadow border border-slate-200" aria-label="Índice alfabético destinos">
      {letters.map(l => (
        <button
          key={l}
          onClick={() => onJump?.(l)}
          className={`w-8 h-8 text-xs font-semibold rounded-lg transition flex items-center justify-center ${active === l ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'}`}
          aria-current={active === l ? 'true' : 'false'}
          type="button"
        >
          {l}
        </button>
      ))}
    </nav>
  );
};

export default AlphaIndex;
