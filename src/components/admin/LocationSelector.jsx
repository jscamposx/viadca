import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
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

const LocationSelector = ({ onMapClick, origin, destination }) => (
  <div style={mapContainerStyle}>
    <Map
      defaultCenter={center}
      defaultZoom={5}
      onClick={onMapClick}
      mapId="b21b4a042011d515"
    >
      {isValidLatLng(origin) && (
        <AdvancedMarker position={origin} title="Origen" />
      )}
      {isValidLatLng(destination) && (
        <AdvancedMarker position={destination} title="Destino" />
      )}
    </Map>
  </div>
);

export default LocationSelector;
