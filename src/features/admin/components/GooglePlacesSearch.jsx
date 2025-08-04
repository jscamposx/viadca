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

    // Mejora para compatibilidad móvil - Forzar eventos táctiles
    const pacContainer = document.querySelector(".pac-container");
    if (pacContainer) {
      pacContainer.style.touchAction = "manipulation";
      pacContainer.style.webkitTouchCallout = "none";
      pacContainer.style.webkitUserSelect = "none";
      pacContainer.style.webkitTapHighlightColor = "transparent";
    }

    // Observador para elementos dinámicos del dropdown
    const observer = new MutationObserver(() => {
      const pacItems = document.querySelectorAll(".pac-item");
      pacItems.forEach((item) => {
        if (!item.dataset.mobileFixed) {
          item.style.touchAction = "manipulation";
          item.style.cursor = "pointer";
          item.dataset.mobileFixed = "true";

          // Agregar eventos táctiles adicionales para móvil
          item.addEventListener(
            "touchstart",
            (e) => {
              e.stopPropagation();
              item.style.backgroundColor = "#f0f0f0";
            },
            { passive: true },
          );

          item.addEventListener(
            "touchend",
            (e) => {
              e.stopPropagation();
              item.style.backgroundColor = "";
              // Simular un click después de un pequeño delay
              setTimeout(() => {
                const mouseEvent = new MouseEvent("mousedown", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                });
                item.dispatchEvent(mouseEvent);
              }, 10);
            },
            { passive: true },
          );
        }
      });
    });

    // Iniciar observación del DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.warn = originalWarn;

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
      observer.disconnect();
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
      <FiSearch className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full rounded bg-white p-3 pl-10 pr-10 border border-gray-300 text-base leading-6 touch-manipulation"
        style={{
          fontSize: "16px", // Previene zoom en iOS
          WebkitAppearance: "none",
          touchAction: "manipulation",
        }}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {value && (
        <button
          type="button"
          onClick={handleClearInput}
          className="absolute right-3 p-1 touch-manipulation"
          style={{ touchAction: "manipulation" }}
        >
          <FiX className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
