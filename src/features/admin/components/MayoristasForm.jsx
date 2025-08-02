import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiTag
} from "react-icons/fi";
import { useMayoristas } from "../hooks/useMayoristas";

const MayoristasForm = ({ formData, onFormChange }) => {
  const { mayoristas, loading, error } = useMayoristas();
  const [selectedMayoristas, setSelectedMayoristas] = useState([]);

  useEffect(() => {
    if (formData.mayoristas) {
      setSelectedMayoristas(formData.mayoristas);
    }
  }, [formData.mayoristas]);

  const handleMayoristaToggle = (mayorista) => {
    const isSelected = selectedMayoristas.some(m => m.id === mayorista.id);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedMayoristas.filter(m => m.id !== mayorista.id);
    } else {
      newSelected = [...selectedMayoristas, mayorista];
    }
    
    setSelectedMayoristas(newSelected);
    onFormChange({
      target: { name: 'mayoristas', value: newSelected }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-slate-600">Cargando mayoristas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error al cargar mayoristas: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Mayoristas Incluidos
        </h3>
        <p className="text-slate-600">
          Selecciona los mayoristas que están incluidos en este paquete turístico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mayoristas.map((mayorista) => {
          const isSelected = selectedMayoristas.some(m => m.id === mayorista.id);
          
          return (
            <div
              key={mayorista.id}
              className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-indigo-50 border-indigo-200 shadow-md transform scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              }`}
              onClick={() => handleMayoristaToggle(mayorista)}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-300"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <h4 className={`font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {mayorista.nombre}
                    </h4>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <FiTag className={`w-3 h-3 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span className={`font-mono text-xs px-2 py-1 rounded-md ${
                        isSelected 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mayorista.clave}
                      </span>
                    </div>
                    {mayorista.tipo_producto && (
                      <div className={`inline-block text-xs px-2 py-1 rounded-full ${
                        isSelected 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {mayorista.tipo_producto}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <input
                className="sr-only"
                aria-label={`Seleccionar mayorista ${mayorista.nombre}`}
                type="checkbox"
                checked={isSelected}
                onChange={() => handleMayoristaToggle(mayorista)}
              />
            </div>
          );
        })}
      </div>

      {/* Sección de confirmación - Mayoristas seleccionados */}
      {selectedMayoristas.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-indigo-600" />
            Mayoristas Incluidos ({selectedMayoristas.length})
          </h4>
          
          <div className="flex flex-wrap gap-3">
            {selectedMayoristas.map((mayorista) => (
              <div
                key={mayorista.id}
                className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full border border-indigo-200"
              >
                <FiTag className="w-3 h-3" />
                <span className="font-medium">{mayorista.nombre}</span>
                <span className="text-xs font-mono bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded">
                  {mayorista.clave}
                </span>
                <button
                  type="button"
                  onClick={() => handleMayoristaToggle(mayorista)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  aria-label={`Quitar ${mayorista.nombre}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-indigo-700 mt-3">
            Estos mayoristas están incluidos como parte de este paquete turístico.
          </p>
        </div>
      )}
    </div>
  );
};

export default MayoristasForm;
