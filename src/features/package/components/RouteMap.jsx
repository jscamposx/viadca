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
    <div className="mb-8">
      <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
        Mapa de la Ruta
      </h2>
      <MapContainer
        center={originPosition}
        zoom={4}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={originPosition}>
          <Tooltip direction="top" offset={[0, -20]} permanent>
            <strong>Origen:</strong> {paquete.origen}
          </Tooltip>
        </Marker>
        <Marker position={destinationPosition} icon={redIcon}>
          <Tooltip direction="top" offset={[0, -20]} permanent>
            <strong>Destino:</strong> {paquete.destino}
          </Tooltip>
        </Marker>
        <Polyline positions={polylinePositions} color="blue" />
      </MapContainer>
    </div>
  );
};

export default RouteMap;
