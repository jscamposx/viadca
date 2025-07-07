import React, { useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const GooglePlacesSearch = ({ onPlaceSelected, value, onChange }) => {
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
      // The google object can be undefined when the component is unmounted
      if (window.google && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [places, onPlaceSelected]);

  const handleClearInput = () => {
    if (onChange) {
      onChange("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar una ciudad..."
        className="w-full rounded border bg-white p-2 pl-10 pr-10"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={handleClearInput}
          className="absolute right-3"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
