import React, { useState, useEffect } from 'react';
import { FiInfo, FiCheck, FiX, FiEye } from 'react-icons/fi';

/**
 * Componente para mostrar información sobre los campos que se van a actualizar
 * en modo edición de paquetes
 */
const PatchPreview = ({ patchPayload, onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const changeCount = patchPayload ? Object.keys(patchPayload).length : 0;

  if (changeCount === 0) {
    return null;
  }

  const getFieldLabel = (fieldName) => {
    const labels = {
      titulo: 'Título',
      fecha_inicio: 'Fecha de inicio',
      fecha_fin: 'Fecha de fin',
      precio_total: 'Precio total',
      descuento: 'Descuento',
      anticipo: 'Anticipo',
      incluye: 'Incluye',
      no_incluye: 'No incluye',
      requisitos: 'Requisitos',
      notas: 'Notas',
      activo: 'Estado del paquete',
      itinerario_texto: 'Itinerario',
      origen: 'Origen',
      destino: 'Destino',
      destinos: 'Destinos',
      mayoristasIds: 'Mayoristas',
      imagenes: 'Imágenes',
      hotel: 'Hotel'
    };
    
    return labels[fieldName] || fieldName;
  };

  const getFieldValue = (fieldName, value) => {
    if (fieldName === 'activo') {
      return value ? 'Activo' : 'Inactivo';
    }
    
    if (fieldName === 'imagenes' && value === 'PROCESS_IMAGES') {
      return 'Modificadas';
    }
    
    if (fieldName === 'hotel' && value === 'PROCESS_HOTEL') {
      return 'Modificado';
    }
    
    if (fieldName === 'destinos' && Array.isArray(value)) {
      return `${value.length} destino${value.length !== 1 ? 's' : ''}`;
    }
    
    if (fieldName === 'mayoristasIds' && Array.isArray(value)) {
      return `${value.length} mayorista${value.length !== 1 ? 's' : ''}`;
    }
    
    if (fieldName.includes('precio') || fieldName === 'anticipo' || fieldName === 'descuento') {
      if (value === null || value === undefined) return 'Sin especificar';
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(value);
    }
    
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    
    if (value === null || value === undefined) {
      return 'Sin especificar';
    }
    
    return String(value);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Botón flotante para mostrar/ocultar */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg font-medium transition-all duration-300 text-sm sm:text-base ${
            changeCount > 0
              ? 'bg-orange-500 hover:bg-orange-600 text-white animate-pulse'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{changeCount} cambio{changeCount !== 1 ? 's' : ''}</span>
          <span className="sm:hidden">{changeCount}</span>
          {changeCount > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
          )}
        </button>

        {/* Panel de cambios */}
        {isVisible && (
          <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 max-h-80 sm:max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 max-w-[calc(100vw-2rem)]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Campos a actualizar</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              </button>
            </div>

            {/* Lista de cambios */}
            <div className="p-3 sm:p-4 space-y-3">
              {changeCount === 0 ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FiCheck className="w-4 h-4" />
                  <span>No hay campos para actualizar</span>
                </div>
              ) : (
                Object.entries(patchPayload || {}).map(([fieldName, value]) => (
                  <div key={fieldName} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {getFieldLabel(fieldName)}
                      </span>
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 break-words">
                      {getFieldValue(fieldName, value)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer informativo */}
            {changeCount > 0 && (
              <div className="p-3 sm:p-3 bg-orange-50 border-t border-orange-100">
                <p className="text-xs text-orange-700">
                  <FiInfo className="w-3 h-3 inline mr-1" />
                  Se está actualizando {changeCount} campo{changeCount !== 1 ? 's' : ''} modificado{changeCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatchPreview;
