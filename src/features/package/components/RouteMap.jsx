import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { FiMapPin, FiRefreshCw } from "react-icons/fi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = (color, destino, index) => {
  return L.divIcon({
    className: "location-marker",
    html: `<div 
      class="location-pin"
      title="${destino}"
      style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        position: relative;
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      "
      data-location="${destino}"
      data-index="${index + 1}"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color: white;">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const RouteMap = ({ paquete }) => {
  const [mapKey, setMapKey] = useState(0);
  const destinos = paquete?.destinos || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const locationPins = document.querySelectorAll(".location-pin");

      locationPins.forEach((pin) => {
        const location = pin.getAttribute("data-location");
        const index = pin.getAttribute("data-index");

        pin.addEventListener("mouseenter", () => {
          pin.style.transform = "scale(1.2)";
          pin.style.zIndex = "1000";
          pin.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
        });

        pin.addEventListener("mouseleave", () => {
          pin.style.transform = "scale(1)";
          pin.style.zIndex = "auto";
          pin.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        });

        pin.title = `📍 Destino ${index}: ${location}`;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [mapKey, destinos]);

  const destinosConCoordenadas = destinos.filter(
    (dest) =>
      dest.destino_lat &&
      dest.destino_lng &&
      !isNaN(parseFloat(dest.destino_lat)) &&
      !isNaN(parseFloat(dest.destino_lng)),
  );

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

  const calculateMapCenter = () => {
    if (destinosConCoordenadas.length === 1) {
      return [
        parseFloat(destinosConCoordenadas[0].destino_lat),
        parseFloat(destinosConCoordenadas[0].destino_lng),
      ];
    }

    const latSum = destinosConCoordenadas.reduce(
      (sum, dest) => sum + parseFloat(dest.destino_lat),
      0,
    );
    const lngSum = destinosConCoordenadas.reduce(
      (sum, dest) => sum + parseFloat(dest.destino_lng),
      0,
    );

    return [
      latSum / destinosConCoordenadas.length,
      lngSum / destinosConCoordenadas.length,
    ];
  };

  const calculateZoom = () => {
    if (destinosConCoordenadas.length === 1) {
      return 10;
    }

    const lats = destinosConCoordenadas.map((dest) =>
      parseFloat(dest.destino_lat),
    );
    const lngs = destinosConCoordenadas.map((dest) =>
      parseFloat(dest.destino_lng),
    );

    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);

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

  const routeCoordinates = destinosConCoordenadas.map((dest) => [
    parseFloat(dest.destino_lat),
    parseFloat(dest.destino_lng),
  ]);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 h-80">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {destinosConCoordenadas.map((dest, index) => {
          const lat = parseFloat(dest.destino_lat);
          const lng = parseFloat(dest.destino_lng);
          const customIcon = createCustomIcon("#3b82f6", dest.destino, index);

          return (
            <Marker key={index} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="text-center p-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800">
                      Destino {index + 1}
                    </h3>
                  </div>

                  <p className="text-base text-blue-600 font-medium mb-2">
                    📍 {dest.destino}
                  </p>

                  {dest.descripcion && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dest.descripcion}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

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

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setMapKey((prev) => prev + 1)}
          className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Actualizar mapa"
        >
          <FiRefreshCw className="w-5 h-5 text-blue-600" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default RouteMap;
