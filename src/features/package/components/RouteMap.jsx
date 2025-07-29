import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

// Iconos personalizados para diferentes tipos de ubicaciones
const originIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const waypointIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RouteMap = ({ paquete }) => {
  const { positions, polylinePositions, bounds, totalDistance } = useMemo(() => {
    // Procesar todos los destinos ordenados
    const destinations = paquete.destinos
      ?.sort((a, b) => a.orden - b.orden)
      .map(destino => ({
        position: [
          parseFloat(destino.destino_lat),
          parseFloat(destino.destino_lng),
        ],
        name: destino.destino,
        orden: destino.orden,
      }))
      .filter(dest => {
        const lat = dest.position[0];
        const lng = dest.position[1];
        return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
      }) || [];

    if (destinations.length === 0) {
      return { valid: false };
    }

    // Agregar origen (Durango) como primer punto en el mapa
    const origen = {
      position: [24.0277, -104.6532], // Coordenadas de Durango
      name: "Durango",
      type: "origin"
    };

    // Combinar origen con destinos para mostrar en el mapa
    const allPositions = [origen, ...destinations.map(dest => ({
      ...dest,
      type: "destination"
    }))];

    // Coordenadas para la polilínea (origen + destinos)
    const routePositions = [origen.position, ...destinations.map(d => d.position)];

    // Calcular distancia aproximada entre destinos consecutivos
    const calculateDistance = (pos1, pos2) => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
      const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    let totalDist = 0;
    for (let i = 0; i < routePositions.length - 1; i++) {
      totalDist += calculateDistance(routePositions[i], routePositions[i + 1]);
    }

    return {
      valid: true,
      positions: allPositions,
      polylinePositions: routePositions,
      bounds: L.latLngBounds([origen.position, ...destinations.map(d => d.position)]),
      totalDistance: Math.round(totalDist),
    };
  }, [paquete]);

  if (!positions) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-sm p-6 border border-red-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error en el mapa</h3>
          <p className="text-red-600">
            No se pueden mostrar las coordenadas del viaje. Verifica que los destinos tengan ubicaciones válidas.
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    if (type === "origin") {
      return originIcon;
    }
    return destinationIcon;
  };

  const getIconColor = (type) => {
    if (type === "origin") {
      return "text-green-600";
    }
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Mapa mejorado */}
      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: "500px", width: "100%" }}
          className="z-0 rounded-2xl"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Marcadores para todas las ubicaciones */}
          {positions.map((location, index) => (
            <Marker
              key={index}
              position={location.position}
              icon={getIcon(location.type)}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${location.type === 'origin' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h3 className={`font-bold ${getIconColor(location.type)}`}>
                      {location.type === 'origin' ? '🏠' : '📍'} {location.name}
                    </h3>
                  </div>
                  <p className="text-slate-700 font-medium">
                    {location.type === 'origin' ? 'Punto de partida' : 'Destino de viaje'}
                  </p>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -20]} permanent={false}>
                <span className="font-medium text-red-600">
                  {location.name}
                </span>
              </Tooltip>
            </Marker>
          ))}

          {/* Ruta con gradiente */}
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
              opacity: 0.8,
              dashArray: "10, 5",
            }}
          />
        </MapContainer>

        {/* Overlay con información de distancia */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              ~{totalDistance} km de recorrido
            </span>
          </div>
        </div>
      </div>

      {/* Información detallada de la ruta */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50 backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Ruta completa del viaje</h3>
            <p className="text-slate-600">Desde tu punto de partida hasta todos los destinos</p>
          </div>
        </div>

        <div className="space-y-3">
          {positions.map((location, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/30">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  location.type === 'origin' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{location.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    location.type === 'origin'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {location.type === 'origin' ? 'Origen' : 'Destino'}
                  </span>
                </div>
              </div>

              {index < positions.length - 1 && (
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Estadísticas del viaje */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-blue-600">{positions.length}</div>
            <div className="text-sm text-slate-600">Ubicaciones</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-emerald-600">~{totalDistance}</div>
            <div className="text-sm text-slate-600">Kilómetros</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 text-center backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-purple-600">{paquete.duracion_dias}</div>
            <div className="text-sm text-slate-600">Días de viaje</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
