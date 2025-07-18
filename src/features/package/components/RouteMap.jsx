import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect, useMemo } from "react";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RouteMap = ({ paquete }) => {
  const [mapHeight, setMapHeight] = useState(400);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);

  // Memoize positions to prevent unnecessary re-renders
  const { originPosition, destinationPosition, polylinePositions, center, bounds } = useMemo(() => {
    const origin = [
      parseFloat(paquete.origen_lat),
      parseFloat(paquete.origen_lng),
    ];
    const destination = [
      parseFloat(paquete.destino_lat),
      parseFloat(paquete.destino_lng),
    ];
    const polyline = [origin, destination];
    
    // Calculate center point between origin and destination
    const centerLat = (origin[0] + destination[0]) / 2;
    const centerLng = (origin[1] + destination[1]) / 2;
    const centerPoint = [centerLat, centerLng];
    
    // Create bounds for better zoom level
    const bounds = L.latLngBounds([origin, destination]);
    
    return {
      originPosition: origin,
      destinationPosition: destination,
      polylinePositions: polyline,
      center: centerPoint,
      bounds: bounds
    };
  }, [paquete]);

  // Calculate distance between points
  const distance = useMemo(() => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (destinationPosition[0] - originPosition[0]) * Math.PI / 180;
    const dLon = (destinationPosition[1] - originPosition[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originPosition[0] * Math.PI / 180) * Math.cos(destinationPosition[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }, [originPosition, destinationPosition]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setMapHeight(isFullscreen ? 400 : 600);
  };

  // Validate coordinates
  const isValidCoordinates = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  if (!isValidCoordinates(originPosition[0], originPosition[1]) || 
      !isValidCoordinates(destinationPosition[0], destinationPosition[1])) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Mapa de la Ruta
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">
            Error: Coordenadas inválidas para mostrar el mapa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Mapa de la Ruta
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTooltips(!showTooltips)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showTooltips ? 'Ocultar' : 'Mostrar'} etiquetas
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            {isFullscreen ? 'Contraer' : 'Expandir'}
          </button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-gray-200 relative">
        <MapContainer
          center={center}
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: `${mapHeight}px`, width: "100%" }}
          className="z-0"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Origin Marker */}
          <Marker position={originPosition} icon={blueIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-600 mb-2">Punto de Origen</h3>
                <p className="text-sm mb-1">
                  <strong>Ubicación:</strong> {paquete.origen}
                </p>
                <p className="text-xs text-gray-500">
                  Lat: {originPosition[0].toFixed(6)}, Lng: {originPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
            {showTooltips && (
              <Tooltip direction="top" offset={[0, -20]} permanent>
                <div className="font-medium">
                  <span className="text-blue-600">Origen:</span> {paquete.origen}
                </div>
              </Tooltip>
            )}
          </Marker>
          
          {/* Destination Marker */}
          <Marker position={destinationPosition} icon={redIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-red-600 mb-2">Punto de Destino</h3>
                <p className="text-sm mb-1">
                  <strong>Ubicación:</strong> {paquete.destino}
                </p>
                <p className="text-xs text-gray-500">
                  Lat: {destinationPosition[0].toFixed(6)}, Lng: {destinationPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
            {showTooltips && (
              <Tooltip direction="top" offset={[0, -20]} permanent>
                <div className="font-medium">
                  <span className="text-red-600">Destino:</span> {paquete.destino}
                </div>
              </Tooltip>
            )}
          </Marker>
          
          {/* Route Polyline */}
          <Polyline 
            positions={polylinePositions} 
            color="#3b82f6" 
            weight={3}
            dashArray="5, 5"
            opacity={0.8}
          />
        </MapContainer>
      </div>
      
      {/* Route Information */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Origen: {paquete.origen}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Destino: {paquete.destino}</span>
          </div>
        </div>
        
        {/* Distance and additional info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700">Distancia Aproximada</div>
              <div className="text-lg font-bold text-blue-600">{distance.toLocaleString()} km</div>
            </div>
            {paquete.tracking_number && (
              <div className="text-center">
                <div className="font-semibold text-gray-700">Número de Seguimiento</div>
                <div className="text-sm font-mono text-gray-600">{paquete.tracking_number}</div>
              </div>
            )}
            {paquete.status && (
              <div className="text-center">
                <div className="font-semibold text-gray-700">Estado</div>
                <div className={`text-sm font-medium ${
                  paquete.status === 'entregado' ? 'text-green-600' : 
                  paquete.status === 'en_transito' ? 'text-blue-600' : 
                  'text-orange-600'
                }`}>
                  {paquete.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;