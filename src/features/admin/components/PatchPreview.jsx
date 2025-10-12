import React, { useState } from "react";
import { FiInfo, FiCheck, FiX, FiEye, FiDollarSign, FiImage, FiFileText, FiDatabase, FiUsers } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const PatchPreview = ({ patchPayload, onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Pre-procesar entradas para filtrar campos sin valor significativo
  const rawEntries = Object.entries(patchPayload || {});

  // Determinar moneda primero (antes de formatear precios) para consistencia
  const monedaPatch = sanitizeMoneda(
    patchPayload?.moneda || patchPayload?.currency || "MXN",
  );

  const isMeaningfulPrice = (value) => {
    if (value === null || value === undefined || value === "") return false;
    // Permitir 0 explícito si el usuario lo incluyó (ej: descuento = 0 para limpiar)
    if (typeof value === "number" && isNaN(value)) return false;
    return true;
  };

  // Determinar moneda a usar: si el patch incluye cambio de moneda, usarlo; si no, intentar mantener la actual
  // Reutilizamos monedaPatch declarado arriba

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
    personas: "Personas base",
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

    if (fieldName === "personas") {
      if (value === null || value === undefined || value === "") return "Sin especificar";
      const val = parseInt(value, 10);
      if (Number.isNaN(val) || val <= 0) return "Sin especificar";
      return `${val} viajero${val !== 1 ? "s" : ""}`;
    }

    if (fieldName.includes("precio") || fieldName === "anticipo" || fieldName === "descuento") {
      if (!isMeaningfulPrice(value)) return "Sin especificar";
      const formatted = formatPrecio(value, monedaPatch);
      return formatted || "Sin especificar";
    }

    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "...";
    }

    if (value === null || value === undefined) return "Sin especificar";

    return String(value);
  };

  // Construir lista procesada con metadata
  const processed = rawEntries
    .map(([fieldName, value]) => {
      const displayValue = getFieldValue(fieldName, value);
      return { fieldName, value, displayValue };
    })
    // Filtrar valores cuyo display es 'Sin especificar' para no mostrar ruido
    .filter((item) => item.displayValue !== "Sin especificar");

  const changeCount = processed.length;

  if (changeCount === 0) return null;

  const categoryMeta = (fieldName) => {
    if (fieldName.includes("precio") || ["anticipo", "descuento"].includes(fieldName)) {
      return { label: "Precio", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: FiDollarSign };
    }
    if (fieldName === "personas") {
      return { label: "Capacidad", color: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: FiUsers };
    }
    if (["imagenes", "hotel", "destinos", "mayoristasIds"].includes(fieldName)) {
      return { label: "Contenido", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: FiImage };
    }
    if (["incluye", "no_incluye", "requisitos", "notas", "itinerario_texto"].includes(fieldName)) {
      return { label: "Texto", color: "bg-blue-100 text-blue-700 border-blue-200", icon: FiFileText };
    }
    if (fieldName === "activo") {
      return { label: "Estado", color: "bg-amber-100 text-amber-700 border-amber-200", icon: FiInfo };
    }
    if (fieldName === "moneda") {
      return { label: "Moneda", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", icon: FiDatabase };
    }
    return { label: "Cambio", color: "bg-gray-100 text-gray-700 border-gray-200", icon: FiInfo };
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
              {processed.map(({ fieldName, displayValue }) => {
                const meta = categoryMeta(fieldName);
                return (
                  <div
                    key={fieldName}
                    className="group flex flex-col gap-1 rounded-lg border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-white hover:shadow-md transition-all duration-300 p-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-700 tracking-wide flex items-center gap-1">
                        {getFieldLabel(fieldName)}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-medium border ${meta.color}`}
                        >
                          <meta.icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-orange-400 group-hover:scale-125 transition-transform"></span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-600 bg-gray-50/70 rounded-md px-2 py-1.5 break-words font-medium border border-gray-100 group-hover:border-orange-200/70 group-hover:bg-orange-50/60">
                      {displayValue}
                    </div>
                  </div>
                );
              })}
            </div>

            {changeCount > 0 && (
              <div className="p-3 sm:p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-t border-orange-100/80">
                <p className="text-[11px] sm:text-xs text-orange-700 font-medium flex items-center gap-1">
                  <FiInfo className="w-3 h-3" />
                  {changeCount} campo{changeCount !== 1 ? "s" : ""} con cambios reales listo{changeCount !== 1 ? "s" : ""} para enviar
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
