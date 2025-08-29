import React, { useState, useEffect } from 'react';
import { FiX, FiRotateCcw } from 'react-icons/fi';

const defaultState = {
  minPrecio: '',
  maxPrecio: '',
  minDuracion: '',
  maxDuracion: '',
  tipos: [],
  continentes: []
};

const TIPOS = ['Circuito','Paquete','Hotel','Vuelo','Traslado','Excursión','Combinado','Crucero'];
const CONTINENTES = ['América','Europa','Asia','África','Oceanía'];

const FiltersPanel = ({ open, onClose, onApply, initial }) => {
  const [values, setValues] = useState(defaultState);

  useEffect(() => {
    if (initial) setValues(v => ({ ...v, ...initial }));
  }, [initial]);

  const update = (patch) => setValues(v => ({ ...v, ...patch }));
  const toggleFromArray = (key, val) => {
    setValues(v => ({ ...v, [key]: v[key].includes(val) ? v[key].filter(x => x!==val) : [...v[key], val] }));
  };
  const reset = () => setValues(defaultState);

  const apply = () => {
    onApply?.(values);
    onClose?.();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform duration-500 flex flex-col rounded-none sm:rounded-l-3xl border-l border-slate-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog" aria-modal="true" aria-label="Filtros de paquetes"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700">Filtros avanzados</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Cerrar filtros"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto space-y-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Precio (USD)</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={values.minPrecio} placeholder="Mín" onChange={e=>update({minPrecio:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600/50 outline-none text-sm"/>
              <input type="number" value={values.maxPrecio} placeholder="Máx" onChange={e=>update({maxPrecio:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600/50 outline-none text-sm"/>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Duración (días)</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={values.minDuracion} placeholder="Mín" onChange={e=>update({minDuracion:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600/50 outline-none text-sm"/>
              <input type="number" value={values.maxDuracion} placeholder="Máx" onChange={e=>update({maxDuracion:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600/50 outline-none text-sm"/>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Tipo de producto</h4>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map(t => (
                <button key={t} type="button" onClick={()=>toggleFromArray('tipos', t)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${values.tipos.includes(t) ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Continente</h4>
            <div className="flex flex-wrap gap-2">
              {CONTINENTES.map(c => (
                <button key={c} type="button" onClick={()=>toggleFromArray('continentes', c)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${values.continentes.includes(c) ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
            <FiRotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={apply} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">Aplicar filtros</button>
        </div>
      </aside>
    </div>
  );
};

export default FiltersPanel;
