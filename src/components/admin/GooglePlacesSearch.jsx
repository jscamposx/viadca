import React, { useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const GooglePlacesSearch = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        onPlaceSelected({ lat: lat(), lng: lng() }, place.formatted_address);
      }
    });

    return () => {
      if (window.google) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [places, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Buscar una ciudad..."
      className="w-full p-2 border rounded bg-white"
    />
  );
};

export default GooglePlacesSearch;