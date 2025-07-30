import { useState, useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import GooglePlacesSearch from "./GooglePlacesSearch";

const center = {
  lat: 23.6345,
  lng: -102.5528,
};

const isValidLatLng = (coord) =>
  coord &&
  typeof coord.lat === "number" &&
  typeof coord.lng === "number" &&
  !isNaN(coord.lat) &&
  !isNaN(coord.lng);

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
}) => {
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [tempDestination, setTempDestination] = useState(null);
  const [message, setMessage] = useState(null);
  const [newDestinationSearch, setNewDestinationSearch] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    if (
      origin ||
      (additionalDestinations && additionalDestinations.length > 0)
    ) {
      setShowAdvancedOptions(true);
    } else if (!destination) {
      setShowAdvancedOptions(false);
      setSelectionMode("destino");
    }
  }, [origin, additionalDestinations, destination, setSelectionMode]);

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

  const handlePlaceSelected = (place) => {
    if (selectionMode === "nuevo_destino") {
      const { geometry, formatted_address } = place;
      if (geometry) {
        const { lat, lng } = geometry.location;
        const simplifiedAddress = formatted_address
          .split(",")
          .slice(0, 2)
          .join(", ");

        setTempDestination({
          name: simplifiedAddress,
          lat: lat(),
          lng: lng(),
        });
        setNewDestinationSearch(simplifiedAddress);
      }
    } else {
      onPlaceSelected(place);
    }
  };

  const handleSearchChange = (value) => {
    if (selectionMode === "nuevo_destino") {
      setNewDestinationSearch(value);
    } else {
      onSearchValueChange(value);
    }
  };

  const handleMapClick = (event) => {
    if (selectionMode === "nuevo_destino") {
      const latLng = event.detail.latLng;
      if (!latLng) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          location: latLng,
          language: "es",
          region: "MX",
        },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const place = results[0];
            const simplifiedAddress = place.formatted_address
              .split(",")
              .slice(0, 2)
              .join(", ");

            setTempDestination({
              name: simplifiedAddress,
              lat: latLng.lat,
              lng: latLng.lng,
            });
            setNewDestinationSearch(simplifiedAddress);
          }
        },
      );
    } else {
      onMapClick(event);
    }
  };

  return (
    <div className="space-y-4">
      {!showAdvancedOptions && !destination && (
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¿A dónde vas?
            </h3>
            <p className="text-sm text-gray-600">
              Busca el destino principal de tu paquete turístico
            </p>
          </div>

          <div className="w-full h-[400px] rounded-lg relative">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 w-11/12 sm:w-3/4 md:w-1/2">
              <GooglePlacesSearch
                onPlaceSelected={onPlaceSelected}
                value={searchValue}
                onChange={onSearchValueChange}
                placeholder="Busca tu destino (ej: París, Cancún, Barcelona...)"
              />
            </div>
            <Map
              defaultCenter={center}
              defaultZoom={3}
              onClick={onMapClick}
              mapId="b21b4a042011d515"
              fullscreenControl={false}
              mapTypeControl={false}
              streetViewControl={false}
            >
              {isValidLatLng(destination) && (
                <AdvancedMarker
                  position={destination}
                  title="Destino Principal"
                >
                  <Pin
                    background={"#22c55e"}
                    borderColor={"#166534"}
                    glyphColor={"#ffffff"}
                  />
                </AdvancedMarker>
              )}
            </Map>
          </div>

          {destination && (
            <div className="text-center space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">
                  ✅ Destino seleccionado
                </h4>
                <p className="text-green-700 mt-1">{destination.name}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedOptions(true)}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                + Configurar origen o agregar más destinos
              </button>
            </div>
          )}
        </div>
      )}

      {showAdvancedOptions && (
        <div className="space-y-4">
          {showAdvancedOptions && (
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Configuración de ubicaciones
              </h3>
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Simplificar vista
              </button>
            </div>
          )}

          <div className="flex gap-3 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectionMode("origen")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectionMode === "origen"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              📍 Seleccionar Origen
            </button>
            <button
              type="button"
              onClick={() => setSelectionMode("destino")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectionMode === "destino"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              🎯 Seleccionar Destino
            </button>
            {isAddingDestination && (
              <button
                type="button"
                onClick={() => setSelectionMode("nuevo_destino")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectionMode === "nuevo_destino"
                    ? "bg-orange-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
              >
                ➕ Nuevo Destino
              </button>
            )}
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Origen actual:</span>
              <p className="text-blue-600 mt-1">
                {origin?.name || "No seleccionado"}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">
                Destino principal:
              </span>
              <p className="text-green-600 mt-1">
                {destination?.name || "No seleccionado"}
              </p>
            </div>
          </div>

          {isAddingDestination && tempDestination && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-orange-800">
                    Nuevo destino:
                  </span>
                  <p className="text-orange-600 mt-1">{tempDestination.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmNewDestination}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    ✓ Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelNewDestination}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {additionalDestinations && additionalDestinations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Destinos adicionales:
              </h4>
              <div className="space-y-2">
                {additionalDestinations.map((dest, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200"
                  >
                    <span className="text-orange-700 text-sm">{dest.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onRemoveDestination && onRemoveDestination(index)
                      }
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isAddingDestination && onAddDestination && (
            <button
              type="button"
              onClick={handleAddNewDestination}
              className="w-full py-2 px-4 border border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:bg-orange-50 text-sm"
            >
              + Agregar destino adicional
            </button>
          )}

          {isAddingDestination && !tempDestination && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 text-sm font-medium">
                🎯 Selecciona un nuevo destino en el mapa o busca en la barra de
                búsqueda
              </p>
              <button
                type="button"
                onClick={handleCancelNewDestination}
                className="mt-2 text-orange-600 hover:text-orange-800 text-sm underline"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="w-full h-[400px] rounded-lg relative">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 w-11/12 sm:w-3/4 md:w-1/2">
              <GooglePlacesSearch
                onPlaceSelected={handlePlaceSelected}
                value={
                  selectionMode === "nuevo_destino"
                    ? newDestinationSearch
                    : searchValue
                }
                onChange={handleSearchChange}
                placeholder={
                  selectionMode === "origen"
                    ? "Buscar origen..."
                    : selectionMode === "nuevo_destino"
                      ? "Buscar nuevo destino..."
                      : "Buscar destino principal..."
                }
              />
            </div>
            <Map
              defaultCenter={center}
              defaultZoom={5}
              onClick={handleMapClick}
              mapId="b21b4a042011d515"
              fullscreenControl={false}
              mapTypeControl={false}
              streetViewControl={false}
            >
              {isValidLatLng(origin) && (
                <AdvancedMarker position={origin} title="Origen">
                  <Pin
                    background={"#2563eb"}
                    borderColor={"#1e40af"}
                    glyphColor={"#ffffff"}
                  />
                </AdvancedMarker>
              )}

              {isValidLatLng(destination) && (
                <AdvancedMarker
                  position={destination}
                  title="Destino Principal"
                >
                  <Pin
                    background={"#22c55e"}
                    borderColor={"#166534"}
                    glyphColor={"#ffffff"}
                  />
                </AdvancedMarker>
              )}

              {isValidLatLng(tempDestination) && (
                <AdvancedMarker
                  position={tempDestination}
                  title={`Nuevo destino: ${tempDestination.name}`}
                >
                  <Pin
                    background={"#f59e0b"}
                    borderColor={"#d97706"}
                    glyphColor={"#ffffff"}
                  />
                </AdvancedMarker>
              )}

              {additionalDestinations &&
                additionalDestinations.map((dest, index) =>
                  isValidLatLng(dest) ? (
                    <AdvancedMarker
                      key={index}
                      position={dest}
                      title={`Destino ${index + 2}: ${dest.name}`}
                    >
                      <Pin
                        background={"#f97316"}
                        borderColor={"#ea580c"}
                        glyphColor={"#ffffff"}
                      />
                    </AdvancedMarker>
                  ) : null,
                )}
            </Map>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
