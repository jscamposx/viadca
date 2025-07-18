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
  const { originPosition, destinationPosition, polylinePositions, bounds } =
    useMemo(() => {
      const origin = [
        parseFloat(paquete.origen_lat),
        parseFloat(paquete.origen_lng),
      ];
      const destination = [
        parseFloat(paquete.destino_lat),
        parseFloat(paquete.destino_lng),
      ];

      const isValid = (lat, lng) =>
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

      if (
        !isValid(origin[0], origin[1]) ||
        !isValid(destination[0], destination[1])
      ) {
        return { valid: false };
      }

      return {
        valid: true,
        originPosition: origin,
        destinationPosition: destination,
        polylinePositions: [origin, destination],
        bounds: L.latLngBounds([origin, destination]),
      };
    }, [paquete]);

  if (!originPosition) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">
            Error: Coordenadas inválidas para mostrar el mapa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg overflow-hidden border border-gray-200 relative">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: "400px", width: "100%" }}
          className="z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={originPosition} icon={blueIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-blue-600 mb-1">Origen</h3>
                <p className="text-sm">{paquete.origen}</p>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -20]} permanent>
              <span className="font-medium text-blue-600">Origen</span>
            </Tooltip>
          </Marker>

          <Marker position={destinationPosition} icon={redIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-600 mb-1">Destino</h3>
                <p className="text-sm">{paquete.destino}</p>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -20]} permanent>
              <span className="font-medium text-red-600">Destino</span>
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

      <div className=" bg-gray-50 rounded-lg ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
          {paquete.tracking_number && (
            <div>
              <div className="font-semibold text-gray-700">
                Nº de Seguimiento
              </div>
              <div className="text-sm font-mono text-gray-600">
                {paquete.tracking_number}
              </div>
            </div>
          )}
          {paquete.status && (
            <div>
              <div className="font-semibold text-gray-700">Estado</div>
              <div
                className={`text-sm font-medium ${
                  paquete.status === "entregado"
                    ? "text-green-600"
                    : paquete.status === "en_transito"
                      ? "text-blue-600"
                      : "text-orange-600"
                }`}
              >
                {paquete.status.replace("_", " ").toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
