import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import GooglePlacesSearch from "./GooglePlacesSearch";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
  position: "relative",
};

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
}) => (
  <div style={mapContainerStyle}>
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
        width: "50%",
      }}
    >
      <GooglePlacesSearch
        onPlaceSelected={onPlaceSelected}
        value={searchValue}
        onChange={onSearchValueChange}
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
        <AdvancedMarker position={destination} title="Destino">
          <Pin
            background={"#22c55e"}
            borderColor={"#166534"}
            glyphColor={"#ffffff"}
          />
        </AdvancedMarker>
      )}
    </Map>
  </div>
);

export default LocationSelector;
