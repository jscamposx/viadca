import React, { useState, useEffect } from "react";
import { FiInfo, FiCheck, FiX, FiEye } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const PatchPreview = ({ patchPayload, onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);

  const changeCount = patchPayload ? Object.keys(patchPayload).length : 0;

  if (changeCount === 0) {
    return null;
  }

  // Determinar moneda a usar: si el patch incluye cambio de moneda, usarlo; si no, intentar mantener la actual
  const monedaPatch = sanitizeMoneda(
    patchPayload?.moneda || patchPayload?.currency || "MXN",
  );

  const getFieldLabel = (fieldName) => {
    const labels = {
      titulo: "Título",
      fecha_inicio: "Fecha de inicio",
      fecha_fin: "Fecha de fin",
      precio_total: "Precio total",
      precio_original: "Precio original",
  precio_vuelo: "Precio vuelo",
  precio_hospedaje: "Precio hospedaje",
      descuento: "Descuento",
      anticipo: "Anticipo",
      incluye: "Incluye",
      no_incluye: "No incluye",
      requisitos: "Requisitos",
      notas: "Notas",
      activo: "Estado del paquete",
      itinerario_texto: "Itinerario",
      origen: "Origen",
      destino: "Destino",
      destinos: "Destinos",
      mayoristasIds: "Mayoristas",
      imagenes: "Imágenes",
      hotel: "Hotel",
      moneda: "Moneda",
    };

    return labels[fieldName] || fieldName;
  };

  const getFieldValue = (fieldName, value) => {
    if (fieldName === "activo") {
      return value ? "Activo" : "Inactivo";
    }

    if (fieldName === "imagenes" && value === "PROCESS_IMAGES") {
      return "Modificadas";
    }

    if (fieldName === "imagenes" && value === "PROCESS_IMAGES_ORDER_ONLY") {
      return "Solo orden modificado";
    }

    if (fieldName === "hotel" && value === "PROCESS_HOTEL") {
      return "Modificado";
    }

    if (fieldName === "destinos" && Array.isArray(value)) {
      return `${value.length} destino${value.length !== 1 ? "s" : ""}`;
    }

    if (fieldName === "mayoristasIds" && Array.isArray(value)) {
      return `${value.length} mayorista${value.length !== 1 ? "s" : ""}`;
    }

    if (fieldName === "moneda") {
      return sanitizeMoneda(value);
    }

    if (
      fieldName.includes("precio") ||
      fieldName === "anticipo" ||
      fieldName === "descuento"
    ) {
      if (value === null || value === undefined || value === "")
        return "Sin especificar";
      const formatted = formatPrecio(value, monedaPatch);
      return formatted || "Sin especificar";
    }

    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "...";
    }

    if (value === null || value === undefined) {
      return "Sin especificar";
    }

    return String(value);
  };

  return (
    <div className="fixed top-20 right-6 sm:right-8 lg:right-12 z-40">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className={`flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-xl shadow-lg font-medium transition-all duration-300 text-sm sm:text-base border-2 ${
            changeCount > 0
              ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 animate-pulse"
              : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">
            {changeCount} cambio{changeCount !== 1 ? "s" : ""}
          </span>
          <span className="sm:hidden">{changeCount}</span>
          {changeCount > 0 && (
            <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-ping"></div>
          )}
        </button>

        {isVisible && (
          <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 max-h-80 sm:max-h-[32rem] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 max-w-[calc(100vw-3rem)]">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiInfo className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Campos a actualizar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              </button>
            </div>

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

            {changeCount > 0 && (
              <div className="p-3 sm:p-3 bg-orange-50 border-t border-orange-100">
                <p className="text-xs text-orange-700">
                  <FiInfo className="w-3 h-3 inline mr-1" />
                  Se está actualizando {changeCount} campo
                  {changeCount !== 1 ? "s" : ""} modificado
                  {changeCount !== 1 ? "s" : ""}
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
