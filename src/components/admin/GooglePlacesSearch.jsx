import React, { useRef, useEffect } from "react";

const GooglePlacesSearch = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["(cities)"] }, // Filtra para mostrar solo ciudades
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const { lat, lng } = place.geometry.location;
          // Llama a la función del componente padre con las coordenadas y el nombre del lugar
          onPlaceSelected({ lat: lat(), lng: lng() }, place.formatted_address);
        }
      });
    }

    // Limpia el listener cuando el componente se desmonta
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current,
        );
      }
    };
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Buscar una ciudad..."
      className="w-full p-2 border rounded"
    />
  );
};

export default GooglePlacesSearch;
