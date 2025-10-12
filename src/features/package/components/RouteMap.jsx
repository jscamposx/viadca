import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { FiMapPin, FiRefreshCw, FiExternalLink } from "react-icons/fi";

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
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
  const ES_TILE_URL = import.meta.env.VITE_ES_TILE_URL; // Permite inyectar un tile provider en español

  // Centro de México por defecto (Ciudad de México)
  const MEXICO_CENTER = [23.6345, -102.5528]; // Centro geográfico de México

  // Función para validar si las coordenadas son válidas (cualquier ubicación mundial)
  const isValidCoordinate = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) return false;
    
    // Verificar que estén dentro de los rangos válidos globales
    return (
      latitude >= -90 && 
      latitude <= 90 &&
      longitude >= -180 && 
      longitude <= 180
    );
  };

  // Selección de proveedor de tiles priorizando español
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  let tileMaxZoom = 18;

  if (ES_TILE_URL) {
    tileUrl = ES_TILE_URL;
    tileAttribution += " | Fuente personalizada ES";
  } else if (MAPTILER_KEY) {
    // MapTiler Streets con idioma español; requiere clave gratuita en VITE_MAPTILER_KEY
    tileUrl = `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}&lang=es`;
    tileAttribution =
      '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">&copy; MapTiler</a> & <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
    tileMaxZoom = 20;
  }
  
  const destinos = (paquete?.destinos || []).map((d) => {
    const label = d.ciudad || d.destino || d.nombre || "";
    const composed = [d.ciudad, d.estado, d.pais].filter(Boolean).join(", ");
    return {
      label: composed || label,
      destino_lat: d.destino_lat || d.lat || d.latitude || null,
      destino_lng: d.destino_lng || d.lng || d.longitude || null,
      descripcion: d.descripcion,
    };
  });

  useEffect(() => {
    // Carga diferida del CSS de Leaflet sólo cuando el mapa se monta
    let cancelled = false;
    (async () => {
      try {
        await import("leaflet/dist/leaflet.css");
      } catch (e) {
        if (!cancelled)
          console.warn(
            "No se pudo cargar el CSS de Leaflet de forma diferida",
            e,
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

        // Título siempre en español, sin emojis
        pin.title = `Destino ${index}: ${location}`;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [mapKey, destinos]);

  const destinosConCoordenadas = destinos.filter(
    (dest) =>
      dest.destino_lat &&
      dest.destino_lng &&
      isValidCoordinate(dest.destino_lat, dest.destino_lng)
  );

  // Si no hay coordenadas válidas, intentar obtener del primer destino del paquete
  if (destinosConCoordenadas.length === 0 && paquete?.destinos?.length > 0) {
    const primerDestino = paquete.destinos[0];
    
    // Intentar diferentes campos de coordenadas
    const lat = primerDestino.destino_lat || 
                primerDestino.lat || 
                primerDestino.latitude ||
                paquete.destino_lat;
    const lng = primerDestino.destino_lng || 
                primerDestino.lng || 
                primerDestino.longitude ||
                paquete.destino_lng;
    
    if (lat && lng && isValidCoordinate(lat, lng)) {
      const label = [primerDestino.ciudad, primerDestino.estado, primerDestino.pais]
        .filter(Boolean)
        .join(", ") || primerDestino.destino || "Destino principal";
      
      destinosConCoordenadas.push({
        label,
        destino_lat: lat,
        destino_lng: lng,
        descripcion: primerDestino.descripcion || "",
      });
    }
  }

  if (destinosConCoordenadas.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
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
    if (destinosConCoordenadas.length === 0) {
      return MEXICO_CENTER; // Siempre mostrar México si no hay coordenadas válidas
    }
    
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
    if (destinosConCoordenadas.length === 0) {
      return 5; // Zoom para ver todo México
    }
    
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

  // Función para abrir en Google Maps
  const openInGoogleMaps = () => {
    if (destinosConCoordenadas.length === 0) return;
    
    if (destinosConCoordenadas.length === 1) {
      // Un solo destino: abrir ubicación directa
      const dest = destinosConCoordenadas[0];
      const lat = parseFloat(dest.destino_lat);
      const lng = parseFloat(dest.destino_lng);
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      // Múltiples destinos: crear ruta
      const origin = destinosConCoordenadas[0];
      const destination = destinosConCoordenadas[destinosConCoordenadas.length - 1];
      const waypoints = destinosConCoordenadas
        .slice(1, -1)
        .map(d => `${parseFloat(d.destino_lat)},${parseFloat(d.destino_lng)}`)
        .join('|');
      
      let url = `https://www.google.com/maps/dir/?api=1&origin=${parseFloat(origin.destino_lat)},${parseFloat(origin.destino_lng)}&destination=${parseFloat(destination.destino_lat)},${parseFloat(destination.destino_lng)}`;
      
      if (waypoints) {
        url += `&waypoints=${waypoints}`;
      }
      
      window.open(url, '_blank');
    }
  };

  const mapCenter = calculateMapCenter();
  const mapZoom = calculateZoom();

  const routeCoordinates = destinosConCoordenadas.map((dest) => [
    parseFloat(dest.destino_lat),
    parseFloat(dest.destino_lng),
  ]);

  return (
    <div className="relative h-full">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
          maxZoom={tileMaxZoom}
        />

        {destinosConCoordenadas.map((dest, index) => {
          const lat = parseFloat(dest.destino_lat);
          const lng = parseFloat(dest.destino_lng);
          const customIcon = createCustomIcon("#3b82f6", dest.label, index);

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
                    {dest.label}
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

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Botón para abrir en Google Maps */}
        {destinosConCoordenadas.length > 0 && (
          <button
            onClick={openInGoogleMaps}
            className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center group"
            aria-label="Abrir en Google Maps"
            title="Abrir en Google Maps"
          >
            <FiExternalLink className="w-5 h-5 text-green-600 group-hover:text-green-700" aria-hidden="true" />
          </button>
        )}
        
        {/* Botón refrescar mapa */}
        <button
          onClick={() => setMapKey((prev) => prev + 1)}
          className="bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Actualizar mapa"
          title="Actualizar mapa"
        >
          <FiRefreshCw className="w-5 h-5 text-blue-600" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default RouteMap;
