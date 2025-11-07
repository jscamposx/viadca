import React, { useState, useEffect } from "react";
import { FiX, FiRotateCcw } from "react-icons/fi";

const defaultState = {
  minPrecio: "",
  maxPrecio: "",
  minDuracion: "",
  maxDuracion: "",
  tipos: [],
  continentes: [],
};

const TIPOS = [
  "Circuito",
  "Paquete",
  "Hotel",
  "Vuelo",
  "Traslado",
  "Excursión",
  "Combinado",
  "Crucero",
];
const CONTINENTES = ["América", "Europa", "Asia", "África", "Oceanía"];

const FiltersPanel = ({ open, onClose, onApply, initial }) => {
  const [values, setValues] = useState(defaultState);

  useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
  }, [initial]);

  const update = (patch) => setValues((v) => ({ ...v, ...patch }));
  const toggleFromArray = (key, val) => {
    setValues((v) => ({
      ...v,
      [key]: v[key].includes(val)
        ? v[key].filter((x) => x !== val)
        : [...v[key], val],
    }));
  };
  
  const reset = () => {
    setValues(defaultState);
    // Aplicar automáticamente los filtros vacíos
    onApply?.(defaultState);
    onClose?.();
  };

  const apply = () => {
    onApply?.(values);
    onClose?.();
  };

  // Bloquear scroll del body al abrir y compensar ancho del scrollbar para evitar salto de layout
  useEffect(() => {
    if (open) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;
      document.body.dataset.prevOverflow = prevOverflow || "";
      document.body.dataset.prevPaddingRight = prevPaddingRight || "";
      document.body.style.overflow = "hidden";
      if (sbw > 0) {
        document.body.style.paddingRight = `${sbw}px`;
      }
      return () => {
        document.body.style.overflow = document.body.dataset.prevOverflow || "";
        document.body.style.paddingRight =
          document.body.dataset.prevPaddingRight || "";
        delete document.body.dataset.prevOverflow;
        delete document.body.dataset.prevPaddingRight;
      };
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[999999] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      style={{ isolation: 'isolate' }}
    >
      {/* Overlay oscuro */}
      <div
        className={`absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Panel de filtros */}
      <aside
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-[440px] md:w-[480px] sm:max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col z-[999999] ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de paquetes"
      >
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-slate-200/80 flex-shrink-0 bg-white">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Filtros avanzados
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Personaliza tu búsqueda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-white text-slate-500 hover:text-slate-700 transition-all active:scale-95 border border-transparent hover:border-slate-200 shadow-sm hover:shadow"
            aria-label="Cerrar filtros"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-5 lg:p-6 flex-1 overflow-y-auto space-y-6 sm:space-y-7">
          {/* Precio */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Precio (USD)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Desde</label>
                <input
                  type="number"
                  value={values.minPrecio}
                  placeholder="0"
                  onChange={(e) => update({ minPrecio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Hasta</label>
                <input
                  type="number"
                  value={values.maxPrecio}
                  placeholder="∞"
                  onChange={(e) => update({ maxPrecio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Duración */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duración (días)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Desde</label>
                <input
                  type="number"
                  value={values.minDuracion}
                  placeholder="1"
                  onChange={(e) => update({ minDuracion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Hasta</label>
                <input
                  type="number"
                  value={values.maxDuracion}
                  placeholder="∞"
                  onChange={(e) => update({ maxDuracion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tipo de producto */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tipo de producto
            </h4>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleFromArray("tipos", t)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${values.tipos.includes(t) ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-500/30" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Continente */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continente
            </h4>
            <div className="flex flex-wrap gap-2">
              {CONTINENTES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleFromArray("continentes", c)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border-2 transition-all active:scale-95 ${values.continentes.includes(c) ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer con botones */}
        <div className="p-4 sm:p-5 lg:p-6 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0 bg-white">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-slate-600 hover:text-slate-800 text-sm font-semibold transition-all active:scale-95 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
          >
            <FiRotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
          <button
            onClick={apply}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Aplicar filtros
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FiltersPanel;
