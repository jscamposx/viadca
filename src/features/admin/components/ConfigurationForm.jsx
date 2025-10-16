import React from "react";
import { FiSettings, FiCheck, FiX, FiPackage, FiUsers, FiLock, FiGlobe, FiFileText } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const ConfigurationForm = ({ formData, onFormChange, isEdit = false }) => {
  // Moneda normalizada para el paquete
  const moneda = sanitizeMoneda(formData?.moneda);
  const personasValue = parseInt(formData?.personas, 10);
  const personasValidas = !isNaN(personasValue) && personasValue > 0 ? personasValue : null;
  const precioUnitario = personasValidas
    ? formatPrecio(
        (parseFloat(formData?.precio_total) || 0) / personasValidas,
        moneda,
      )
    : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header con icono animado */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-600 via-gray-600 to-slate-700 rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 group">
          <FiSettings className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-300 group-hover:rotate-180" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Notas Adicionales
        </h3>
        <p className="text-sm sm:text-base text-slate-600 px-4">
          Información adicional importante para el viajero
        </p>
      </div>

      {/* Notas adicionales */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
            <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </div>
          <span className="flex-1">Notas para el Viajero</span>
        </h4>
        <textarea
          name="notas"
          value={formData.notas || ""}
          onChange={onFormChange}
          rows="6"
          className="w-full p-3 sm:p-4 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none transition-all duration-200 bg-white hover:border-slate-400 text-sm sm:text-base"
          placeholder="Notas importantes para el viajero:&#10;&#10;• Condiciones especiales&#10;• Recomendaciones de equipaje&#10;• Documentos necesarios&#10;• Restricciones&#10;• Cualquier información adicional relevante..."
        />
        <p className="text-xs text-slate-500 mt-2">
          Estas notas aparecerán en la página de detalles del paquete para que los usuarios las lean antes de reservar
        </p>
      </div>

      {/* Resumen del paquete */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-3 sm:mb-4">
          Resumen del Paquete
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Título:</span>
            <p className="text-blue-600 break-words">
              {formData.titulo || "Sin título"}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Precio:</span>
            <p className="text-blue-600">
              {formatPrecio(formData?.precio_total, moneda) ||
                formatPrecio(0, moneda)}
              {formData?.descuento && (
                <span className="text-green-600 block sm:inline sm:ml-2">
                  (Descuento:{" "}
                  {formatPrecio(formData?.descuento, moneda) ||
                    formatPrecio(0, moneda)}
                  )
                </span>
              )}
            </p>
          </div>
          {personasValidas && (
            <div>
              <span className="font-medium text-blue-700 flex items-center gap-1">
                <FiUsers className="w-4 h-4" /> Personas base
              </span>
              <p className="text-blue-600">
                {personasValidas} viajero{personasValidas > 1 ? "s" : ""}
                {precioUnitario && (
                  <span className="text-xs text-blue-500 block sm:inline sm:ml-2">
                    ({precioUnitario} por persona)
                  </span>
                )}
              </p>
            </div>
          )}
          <div>
            <span className="font-medium text-blue-700">Fechas:</span>
            <p className="text-blue-600 break-words">
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
