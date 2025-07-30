import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const Itinerary = ({ itinerario = [] }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState(3);
  const itemsPerPage = 3;

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
    setVisibleItems((prev) => Math.min(prev + itemsPerPage, itinerario.length));
  };

  const showLessItems = () => {
    setVisibleItems(itemsPerPage);
  };

  const currentItems = itinerario.slice(0, visibleItems);
  const hasMoreItems = visibleItems < itinerario.length;

  if (!itinerario || itinerario.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
          Itinerario del Viaje
        </h2>
        <div className="text-center py-8">
          <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay actividades programadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiCalendar className="w-4 h-4" />
          <span>
            {itinerario.length} {itinerario.length === 1 ? "día" : "días"}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300"></div>

        <div className="space-y-6">
          {currentItems.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="group relative animate-in fade-in-0 slide-in-from-left-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute left-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-8 h-8 text-white font-bold z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  {item.dia_numero}
                </div>

                <div className="ml-12 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-blue-50 p-2 rounded-lg transition-colors duration-200 group-hover:bg-blue-100">
                          <FiCalendar className="text-blue-500 w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                            Día {item.dia_numero}
                          </h4>

                          <div className="text-sm text-gray-600">
                            <p className="line-clamp-2 leading-relaxed">
                              {item.descripcion}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                        {isExpanded ? (
                          <FiChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
                      <div className="pt-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
        {/* Progreso visual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Días mostrados</span>
            <span className="font-semibold text-blue-600">
              {visibleItems} de {itinerario.length}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(Math.max((visibleItems / itinerario.length) * 100, 0), 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-3 justify-center">
          {hasMoreItems && (
            <button
              onClick={showMoreItems}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span>
                Ver {Math.min(itemsPerPage, itinerario.length - visibleItems)}{" "}
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
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
        {!hasMoreItems && itinerario.length > itemsPerPage && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
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
