import React from "react";
import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiRotateCcw,
  FiCalendar,
  FiEye,
  FiPackage,
  FiUsers,
  FiMapPin,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { getImageUrl } from "../../../utils/imageUtils";

const PapeleraItemCard = ({ item, onRestore, onHardDelete, formatDate, getDaysUntilPermanentDelete }) => {
  const daysLeft = getDaysUntilPermanentDelete(item.eliminadoEn);
  const isUrgent = daysLeft !== null && daysLeft <= 3;
  const isCritical = daysLeft !== null && daysLeft <= 1;

  // Determinar colores según tipo de elemento
  const typeColors = {
    paquete: { bg: "from-blue-50 to-blue-100", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-500/90" },
    mayorista: { bg: "from-green-50 to-green-100", text: "text-green-600", border: "border-green-200", badge: "bg-green-500/90" },
    usuario: { bg: "from-amber-50 to-amber-100", text: "text-amber-600", border: "border-amber-200", badge: "bg-amber-500/90" }
  };
  const colors = typeColors[item.type] || typeColors.usuario;

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg border overflow-hidden
      transition-all duration-300 hover:shadow-xl group flex flex-col h-auto
      ${isCritical ? 'border-red-300 bg-red-50/80' : 
        isUrgent ? 'border-orange-300 bg-orange-50/80' : 
        `border-gray-100 ${colors.bg}`}
    `}>
      {/* Encabezado con imagen y estado */}
      <div className="relative">
        {/* Badge de urgencia */}
        {isUrgent && (
          <div className={`
            absolute top-3 left-3 z-10 px-3 py-1.5 text-xs font-bold 
            text-white rounded-lg flex items-center gap-1 shadow-md
            ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}
          `}>
            <FiAlertTriangle className="w-4 h-4" />
            <span>
              {daysLeft === 0 
                ? "¡Eliminar hoy!" 
                : `${daysLeft} ${daysLeft === 1 ? "día" : "días"}`
              }
            </span>
          </div>
        )}

        {/* Imagen */}
        <div className="relative h-28 sm:h-36 md:h-40 overflow-hidden">
          {item.type === "paquete" && item.imagen_principal ? (
            <OptimizedImage
              src={getImageUrl(item.imagen_principal)}
              alt={item.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              fallback={
                <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                  <FiPackage className="w-14 h-14 text-blue-400 opacity-80" />
                </div>
              }
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colors.bg}`}>
              {item.type === "paquete" ? (
                <FiPackage className="w-14 h-14 text-blue-400 opacity-80" />
              ) : item.type === "mayorista" ? (
                <FiUsers className="w-14 h-14 text-green-400 opacity-80" />
              ) : (
                <FiUsers className="w-14 h-14 text-amber-400 opacity-80" />
              )}
            </div>
          )}
          
          {/* Badge de tipo */}
          <div className="absolute top-3 right-3">
            <span className={`
              px-3 py-1.5 text-xs font-semibold rounded-lg text-white shadow-md
              ${colors.badge}
            `}>
              {item.type === "paquete" ? "Paquete" : 
               item.type === "mayorista" ? "Mayorista" : "Usuario"}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4 sm:p-5 flex flex-col h-full">
        <div className="flex-1">
          {/* Título */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2 leading-tight">
            {item.name}
          </h3>
          
          {/* Información específica */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            {item.type === "paquete" ? (
              <>
                {item.destinos && item.destinos.length > 0 && (
                  <div className="flex items-start text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">
                      {item.destinos.slice(0, 2).map(d => d.nombre).join(", ")}
                      {item.destinos.length > 2 && ` +${item.destinos.length - 2} más`}
                    </span>
                  </div>
                )}
                {item.precio_base && (
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    ${item.precio_base.toLocaleString()}
                  </div>
                )}
              </>
            ) : item.type === "mayorista" ? (
              <>
                {item.email && (
                  <div className="flex items-start text-gray-600">
                    <span className="text-sm font-medium min-w-[70px]">Email:</span>
                    <span className="text-sm ml-2 break-all">{item.email}</span>
                  </div>
                )}
                {item.telefono && (
                  <div className="flex items-start text-gray-600">
                    <span className="text-sm font-medium min-w-[70px]">Teléfono:</span>
                    <span className="text-sm ml-2">{item.telefono}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {item.correo && (
                  <div className="flex items-start text-gray-600">
                    <span className="text-sm font-medium min-w-[70px]">Email:</span>
                    <span className="text-sm ml-2 break-all">{item.correo}</span>
                  </div>
                )}
                {item.rol && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium min-w-[70px]">Rol:</span>
                    <span className={`
                      ml-2 px-2.5 py-1 rounded-lg text-xs font-medium
                      ${item.rol === 'admin' ? 'bg-red-100 text-red-800' : 
                        item.rol === 'pre-autorizado' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {item.rol === 'admin' ? 'Administrador' : 
                      item.rol === 'pre-autorizado' ? 'Pre-autorizado' : 'Usuario'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Información temporal */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Eliminado: <span className="font-medium">{formatDate(item.eliminadoEn)}</span></span>
          </div>

          {daysLeft !== null && (
            <div className={`
              flex items-center text-sm p-2.5 rounded-lg
              ${isCritical ? 'text-red-700 bg-red-50 border border-red-200' : 
                isUrgent ? 'text-orange-700 bg-orange-50 border border-orange-200' : 
                'text-gray-600 bg-gray-50 border border-gray-200'}
            `}>
              <FiClock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                {daysLeft === 0 
                  ? "Se elimina hoy automáticamente" 
                  : `Eliminación en ${daysLeft} ${daysLeft === 1 ? "día" : "días"}`
                }
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-4 space-y-2">
          {item.type === "paquete" && item.url && (
            <Link
              to={`/paquetes/${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all text-sm border border-gray-200 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <FiEye className="w-4 h-4" />
              Vista previa
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={`Restaurar ${item.name}`}
              onClick={() => onRestore(item)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <FiRotateCcw className="w-4 h-4" />
              Restaurar
            </button>
            
            <button
              type="button"
              aria-label={`Eliminar permanentemente ${item.name}`}
              onClick={() => onHardDelete(item)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <FiTrash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapeleraItemCard;