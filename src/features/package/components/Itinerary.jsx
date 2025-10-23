import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const Itinerary = ({ itinerario = [] }) => {
  // Normalizar datos: convertir itinerario a formato consistente
  const normalizedItinerario = itinerario.map((item, index) => ({
    id: item.id || index,
    dia_numero: item.dia_numero || item.dia || index + 1,
    descripcion: item.descripcion || "",
  }));

  const itemsPerPage = 3;
  const totalItems = normalizedItinerario.length;
  
  // Inicializar visibleItems con el mínimo entre itemsPerPage y el total de días
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState(Math.min(itemsPerPage, totalItems));

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const showMoreItems = () => {
    setVisibleItems((prev) => Math.min(prev + itemsPerPage, totalItems));
  };

  const showLessItems = () => {
    setVisibleItems(Math.min(itemsPerPage, totalItems));
  };

  const currentItems = normalizedItinerario.slice(0, visibleItems);
  const hasMoreItems = visibleItems < totalItems;

  if (!itinerario || itinerario.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FiCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            No hay actividades programadas
          </p>
          <p className="text-gray-500 text-sm mt-2">
            El itinerario se actualizará pronto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
          <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <span className="font-medium">
            {normalizedItinerario.length} {normalizedItinerario.length === 1 ? "día" : "días"} de viaje
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Línea de tiempo vertical - oculta en móvil */}
        <div className="hidden sm:block absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300"></div>

        <div className="space-y-4 sm:space-y-6">
          {currentItems.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="group relative animate-in fade-in-0 slide-in-from-left-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge del número de día */}
                <div className="absolute left-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-white font-bold text-sm sm:text-base z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  {item.dia_numero}
                </div>

                {/* Card del día */}
                <div className="ml-10 sm:ml-14 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 overflow-hidden">
                  <div
                    className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="hidden sm:block bg-blue-50 p-2 rounded-lg transition-colors duration-200 group-hover:bg-blue-100 flex-shrink-0">
                          <FiCalendar className="text-blue-500 w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            Día {item.dia_numero}
                          </h3>

                          <div className="text-xs sm:text-sm text-gray-600">
                            <p className="line-clamp-2 leading-relaxed">
                              {item.descripcion}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0">
                        {isExpanded ? (
                          <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
                      <div className="pt-3 sm:pt-4">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {item.descripcion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 space-y-4">
        {/* Progreso visual */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Días mostrados</span>
            <span className="font-semibold text-blue-600">
              {visibleItems} de {totalItems}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(Math.max((visibleItems / totalItems) * 100, 0), 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          {hasMoreItems && (
            <button
              onClick={showMoreItems}
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-medium text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span>
                Ver {Math.min(itemsPerPage, totalItems - visibleItems)}{" "}
                días más
              </span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {visibleItems > itemsPerPage && (
            <button
              onClick={showLessItems}
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white font-medium text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span>Mostrar menos</span>
            </button>
          )}
        </div>

        {/* Mensaje informativo */}
        {!hasMoreItems && totalItems > itemsPerPage && (
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              ¡Has visto todo el itinerario!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
