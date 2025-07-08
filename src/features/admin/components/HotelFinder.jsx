import { useState, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import StarRating from "./StarRating";

const HotelFinder = ({ destination, onHotelSelect }) => {
  const places = useMapsLibrary("places");
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [starFilter, setStarFilter] = useState(0);
  const [customHotel, setCustomHotel] = useState({
    nombre: "",
    estrellas: 3,
    precio: "",
  });

  const fetchHotels = useCallback(
    (lat, lng) => {
      if (!places) return;

      const service = new places.PlacesService(document.createElement("div"));
      const request = {
        location: { lat, lng },
        radius: "5000",
        type: "lodging",
        fields: ["name", "rating", "user_ratings_total", "price_level"],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === places.PlacesServiceStatus.OK && results) {
          const formattedHotels = results.map((place) => ({
            nombre: place.name,
            estrellas: place.rating || 0,
            total_calificaciones: place.user_ratings_total || 0,
            precio: "Consultar",
            isCustom: false,
          }));
          setAllHotels(formattedHotels);
        }
      });
    },
    [places],
  );

  useEffect(() => {
    if (destination && destination.lat && destination.lng) {
      fetchHotels(destination.lat, destination.lng);
    }
  }, [destination, fetchHotels]);

  useEffect(() => {
    const filtered = allHotels.filter((hotel) => hotel.estrellas >= starFilter);
    setFilteredHotels(filtered);
  }, [starFilter, allHotels]);

  const handleCustomHotelChange = (e) => {
    const { name, value } = e.target;
    setCustomHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomHotel = () => {
    if (customHotel.nombre && customHotel.precio) {
      const newHotel = { ...customHotel, isCustom: true };
      onHotelSelect(newHotel);
      setCustomHotel({ nombre: "", estrellas: 3, precio: "" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Buscador de Hoteles
      </h3>
      {destination && destination.lat ? (
        <>
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <label className="block font-semibold mb-2">
              Filtrar por calificación mínima:
            </label>
            <div className="flex items-center gap-4">
              <StarRating rating={starFilter} setRating={setStarFilter} />
              {starFilter > 0 && (
                <button
                  type="button"
                  onClick={() => setStarFilter(0)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto mb-4">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <div
                  key={index}
                  onClick={() => onHotelSelect(hotel)}
                  className="p-3 mb-2 border rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <p className="font-bold">{hotel.nombre}</p>
                  <p>
                    Calificación: {hotel.estrellas.toFixed(1)} ⭐ (
                    {hotel.total_calificaciones} opiniones)
                  </p>
                  <p>Precio: {hotel.precio}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No se encontraron hoteles con ese filtro. Intenta con menos
                estrellas o agrega uno manualmente.
              </p>
            )}
          </div>

          {/* Formulario para hotel personalizado */}
          <div className="p-4 border rounded-md">
            <h4 className="font-semibold mb-2">
              ¿No encuentras el hotel? Agrégalo manualmente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del Hotel"
                value={customHotel.nombre}
                onChange={handleCustomHotelChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio por noche"
                value={customHotel.precio}
                onChange={handleCustomHotelChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center">
                <label className="mr-2">Estrellas:</label>
                <StarRating
                  rating={customHotel.estrellas}
                  setRating={(rating) =>
                    setCustomHotel((prev) => ({ ...prev, estrellas: rating }))
                  }
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddCustomHotel}
              className="mt-3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Agregar y Seleccionar Hotel
            </button>
          </div>
        </>
      ) : (
        <p>Selecciona un destino para buscar hoteles cercanos.</p>
      )}
    </div>
  );
};

export default HotelFinder;
