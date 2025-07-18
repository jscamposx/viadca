import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

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
  const originPosition = [
    parseFloat(paquete.origen_lat),
    parseFloat(paquete.origen_lng),
  ];
  const destinationPosition = [
    parseFloat(paquete.destino_lat),
    parseFloat(paquete.destino_lng),
  ];
  const polylinePositions = [originPosition, destinationPosition];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Mapa de la Ruta
      </h2>
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={originPosition}
          zoom={4}
          style={{ height: "400px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={originPosition} icon={blueIcon}>
            <Tooltip direction="top" offset={[0, -20]} permanent>
              <div className="font-medium">
                <span className="text-blue-600">Origen:</span> {paquete.origen}
              </div>
            </Tooltip>
          </Marker>
          <Marker position={destinationPosition} icon={redIcon}>
            <Tooltip direction="top" offset={[0, -20]} permanent>
              <div className="font-medium">
                <span className="text-red-600">Destino:</span> {paquete.destino}
              </div>
            </Tooltip>
          </Marker>
          <Polyline 
            positions={polylinePositions} 
            color="#3b82f6" 
            weight={3}
            dashArray="5, 5"
          />
        </MapContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Origen: {paquete.origen}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Destino: {paquete.destino}</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;