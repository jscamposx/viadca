import React from "react";
import { FiUsers, FiCheck, FiMail, FiTag } from "react-icons/fi";
import { useMayoristas } from "../hooks/useMayoristas";

const MayoristasForm = ({ formData, onFormChange }) => {
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();

  const handleMayoristaChange = (mayoristaId) => {
    const currentIds = formData.mayoristasIds || [];
    let newIds;

    if (currentIds.includes(mayoristaId)) {
      newIds = currentIds.filter((id) => id !== mayoristaId);
    } else {
      newIds = [...currentIds, mayoristaId];
    }

    onFormChange({ target: { name: "mayoristasIds", value: newIds } });
  };

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Mayoristas Asociados
        </h3>
        <p className="text-slate-600">
          Selecciona los mayoristas que podrán vender este paquete turístico
        </p>
      </div>

      {mayoristasLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando mayoristas...</p>
        </div>
      ) : (
        <>
          {/* Grid de mayoristas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mayoristas.map((mayorista) => {
              const isSelected = (formData.mayoristasIds || []).includes(mayorista.id);
              
              return (
                <div
                  key={mayorista.id}
                  onClick={() => handleMayoristaChange(mayorista.id)}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-200 shadow-md transform scale-[1.02]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                  }`}
                >
                  {/* Checkbox visual */}
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-slate-300"
                    }`}>
                      {isSelected && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    {/* Contenido del mayorista */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUsers className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <h4 className={`font-semibold truncate ${
                          isSelected ? 'text-indigo-900' : 'text-slate-900'
                        }`}>
                          {mayorista.nombre}
                        </h4>
                      </div>
                      
                      {/* Información adicional */}
                      <div className="space-y-1">
                        {mayorista.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <FiMail className={`w-3 h-3 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <span className={`truncate ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                              {mayorista.email}
                            </span>
                          </div>
                        )}
                        
                        {mayorista.clave && (
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
                        )}
                        
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
                  
                  {/* Input checkbox oculto para accesibilidad */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMayoristaChange(mayorista.id)}
                    className="sr-only"
                    aria-label={`Seleccionar mayorista ${mayorista.nombre}`}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Mensaje si no hay mayoristas */}
          {mayoristas.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-2">
                No hay mayoristas disponibles
              </h4>
              <p className="text-slate-600">
                Agrega mayoristas desde la sección de administración para poder asociarlos a los paquetes.
              </p>
            </div>
          )}
        </>
      )}

      {/* Resumen de selección */}
      {(formData.mayoristasIds || []).length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900">
                Selección confirmada
              </h4>
              <p className="text-sm text-indigo-700">
                {(formData.mayoristasIds || []).length === 1 
                  ? "1 mayorista seleccionado"
                  : `${(formData.mayoristasIds || []).length} mayoristas seleccionados`}
              </p>
            </div>
          </div>
          
          {/* Lista de mayoristas seleccionados */}
          <div className="flex flex-wrap gap-2">
            {mayoristas
              .filter(m => (formData.mayoristasIds || []).includes(m.id))
              .map(mayorista => (
                <span
                  key={mayorista.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg"
                >
                  <FiUsers className="w-3 h-3" />
                  {mayorista.nombre}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default MayoristasForm;
