import { useState, useEffect, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import StarRating from "./StarRating";

const HotelFinder = ({ destination, onHotelSelect, selectedHotel }) => {
  const places = useMapsLibrary("places");
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para el ID del hotel seleccionado
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  // Estado para controlar la visibilidad del formulario manual
  const [isManualFormVisible, setIsManualFormVisible] = useState(false);

  const [customHotel, setCustomHotel] = useState({
    nombre: "",
    estrellas: 3,
    images: [],
  });

  // Sincronizar el ID seleccionado si ya hay un hotel en el formulario principal
  useEffect(() => {
    if (selectedHotel) {
      setSelectedHotelId(selectedHotel.id);
    }
  }, [selectedHotel]);

  // Configuración del carrusel
  const itemsPerPage = 3;

  const fetchHotels = useCallback(
    async (lat, lng) => {
      if (!places) return;

      setLoading(true);
      setError(null);
      setSearchTerm("");

      try {
        const service = new places.PlacesService(document.createElement("div"));
        const request = {
          location: { lat, lng },
          radius: "5000",
          type: "lodging",
          fields: ["name", "rating", "user_ratings_total", "photos", "place_id"],
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
          images: place.photos
            ? place.photos.map((p) => ({ url: p.getUrl({ maxWidth: 800 }) }))
            : [],
          isCustom: false,
        }));

        setAllHotels(formattedHotels);
        setCurrentPage(0);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [places]
  );

  useEffect(() => {
    if (destination?.lat && destination?.lng) {
      fetchHotels(destination.lat, destination.lng);
    } else {
      setAllHotels([]);
    }
  }, [destination, fetchHotels]);

  useEffect(() => {
    setError(null);
  }, [destination]);

  const filterHotelsByName = (hotels, term) => {
    if (!term.trim()) return hotels;
    return hotels.filter((hotel) =>
      hotel.nombre.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredHotels = filterHotelsByName(allHotels, searchTerm);
  const getCurrentHotels = () => {
    const startIndex = currentPage * itemsPerPage;
    return filteredHotels.slice(startIndex, startIndex + itemsPerPage);
  };
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const handleCustomHotelChange = (e) => {
    const { name, value } = e.target;
    setCustomHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomHotelImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));
    setCustomHotel((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const handleAddCustomHotel = () => {
    setError(null);
    if (!customHotel.nombre.trim()) {
      setError("Por favor ingresa el nombre del hotel");
      return;
    }

    const newHotel = {
      ...customHotel,
      id: `custom-${Date.now()}`,
      isCustom: true,
      total_calificaciones: 0,
    };

    try {
        onHotelSelect(newHotel);
        setSelectedHotelId(newHotel.id);
        setCustomHotel({ nombre: "", estrellas: 3, images: [] });
        setIsManualFormVisible(false);
    } catch(e) {
        console.error("Error al agregar el hotel personalizado:", e);
        setError("Ocurrió un error al agregar el hotel.");
    }
  };

  const handleSelectHotel = (hotel) => {
    try {
        onHotelSelect(hotel);
        setSelectedHotelId(hotel.id);
        setIsManualFormVisible(false);
    } catch (e) {
        console.error("Error al seleccionar el hotel:", e);
        setError("Ocurrió un error al seleccionar el hotel.");
    }
  }

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(0);
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
          <div className="mb-6">
            <label htmlFor="hotelSearch" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar hotel por nombre
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="hotelSearch"
                type="text"
                placeholder="Escribe el nombre del hotel..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

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
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCurrentHotels().map((hotel) => {
                    const isSelected = hotel.id === selectedHotelId;
                    return (
                      <div
                        key={hotel.id}
                        onClick={() => handleSelectHotel(hotel)}
                        className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
                          isSelected ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200'
                        }`}
                      >
                        {hotel.images.length > 0 ? (
                          <div className="h-48 bg-gray-200 overflow-hidden">
                            <img
                              src={hotel.images[0].url}
                              alt={hotel.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">Sin imagen</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-lg text-gray-800 mb-1 truncate">
                            {hotel.nombre}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={hotel.estrellas} size="sm" />
                            <span className="text-sm text-gray-600">
                              {hotel.estrellas.toFixed(1)} ({hotel.total_calificaciones} opiniones)
                            </span>
                          </div>
                          <button className={`w-full mt-2 text-white py-2 px-4 rounded-md transition-colors ${
                            isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}>
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* --- SECCIÓN DE PAGINACIÓN RESTAURADA --- */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                        currentPage === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Anterior
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentPage === index
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                        currentPage === totalPages - 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      Siguiente
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {/* --- FIN DE LA SECCIÓN DE PAGINACIÓN --- */}

              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                {searchTerm ? (
                  <>
                    <p className="text-gray-500 mb-2">
                      No se encontraron hoteles con el nombre "{searchTerm}"
                    </p>
                    <button
                      onClick={clearSearch}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Mostrar todos los hoteles
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">No se encontraron hoteles para este destino.</p>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            {!isManualFormVisible && (
              <button
                onClick={() => setIsManualFormVisible(true)}
                className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-6 rounded-md transition-colors flex items-center justify-center gap-2 border border-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar hotel manualmente
              </button>
            )}

            {isManualFormVisible && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg text-gray-800">
                    Agregar hotel manualmente
                    </h4>
                    <button 
                        onClick={() => setIsManualFormVisible(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imágenes del Hotel
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleCustomHotelImagesChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customHotel.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.url}
                            alt={`preview ${index}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCustomHotel((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index),
                              }))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddCustomHotel}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Agregar y Seleccionar Hotel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelFinder;