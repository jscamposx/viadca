import { useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { FiSearch, FiX } from "react-icons/fi";

const INTERNATIONAL_CITIES = [
  "madrid",
  "barcelona",
  "paris",
  "london",
  "rome",
  "berlin",
  "amsterdam",
  "tokyo",
  "new york",
  "los angeles",
  "miami",
  "chicago",
  "toronto",
  "vancouver",
  "buenos aires",
  "santiago",
  "lima",
  "bogota",
  "caracas",
  "dubai",
  "istanbul",
  "moscow",
  "beijing",
  "hong kong",
  "singapore",
  "sydney",
  "melbourne",
  "mumbai",
  "delhi",
  "bangkok",
  "seoul",
];

const GooglePlacesSearch = ({
  onPlaceSelected,
  value,
  onChange,
  placeholder = "Buscar una ciudad...",
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === "string" &&
        (message.includes(
          "google.maps.places.Autocomplete is not available to new customers",
        ) ||
          message.includes(
            "google.maps.places.PlacesService is not available to new customers",
          ))
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    if (!autocompleteRef.current) {
      autocompleteRef.current = new places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
        language: "es",

        fields: [
          "place_id",
          "formatted_address",
          "geometry",
          "name",
          "address_components",
        ],
      });
    }

    const listener = autocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          onPlaceSelected(place);
        }
      },
    );

    console.warn = originalWarn;

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="relative flex items-center">
      <FiSearch className="absolute left-3 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full rounded bg-white p-2 pl-10 pr-10 border border-gray-300"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button
          type="button"
          onClick={handleClearInput}
          className="absolute right-3"
        >
          <FiX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
