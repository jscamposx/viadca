import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { FiMapPin, FiRefreshCw } from "react-icons/fi";

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Iconos personalizados
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        width: 6px;
        height: 6px;
        background-color: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const RouteMap = ({ paquete }) => {
  const [mapKey, setMapKey] = useState(0);
  const destinos = paquete?.destinos || [];

  // Filtrar destinos que tienen coordenadas válidas
  const destinosConCoordenadas = destinos.filter(
    (dest) => dest.destino_lat && dest.destino_lng && 
    !isNaN(parseFloat(dest.destino_lat)) && !isNaN(parseFloat(dest.destino_lng))
  );

  // Si no hay destinos con coordenadas, mostrar mensaje
  if (destinosConCoordenadas.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 min-h-[280px] flex items-center justify-center">
        <div className="text-center">
          <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Mapa no disponible
          </h4>
          <p className="text-gray-500">
            Este paquete aún no tiene coordenadas geográficas configuradas.
          </p>
        </div>
      </div>
    );
  }

  // Calcular el centro del mapa y zoom apropiado
  const calculateMapCenter = () => {
    if (destinosConCoordenadas.length === 1) {
      return [
        parseFloat(destinosConCoordenadas[0].destino_lat),
        parseFloat(destinosConCoordenadas[0].destino_lng)
      ];
    }
    
    const latSum = destinosConCoordenadas.reduce((sum, dest) => sum + parseFloat(dest.destino_lat), 0);
    const lngSum = destinosConCoordenadas.reduce((sum, dest) => sum + parseFloat(dest.destino_lng), 0);
    
    return [
      latSum / destinosConCoordenadas.length,
      lngSum / destinosConCoordenadas.length
    ];
  };

  // Calcular zoom apropiado para ver toda la ruta
  const calculateZoom = () => {
    if (destinosConCoordenadas.length === 1) {
      return 10; // Zoom más alejado para un solo destino
    }
    
    // Calcular la diferencia máxima entre coordenadas
    const lats = destinosConCoordenadas.map(dest => parseFloat(dest.destino_lat));
    const lngs = destinosConCoordenadas.map(dest => parseFloat(dest.destino_lng));
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);
    
    // Calcular zoom basado en el rango
    if (maxRange > 10) return 4;
    if (maxRange > 5) return 5;
    if (maxRange > 2) return 6;
    if (maxRange > 1) return 7;
    if (maxRange > 0.5) return 8;
    if (maxRange > 0.1) return 9;
    return 10;
  };

  const mapCenter = calculateMapCenter();
  const mapZoom = calculateZoom();
  
  // Crear coordenadas para la polilínea
  const routeCoordinates = destinosConCoordenadas.map(dest => [
    parseFloat(dest.destino_lat),
    parseFloat(dest.destino_lng)
  ]);

  // Iconos de colores - todos azules
  const blueIcon = createCustomIcon('#3b82f6'); // Azul para todos

  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 h-80">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        
        {/* Marcadores de destinos */}
        {destinosConCoordenadas.map((dest, index) => {
          const lat = parseFloat(dest.destino_lat);
          const lng = parseFloat(dest.destino_lng);
          
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              icon={blueIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Destino {index + 1}
                  </h4>
                  <p className="text-sm text-blue-600 mb-1">
                    {dest.destino}
                  </p>
                  {dest.descripcion && (
                    <p className="text-xs text-gray-600">
                      {dest.descripcion}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Línea de ruta (solo si hay múltiples destinos) */}
        {destinosConCoordenadas.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Control de recarga */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setMapKey(prev => prev + 1)}
          className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
          title="Actualizar mapa"
        >
          <FiRefreshCw className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default RouteMap;
