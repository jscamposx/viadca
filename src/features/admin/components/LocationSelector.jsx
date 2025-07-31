import { useState, useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { FiMapPin, FiTarget, FiPlus, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
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

  useEffect(() => {
    if (!destination) {
      setSelectionMode("destino");
    }
  }, [destination, setSelectionMode]);

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
    <div className="space-y-6">
      {/* Header de configuración */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Configuración de ubicaciones
        </h3>
        <p className="text-slate-600">
          Selecciona el origen, destino principal y destinos adicionales del paquete
        </p>
      </div>

      {/* Modo de selección */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setSelectionMode("origen")}
          className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-medium transition-all ${
            selectionMode === "origen"
              ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
              : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <FiMapPin className="w-5 h-5" />
          <span>Seleccionar Origen</span>
        </button>
        
        <button
          type="button"
          onClick={() => setSelectionMode("destino")}
          className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-medium transition-all ${
            selectionMode === "destino"
              ? "bg-green-50 text-green-700 border-2 border-green-200 shadow-sm"
              : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <FiTarget className="w-5 h-5" />
          <span>Seleccionar Destino</span>
        </button>
        
        {isAddingDestination && (
          <button
            type="button"
            onClick={() => setSelectionMode("nuevo_destino")}
            className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-medium transition-all ${
              selectionMode === "nuevo_destino"
                ? "bg-orange-50 text-orange-700 border-2 border-orange-200 shadow-sm"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <FiPlus className="w-5 h-5" />
            <span>Nuevo Destino</span>
          </button>
        )}
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Estado actual de ubicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FiMapPin className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Origen</span>
          </div>
          <p className="text-blue-700">
            {origin?.name || "No seleccionado"}
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTarget className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Destino principal</span>
          </div>
          <p className="text-green-700">
            {destination?.name || "No seleccionado"}
          </p>
        </div>
      </div>

      {/* Confirmación de nuevo destino */}
      {isAddingDestination && tempDestination && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiPlus className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Nuevo destino</span>
              </div>
              <p className="text-orange-700">{tempDestination.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmNewDestination}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                Confirmar
              </button>
              <button
                type="button"
                onClick={handleCancelNewDestination}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de destinos adicionales */}
      {additionalDestinations && additionalDestinations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Destinos adicionales
          </h4>
          <div className="space-y-2">
            {additionalDestinations.map((dest, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200"
              >
                <span className="text-orange-700 font-medium">{dest.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    onRemoveDestination && onRemoveDestination(index)
                  }
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para agregar destino adicional */}
      {!isAddingDestination && onAddDestination && (
        <button
          type="button"
          onClick={handleAddNewDestination}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 hover:border-orange-400 hover:bg-orange-50 font-medium transition-all"
        >
          <FiPlus className="w-5 h-5" />
          Agregar destino adicional
        </button>
      )}

      {/* Instrucciones para nuevo destino */}
      {isAddingDestination && !tempDestination && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <FiTarget className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">
              Selecciona un nuevo destino
            </span>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            Haz clic en el mapa o busca en la barra de búsqueda para agregar un destino adicional.
          </p>
          <button
            type="button"
            onClick={handleCancelNewDestination}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium underline"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Mapa */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-11/12 sm:w-3/4 md:w-1/2">
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
          className="w-full h-full"
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
  );
};

export default LocationSelector;
