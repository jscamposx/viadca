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
  const reset = () => setValues(defaultState);

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
      className={`fixed inset-0 z-[9999] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-[420px] sm:max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col sm:rounded-l-2xl border-l border-slate-200 ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de paquetes"
      >
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">
            Filtros avanzados
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors active:scale-95"
            aria-label="Cerrar filtros"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6 sm:space-y-8">
          {/* Precio */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Precio (USD)
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <input
                type="number"
                value={values.minPrecio}
                placeholder="Mínimo"
                onChange={(e) => update({ minPrecio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
              />
              <input
                type="number"
                value={values.maxPrecio}
                placeholder="Máximo"
                onChange={(e) => update({ maxPrecio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Duración (días)
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <input
                type="number"
                value={values.minDuracion}
                placeholder="Mínimo"
                onChange={(e) => update({ minDuracion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
              />
              <input
                type="number"
                value={values.maxDuracion}
                placeholder="Máximo"
                onChange={(e) => update({ maxDuracion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-shadow"
              />
            </div>
          </div>

          {/* Tipo de producto */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Tipo de producto
            </h4>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleFromArray("tipos", t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${values.tipos.includes(t) ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:bg-blue-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Continente */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Continente
            </h4>
            <div className="flex flex-wrap gap-2">
              {CONTINENTES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleFromArray("continentes", c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${values.continentes.includes(c) ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer con botones */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0 bg-slate-50">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors active:scale-95 hover:bg-white rounded-lg"
          >
            <FiRotateCcw className="w-4 h-4" />
            <span className="hidden xs:inline">Limpiar</span>
          </button>
          <button
            onClick={apply}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Aplicar filtros
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FiltersPanel;
