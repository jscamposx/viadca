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
}) => (
  <div className="space-y-4">
    {/* Selector de modo */}
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
    </div>

    {/* Información actual */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="p-3 bg-blue-50 rounded-lg">
        <span className="font-medium text-blue-800">Origen actual:</span>
        <p className="text-blue-600 mt-1">{origin?.name || "No seleccionado"}</p>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <span className="font-medium text-green-800">Destino principal:</span>
        <p className="text-green-600 mt-1">{destination?.name || "No seleccionado"}</p>
      </div>
    </div>

    {/* Destinos adicionales */}
    {additionalDestinations && additionalDestinations.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Destinos adicionales:</h4>
        <div className="space-y-2">
          {additionalDestinations.map((dest, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
              <span className="text-orange-700 text-sm">{dest.name}</span>
              <button
                type="button"
                onClick={() => onRemoveDestination && onRemoveDestination(index)}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Botón para agregar destino */}
    {destination?.name && onAddDestination && (
      <button
        type="button"
        onClick={() => onAddDestination({
          name: destination.name,
          lat: destination.lat,
          lng: destination.lng
        })}
        className="w-full py-2 px-4 border border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:bg-orange-50 text-sm"
      >
        + Agregar "{destination.name}" como destino adicional
      </button>
    )}

    {/* Mapa */}
    <div className="w-full h-[400px] rounded-lg relative">
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 w-11/12 sm:w-3/4 md:w-1/2">
        <GooglePlacesSearch
          onPlaceSelected={onPlaceSelected}
          value={searchValue}
          onChange={onSearchValueChange}
          placeholder={`Buscar ${selectionMode === "origen" ? "origen" : "destino"}...`}
        />
      </div>
      <Map
        defaultCenter={center}
        defaultZoom={5}
        onClick={onMapClick}
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
          <AdvancedMarker position={destination} title="Destino Principal">
            <Pin
              background={"#22c55e"}
              borderColor={"#166534"}
              glyphColor={"#ffffff"}
            />
          </AdvancedMarker>
        )}

        {/* Destinos adicionales */}
        {additionalDestinations && additionalDestinations.map((dest, index) => 
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
          ) : null
        )}
      </Map>
    </div>
  </div>
);

export default LocationSelector;
