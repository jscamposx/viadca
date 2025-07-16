import { useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const GooglePlacesSearch = ({ onPlaceSelected, value, onChange }) => {
  const inputRef = useRef(null);
  const placeAutocomplete = useRef(null);
  const listenerRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    if (!placeAutocomplete.current) {
      placeAutocomplete.current = new places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
      });
    }

    listenerRef.current = placeAutocomplete.current.addListener(
      "place_changed",
      () => {
        const place = placeAutocomplete.current.getPlace();
        if (place.geometry) {
          // AHORA SE ENVÍA EL OBJETO COMPLETO
          onPlaceSelected(place);
        }
      },
    );

    return () => {
      if (listenerRef.current) {
        window.google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
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
        className="w-full rounded  bg-white p-2 pl-10 pr-10 "
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