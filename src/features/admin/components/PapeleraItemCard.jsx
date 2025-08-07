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

  return (
    <div className={`
      bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border 
      ${isCritical ? 'border-red-300 bg-red-50/50' : isUrgent ? 'border-orange-300 bg-orange-50/50' : 'border-white/50'} 
      overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group
    `}>
      {/* Badge de urgencia */}
      {isUrgent && (
        <div className={`
          px-3 py-1 text-xs font-bold text-white rounded-full absolute top-3 left-3 z-10 flex items-center gap-1
          ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}
        `}>
          <FiAlertTriangle className="w-3 h-3" />
          {daysLeft === 0 ? "¡Eliminar hoy!" : `${daysLeft} ${daysLeft === 1 ? "día" : "días"}`}
        </div>
      )}

      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        {item.type === "paquete" && item.imagen_principal ? (
          <OptimizedImage
            src={getImageUrl(item.imagen_principal)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <FiPackage className="w-16 h-16 text-blue-400" />
              </div>
            }
          />
        ) : (
          <div className={`
            w-full h-full flex items-center justify-center
            ${item.type === "paquete" 
              ? "bg-gradient-to-br from-blue-100 to-indigo-200" 
              : item.type === "mayorista"
              ? "bg-gradient-to-br from-green-100 to-emerald-200"
              : "bg-gradient-to-br from-yellow-100 to-orange-200"
            }
          `}>
            {item.type === "paquete" ? (
              <FiPackage className="w-16 h-16 text-blue-400" />
            ) : item.type === "mayorista" ? (
              <FiUsers className="w-16 h-16 text-green-400" />
            ) : (
              <FiUsers className="w-16 h-16 text-yellow-400" />
            )}
          </div>
        )}
        
        {/* Overlay con tipo */}
        <div className="absolute top-3 right-3">
          <span className={`
            px-2 py-1 text-xs font-semibold rounded-full text-white shadow-lg
            ${item.type === "paquete" ? "bg-blue-500/80" : 
              item.type === "mayorista" ? "bg-green-500/80" : "bg-yellow-500/80"}
          `}>
            {item.type === "paquete" ? "Paquete" : 
             item.type === "mayorista" ? "Mayorista" : "Usuario"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        
        {/* Información específica por tipo */}
        {item.type === "paquete" ? (
          <div className="space-y-2 mb-4">
            {item.destinos && item.destinos.length > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <FiMapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span className="line-clamp-1">
                  {item.destinos.slice(0, 2).map(d => d.nombre).join(", ")}
                  {item.destinos.length > 2 && ` +${item.destinos.length - 2} más`}
                </span>
              </div>
            )}
            {item.precio_base && (
              <div className="text-lg font-bold text-blue-600">
                ${item.precio_base.toLocaleString()}
              </div>
            )}
          </div>
        ) : item.type === "mayorista" ? (
          <div className="space-y-2 mb-4">
            {item.email && (
              <div className="text-sm text-gray-600">
                {item.email}
              </div>
            )}
            {item.telefono && (
              <div className="text-sm text-gray-600">
                {item.telefono}
              </div>
            )}
          </div>
        ) : (
          // Información para usuarios
          <div className="space-y-2 mb-4">
            {item.correo && (
              <div className="text-sm text-gray-600">
                {item.correo}
              </div>
            )}
            {item.rol && (
              <div className="text-sm text-gray-600">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${item.rol === 'admin' ? 'bg-red-100 text-red-800' : 
                    item.rol === 'pre-autorizado' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}
                `}>
                  {item.rol === 'admin' ? 'Administrador' : 
                   item.rol === 'pre-autorizado' ? 'Pre-autorizado' : 'Usuario'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Fecha de eliminación */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>Eliminado: {formatDate(item.eliminadoEn)}</span>
        </div>

        {/* Días restantes */}
        {daysLeft !== null && (
          <div className={`
            flex items-center text-sm mb-4 font-medium
            ${isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'}
          `}>
            <FiClock className="w-4 h-4 mr-2" />
            <span>
              {daysLeft === 0 
                ? "Se elimina hoy automáticamente" 
                : `${daysLeft} ${daysLeft === 1 ? "día" : "días"} hasta eliminación automática`
              }
            </span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onRestore(item)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <FiRotateCcw className="w-4 h-4" />
            Restaurar
          </button>
          
          <button
            onClick={() => onHardDelete(item)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <FiTrash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>

        {/* Vista previa solo para paquetes */}
        {item.type === "paquete" && item.url && (
          <div className="mt-2">
            <Link
              to={`/paquetes/${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all text-sm"
            >
              <FiEye className="w-4 h-4" />
              Vista previa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PapeleraItemCard;
