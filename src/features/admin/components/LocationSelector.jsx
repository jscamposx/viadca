import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FiMapPin,
  FiTarget,
  FiPlus,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import LocationSearch from "./LocationSearch";
import { reverseGeocode } from "../../../services/geocodingService";

const center = [23.6345, -102.5528];

const isValidLatLng = (coord) =>
  coord &&
  typeof coord.lat === "number" &&
  typeof coord.lng === "number" &&
  !isNaN(coord.lat) &&
  !isNaN(coord.lng);

// Helper component to handle map clicks
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

// Helper component to recenter map
const Recenter = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

// Draggable marker component with reverse geocoding
const DraggableMarker = ({ position, icon, onDragEnd }) => {
  const [markerPosition, setMarkerPosition] = useState(position);
  const markerRef = useRef(null);

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  const eventHandlers = {
    dragend: async () => {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        setMarkerPosition([newPos.lat, newPos.lng]);
        
        if (onDragEnd) {
          // Reverse geocode to get address
          try {
            const geocodeResult = await reverseGeocode(newPos.lat, newPos.lng, true);
            onDragEnd({ 
              lat: newPos.lat, 
              lng: newPos.lng, 
              name: geocodeResult?.displayName || "Ubicación",
              displayName: geocodeResult?.displayName,
              city: geocodeResult?.city,
              state: geocodeResult?.state,
              country: geocodeResult?.country,
            });
          } catch (error) {
            console.error("Error en geocodificación inversa:", error);
            onDragEnd({ lat: newPos.lat, lng: newPos.lng, name: "Ubicación" });
          }
        }
      }
    },
  };

  return (
    <Marker
      position={markerPosition}
      icon={icon}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
};

// Custom marker icons
const createMarkerIcon = (color) => {
  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.836 16 24 16 24s16-15.164 16-24C32 7.163 24.837 0 16 0z" 
            fill="${color}" 
            stroke="#fff" 
            stroke-width="2"/>
      <circle cx="16" cy="16" r="5" fill="#fff"/>
    </svg>
  `;
  
  return divIcon({
    html: svgIcon,
    className: "custom-marker-icon",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

const originIcon = createMarkerIcon("#2563eb");
const destinationIcon = createMarkerIcon("#22c55e");
const newDestinationIcon = createMarkerIcon("#f59e0b");
const additionalDestinationIcon = createMarkerIcon("#a855f7");

const LocationSelector = ({
  onMapClick,
  origin,
  destination,
  onPlaceSelected,
  searchValue,
  onSearchValueChange,
  selectionMode,
  setSelectionMode,
  additionalDestinations = [],
  onAddDestination,
  onRemoveDestination,
  onUpdateDestination,
}) => {
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [tempDestination, setTempDestination] = useState(null);
  const [message, setMessage] = useState(null);
  const [newDestinationSearch, setNewDestinationSearch] = useState("");
  const [editingDestinationIndex, setEditingDestinationIndex] = useState(null);

  useEffect(() => {
    if (!destination) {
      setSelectionMode("destino");
    }
  }, [destination]);

  const handleAddNewDestination = () => {
    setIsAddingDestination(true);
    setTempDestination(null);
    setMessage(null);
    setNewDestinationSearch("");
    setSelectionMode("nuevo_destino");
  };

  const handleConfirmNewDestination = () => {
    if (tempDestination && onAddDestination) {
      const success = onAddDestination(tempDestination);
      if (success !== false) {
        setIsAddingDestination(false);
        setTempDestination(null);
        setSelectionMode("destino");
        setMessage({
          type: "success",
          text: `Destino "${tempDestination.name}" agregado correctamente`,
        });
      } else {
        setMessage({
          type: "error",
          text: `El destino "${tempDestination.name}" ya existe`,
        });
      }

      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancelNewDestination = () => {
    setIsAddingDestination(false);
    setTempDestination(null);
    setNewDestinationSearch("");
    setSelectionMode("destino");
  };

  const handlePlaceSelected = async (place) => {
    if (selectionMode === "nuevo_destino") {
      const { lat, lng, name, displayName, city, state } = place;
      if (lat && lng) {
        const addressName = name || displayName || [city, state].filter(Boolean).join(", ") || "Ubicación";
        const simplifiedAddress = addressName.split(",").slice(0, 2).join(", ");

        setTempDestination({
          name: simplifiedAddress,
          lat: lat,
          lng: lng,
        });
        setNewDestinationSearch(simplifiedAddress);
      }
    } else if (editingDestinationIndex !== null) {
      // Editando un destino adicional existente
      if (onUpdateDestination && place.lat && place.lng) {
        const addressName = place.name || place.displayName || "Ubicación";
        onUpdateDestination(editingDestinationIndex, {
          name: addressName,
          lat: place.lat,
          lng: place.lng,
          city: place.city,
          state: place.state,
          country: place.country,
        });
        setEditingDestinationIndex(null);
        setSelectionMode("destino");
      }
    } else {
      // Pasar los datos correctamente formateados
      onPlaceSelected({
        lat: place.lat,
        lng: place.lng,
        address: place.name || place.displayName || place.address || "Ubicación",
        city: place.city,
        state: place.state,
        country: place.country,
      });
    }
  };

  const handleSearchChange = (value) => {
    if (selectionMode === "nuevo_destino") {
      setNewDestinationSearch(value);
    } else {
      onSearchValueChange(value);
    }
  };

  const handleMapClick = async (latLng) => {
    if (selectionMode === "nuevo_destino") {
      try {
        const geocodeResult = await reverseGeocode(latLng.lat, latLng.lng, true);
        const addressName = geocodeResult?.displayName || "Ubicación sin nombre";
        const simplifiedAddress = addressName.split(",").slice(0, 2).join(", ");

        setTempDestination({
          name: simplifiedAddress,
          lat: latLng.lat,
          lng: latLng.lng,
        });
        setNewDestinationSearch(simplifiedAddress);
      } catch (error) {
        console.error("Error en geocodificación inversa:", error);
        setTempDestination({
          name: "Ubicación sin nombre",
          lat: latLng.lat,
          lng: latLng.lng,
        });
      }
    } else if (editingDestinationIndex !== null) {
      // Editando un destino adicional existente
      try {
        const geocodeResult = await reverseGeocode(latLng.lat, latLng.lng, true);
        if (onUpdateDestination) {
          onUpdateDestination(editingDestinationIndex, {
            name: geocodeResult?.displayName || "Ubicación sin nombre",
            lat: latLng.lat,
            lng: latLng.lng,
            city: geocodeResult?.city,
            state: geocodeResult?.state,
            country: geocodeResult?.country,
          });
          setEditingDestinationIndex(null);
          setSelectionMode("destino");
        }
      } catch (error) {
        console.error("Error en geocodificación inversa:", error);
      }
    } else {
      // Llamar onMapClick con el evento formateado para compatibilidad
      if (onMapClick) {
        onMapClick({
          detail: {
            latLng: {
              lat: latLng.lat,
              lng: latLng.lng,
            },
          },
        });
      }
    }
  };

  const handleMarkerDragEnd = (locationData, type) => {
    if (type === "origin") {
      onPlaceSelected({
        lat: locationData.lat,
        lng: locationData.lng,
        address: locationData.name || "Ubicación sin nombre",
      });
      setSelectionMode("origen");
    } else if (type === "destination") {
      onPlaceSelected({
        lat: locationData.lat,
        lng: locationData.lng,
        address: locationData.name || "Ubicación sin nombre",
      });
      setSelectionMode("destino");
    } else if (type === "newDestination") {
      setTempDestination({
        name: locationData.name || "Ubicación sin nombre",
        lat: locationData.lat,
        lng: locationData.lng,
      });
      setNewDestinationSearch(locationData.name || "");
    }
  };

  // Calculate map center based on markers
  const getMapCenter = () => {
    if (tempDestination) {
      return [tempDestination.lat, tempDestination.lng];
    }
    if (destination) {
      return [destination.lat, destination.lng];
    }
    if (origin) {
      return [origin.lat, origin.lng];
    }
    return center;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Configuración de ubicaciones
        </h3>
        <p className="text-slate-600">
          Selecciona el origen, destino principal y destinos adicionales del
          paquete
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setSelectionMode("origen")}
          className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-medium transition-all text-sm sm:text-base ${
            selectionMode === "origen"
              ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
              : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Seleccionar Origen</span>
          <span className="sm:hidden">Origen</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectionMode("destino")}
          className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-medium transition-all text-sm sm:text-base ${
            selectionMode === "destino"
              ? "bg-green-50 text-green-700 border-2 border-green-200 shadow-sm"
              : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <FiTarget className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Seleccionar Destino</span>
          <span className="sm:hidden">Destino</span>
        </button>

        {isAddingDestination && (
          <button
            type="button"
            onClick={() => setSelectionMode("nuevo_destino")}
            className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-medium transition-all text-sm sm:text-base col-span-2 sm:col-span-1 ${
              selectionMode === "nuevo_destino"
                ? "bg-orange-50 text-orange-700 border-2 border-orange-200 shadow-sm"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nuevo Destino</span>
            <span className="sm:hidden">+ Destino</span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-3 sm:p-4 rounded-xl border text-sm sm:text-base ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <FiMapPin className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-blue-900 text-sm sm:text-base">Origen</span>
          </div>
          <p className="text-blue-800 font-medium text-sm sm:text-base truncate">
            {origin?.name || "No seleccionado"}
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <FiTarget className="w-4 h-4 text-green-700" />
            <span className="font-semibold text-green-900 text-sm sm:text-base">
              Destino principal
            </span>
          </div>
          <p className="text-green-800 font-medium text-sm sm:text-base truncate">
            {destination?.name || "No seleccionado"}
          </p>
        </div>
      </div>

      {isAddingDestination && tempDestination && (
        <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <FiPlus className="w-4 h-4 text-orange-700" />
                <span className="font-semibold text-orange-900 text-sm sm:text-base">
                  Nuevo destino
                </span>
              </div>
              <p className="text-orange-800 font-medium text-sm sm:text-base truncate">
                {tempDestination.name}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleConfirmNewDestination}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                Confirmar
              </button>
              <button
                type="button"
                onClick={handleCancelNewDestination}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {additionalDestinations && additionalDestinations.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            Destinos adicionales
          </h4>
          <div className="space-y-2">
            {additionalDestinations.map((dest, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border gap-2 transition-all ${
                  editingDestinationIndex === index
                    ? "bg-blue-50 border-blue-400 shadow-md"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <span className="text-orange-800 font-semibold text-sm sm:text-base truncate flex-1">
                  {dest.name}
                </span>
                <div className="flex gap-1.5">
                  {editingDestinationIndex === index ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDestinationIndex(null);
                        setSelectionMode("destino");
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                      Cancelar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDestinationIndex(index);
                        setSelectionMode(`destino_${index}`);
                        if (onSearchValueChange) onSearchValueChange(dest?.name || "");
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      Editar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      onRemoveDestination && onRemoveDestination(index)
                    }
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"
                  >
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAddingDestination && onAddDestination && (
        <button
          type="button"
          onClick={handleAddNewDestination}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 px-3 sm:px-4 border-2 border-dashed border-orange-400 rounded-xl text-orange-700 hover:border-orange-500 hover:bg-orange-50 font-semibold transition-all text-sm sm:text-base"
        >
          <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Agregar destino adicional</span>
          <span className="sm:hidden">+ Destino adicional</span>
        </button>
      )}

      {/* Instrucciones para nuevo destino */}
      {isAddingDestination && !tempDestination && (
        <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <FiTarget className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
            <span className="font-semibold text-orange-900 text-sm sm:text-base">
              Selecciona un nuevo destino
            </span>
          </div>
          <p className="text-orange-800 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
            Haz clic en el mapa o busca en la barra de búsqueda para agregar un
            destino adicional.
          </p>
          <button
            type="button"
            onClick={handleCancelNewDestination}
            className="text-orange-700 hover:text-orange-900 text-xs sm:text-sm font-semibold underline"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg relative border border-slate-200">
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] sm:w-11/12 md:w-3/4 lg:w-1/2 px-2 sm:px-0">
          <LocationSearch
            onPlaceSelected={handlePlaceSelected}
            searchValue={
              selectionMode === "nuevo_destino"
                ? newDestinationSearch
                : searchValue
            }
            onSearchValueChange={handleSearchChange}
            placeholder={
              selectionMode === "origen"
                ? "Buscar origen..."
                : selectionMode === "nuevo_destino"
                  ? "Buscar nuevo destino..."
                  : editingDestinationIndex !== null
                    ? `Editar destino adicional ${editingDestinationIndex + 1}...`
                    : "Buscar destino principal..."
            }
          />
        </div>
        <MapContainer
          center={center}
          zoom={5}
          style={{ width: "100%", height: "100%", zIndex: 0 }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEvents onMapClick={handleMapClick} />
          <Recenter center={getMapCenter()} />

          {isValidLatLng(origin) && (
            <DraggableMarker
              position={[origin.lat, origin.lng]}
              icon={originIcon}
              onDragEnd={(data) => handleMarkerDragEnd(data, "origin")}
            />
          )}

          {isValidLatLng(destination) && (
            <DraggableMarker
              position={[destination.lat, destination.lng]}
              icon={destinationIcon}
              onDragEnd={(data) => handleMarkerDragEnd(data, "destination")}
            />
          )}

          {isValidLatLng(tempDestination) && (
            <DraggableMarker
              position={[tempDestination.lat, tempDestination.lng]}
              icon={newDestinationIcon}
              onDragEnd={(data) => handleMarkerDragEnd(data, "newDestination")}
            />
          )}

          {additionalDestinations &&
            additionalDestinations.length > 0 &&
            additionalDestinations.map((dest, index) => {
              if (!dest || !isValidLatLng(dest)) return null;
              const isEditing = editingDestinationIndex === index;
              return (
                <DraggableMarker
                  key={`additional-${index}-${dest.lat}-${dest.lng}`}
                  position={[dest.lat, dest.lng]}
                  icon={isEditing ? newDestinationIcon : additionalDestinationIcon}
                  onDragEnd={(data) => {
                    if (onUpdateDestination) {
                      // Actualizar el destino adicional con los nuevos datos
                      onUpdateDestination(index, {
                        name: data.name || data.displayName || dest.name,
                        lat: data.lat,
                        lng: data.lng,
                      });
                    }
                  }}
                />
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationSelector;
