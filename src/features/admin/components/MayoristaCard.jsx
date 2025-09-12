import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiTag, FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";

const MayoristaCard = ({ mayorista, onDelete }) => {
  if (!mayorista) return null;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Header de la tarjeta */}
      <div className="relative p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <FiUsers className="text-white text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-200">
              {mayorista.nombre}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/80 text-purple-700 shadow-sm">
                {mayorista.clave}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        {/* Información en cards pequeñas */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-teal-50 hover:bg-teal-100 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
            <FiTag className="w-4 h-4 text-teal-500 mx-auto mb-1 transition-transform duration-200" />
            <div
              className="text-xs text-teal-700 font-medium truncate"
              title={mayorista.tipo_producto}
            >
              {mayorista.tipo_producto || "Sin tipo"}
            </div>
          </div>

          <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
            <FiCalendar className="w-4 h-4 text-blue-500 mx-auto mb-1 transition-transform duration-200" />
            <div className="text-xs text-blue-700 font-medium">
              {mayorista.creadoEn
                ? new Date(mayorista.creadoEn).toLocaleDateString("es-MX", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex-1">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">
              INFORMACIÓN
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium text-gray-900 truncate ml-2">
                  {mayorista.tipo_producto || "No especificado"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Creado:</span>
                <span className="text-sm font-medium text-gray-900">
                  {mayorista.creadoEn || mayorista.created_at
                    ? new Date(
                        mayorista.creadoEn || mayorista.created_at,
                      ).toLocaleDateString("es-MX")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción - Siempre en la parte inferior */}
        <div className="space-y-2">
          {/* Fila principal */}
          <div className="grid grid-cols-2 gap-2">
            {/* Editar */}
            <Link
              to={`/admin/mayoristas/editar/${mayorista.id}`}
              className="grupo/editar flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
              title="Editar mayorista"
            >
              <FiEdit2 className="w-4 h-4 grupo-hover/editar:scale-110 grupo-hover/editar:rotate-45 transition-all duration-300" />
              <span className="grupo-hover/editar:tracking-wide transition-all duration-200">
                Editar
              </span>
            </Link>

            {/* Mover a papelera */}
            <button
              onClick={() => onDelete?.(mayorista.id, mayorista.nombre)}
              className="grupo/eliminar flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
              title="Mover a papelera"
            >
              <FiTrash2 className="w-4 h-4 grupo-hover/eliminar:scale-125 grupo-hover/eliminar:rotate-12 transition-all duration-300" />
              <span className="grupo-hover/eliminar:font-bold transition-all duration-200">
                Eliminar
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MayoristaCard);
