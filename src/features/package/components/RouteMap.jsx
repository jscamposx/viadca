import { FiMapPin, FiNavigation, FiMap } from "react-icons/fi";

const RouteMap = ({ paquete }) => {
  // Obtener destinos del paquete
  const destinos = paquete?.destinos || [];
  const origen = paquete?.origen || "Lima";
  const destino = paquete?.destino || "Destino";

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 min-h-[400px]">
      {/* Header del mapa */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <FiMap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Ruta del Viaje
            </h3>
            <p className="text-sm text-blue-600">
              {origen} → {destino}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-100 rounded-full">
          <span className="text-xs font-medium text-blue-700">
            {destinos.length || 1} destino
            {(destinos.length || 1) > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Contenido del mapa */}
      <div className="relative bg-white/80 rounded-xl p-6 border border-blue-100 min-h-[280px]">
        {/* Simulación visual de ruta */}
        <div className="flex flex-col space-y-4">
          {/* Punto de origen */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
              <div className="absolute -inset-1 bg-green-400/30 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{origen}</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Origen
                </span>
              </div>
            </div>
          </div>

          {/* Línea de conexión */}
          <div className="ml-2 border-l-2 border-dashed border-blue-300 h-8"></div>

          {/* Destinos intermedios */}
          {destinos.map((dest, index) => (
            <div key={index}>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                  <div className="absolute -inset-1 bg-blue-400/30 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {dest.destino || `Destino ${index + 1}`}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Parada {index + 1}
                    </span>
                  </div>
                  {dest.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">
                      {dest.descripcion}
                    </p>
                  )}
                </div>
              </div>
              {index < destinos.length - 1 && (
                <div className="ml-2 border-l-2 border-dashed border-blue-300 h-8"></div>
              )}
            </div>
          ))}

          {/* Si no hay destinos específicos, mostrar destino final */}
          {destinos.length === 0 && (
            <>
              <div className="ml-2 border-l-2 border-dashed border-blue-300 h-8"></div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                  <div className="absolute -inset-1 bg-red-400/30 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{destino}</span>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                      Destino Final
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer del mapa */}
        <div className="mt-8 pt-4 border-t border-blue-100">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FiNavigation className="w-4 h-4 text-blue-500" />
              <span>Ruta optimizada</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiMapPin className="w-4 h-4 text-green-500" />
              <span>Ubicaciones verificadas</span>
            </div>
          </div>

          {/* Información adicional */}
          {paquete?.duracion && (
            <div className="mt-3 text-center">
              <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
                Duración total: {paquete.duracion}
              </span>
            </div>
          )}
        </div>

        {/* Overlay de "próximamente" */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-lg">
          <span className="text-xs text-yellow-700 font-medium">
            Mapa interactivo próximamente
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
