import React from 'react';
import { FiSettings, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ConfigurationForm = ({ formData, onFormChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <FiSettings className="mx-auto h-12 w-12 text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Configuración Final</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ajustes finales y notas adicionales del paquete
        </p>
      </div>

      {/* Estado del Paquete */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Estado del Paquete</h4>
        <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            {formData.activo ? (
              <FiToggleRight className="h-6 w-6 text-green-500" />
            ) : (
              <FiToggleLeft className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <span className="text-sm font-medium text-gray-700">
                Paquete activo
              </span>
              <p className="text-xs text-gray-500">
                {formData.activo 
                  ? "El paquete será visible para los usuarios" 
                  : "El paquete estará oculto para los usuarios"
                }
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo || false}
            onChange={(e) => onFormChange({ target: { name: 'activo', value: e.target.checked } })}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
        </label>
      </div>

      {/* Notas Adicionales */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Notas Adicionales</h4>
        <textarea
          name="notas"
          value={formData.notas || ""}
          onChange={onFormChange}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Notas importantes para el viajero, condiciones especiales, recomendaciones, restricciones, etc..."
        ></textarea>
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-blue-900 mb-3">Resumen del Paquete</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Título:</span>
            <p className="text-blue-600">{formData.titulo || "Sin título"}</p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Precio:</span>
            <p className="text-blue-600">
              ${formData.precio_total ? parseFloat(formData.precio_total).toLocaleString('es-MX') : "0"}
              {formData.descuento && (
                <span className="text-green-600 ml-2">
                  (Descuento: ${parseFloat(formData.descuento).toLocaleString('es-MX')})
                </span>
              )}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Fechas:</span>
            <p className="text-blue-600">
              {formData.fecha_inicio && formData.fecha_fin 
                ? `${formData.fecha_inicio} al ${formData.fecha_fin}`
                : "Sin fechas definidas"}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Estado:</span>
            <p className={formData.activo ? "text-green-600" : "text-red-600"}>
              {formData.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;
