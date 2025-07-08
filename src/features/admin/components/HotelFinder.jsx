import { useState, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import StarRating from "./StarRating";

const HotelFinder = ({ destination, onHotelSelect }) => {
  const places = useMapsLibrary("places");
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [starFilter, setStarFilter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customHotel, setCustomHotel] = useState({
    nombre: "",
    estrellas: 3,
    precio: "",
  });

  const fetchHotels = useCallback(
    async (lat, lng) => {
      if (!places) return;

      setLoading(true);
      setError(null);

      try {
        const service = new places.PlacesService(document.createElement("div"));
        const request = {
          location: { lat, lng },
          radius: "5000",
          type: "lodging",
          fields: [
            "name",
            "rating",
            "user_ratings_total",
            "price_level",
            "photos",
          ],
        };

        const results = await new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === places.PlacesServiceStatus.OK) {
              resolve(results || []);
            } else {
              reject(new Error(`Error fetching hotels: ${status}`));
            }
          });
        });

        const formattedHotels = results.map((place) => ({
          id: place.place_id || Math.random().toString(36).substring(7),
          nombre: place.name,
          estrellas: place.rating || 0,
          total_calificaciones: place.user_ratings_total || 0,
          precio: place.price_level
            ? "$".repeat(place.price_level) + " (aprox.)"
            : "Consultar",
          foto: place.photos?.[0]?.getUrl({ maxWidth: 300 }),
          isCustom: false,
        }));

        setAllHotels(formattedHotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [places],
  );

  useEffect(() => {
    if (destination?.lat && destination?.lng) {
      fetchHotels(destination.lat, destination.lng);
    }
  }, [destination, fetchHotels]);

  useEffect(() => {
    const filtered =
      starFilter > 0
        ? allHotels.filter((hotel) => hotel.estrellas >= starFilter)
        : allHotels;
    setFilteredHotels(filtered);
  }, [starFilter, allHotels]);

  const handleCustomHotelChange = (e) => {
    const { name, value } = e.target;
    setCustomHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomHotel = () => {
    if (!customHotel.nombre.trim()) {
      setError("Por favor ingresa el nombre del hotel");
      return;
    }
    if (!customHotel.precio) {
      setError("Por favor ingresa el precio del hotel");
      return;
    }

    const newHotel = {
      ...customHotel,
      id: `custom-${Date.now()}`,
      isCustom: true,
      total_calificaciones: 0,
      precio: `$${customHotel.precio}`,
    };

    onHotelSelect(newHotel);
    setCustomHotel({ nombre: "", estrellas: 3, precio: "" });
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Buscador de Hoteles
        </h3>
        {!destination?.lat && (
          <p className="mt-2 text-gray-500">
            Selecciona un destino para buscar hoteles cercanos.
          </p>
        )}
      </div>

      {destination?.lat && (
        <div className="p-6">
          {/* Filtros */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Filtrar por calificación
                </h4>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={starFilter}
                    setRating={setStarFilter}
                    interactive
                    size="lg"
                  />
                  {starFilter > 0 && (
                    <button
                      onClick={() => setStarFilter(0)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {filteredHotels.length}{" "}
                {filteredHotels.length === 1
                  ? "hotel encontrado"
                  : "hoteles encontrados"}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => onHotelSelect(hotel)}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {hotel.foto && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={hotel.foto}
                          alt={hotel.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-1">
                        {hotel.nombre}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={hotel.estrellas} size="sm" />
                        <span className="text-sm text-gray-600">
                          {hotel.estrellas.toFixed(1)} (
                          {hotel.total_calificaciones} opiniones)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {hotel.precio}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Seleccionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">
                  No se encontraron hoteles con ese filtro.
                </p>
                <p className="text-gray-400 text-sm">
                  Intenta con menos estrellas o agrega uno manualmente.
                </p>
              </div>
            )}
          </div>

          {/* Formulario para hotel personalizado */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-lg text-gray-800 mb-4">
              Agregar hotel manualmente
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Hotel *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej. Hotel Paradise"
                    value={customHotel.nombre}
                    onChange={handleCustomHotelChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por noche *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio"
                      placeholder="Ej. 1200"
                      value={customHotel.precio}
                      onChange={handleCustomHotelChange}
                      min="0"
                      className="w-full pl-8 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calificación
                  </label>
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={customHotel.estrellas}
                      setRating={(rating) =>
                        setCustomHotel((prev) => ({
                          ...prev,
                          estrellas: rating,
                        }))
                      }
                      interactive
                    />
                    <span className="text-sm text-gray-600">
                      {customHotel.estrellas} estrellas
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddCustomHotel}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Agregar y Seleccionar Hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelFinder;
