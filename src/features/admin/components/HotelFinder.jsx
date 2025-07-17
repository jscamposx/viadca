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
  const [selectedHotelInfo, setSelectedHotelInfo] = useState(null);
  const [isManualFormVisible, setIsManualFormVisible] = useState(false);
  const [customHotel, setCustomHotel] = useState({
    nombre: "",
    estrellas: 3,
    images: [],
  });

  useEffect(() => {
    setSelectedHotelInfo(selectedHotel);
    if (
      selectedHotel &&
      !allHotels.some((hotel) => hotel.id === selectedHotel.id)
    ) {
      setAllHotels((prev) => [selectedHotel, ...prev]);
    }
  }, [selectedHotel]);

  const itemsPerPage = 3;

  const fetchHotels = useCallback(
    async (lat, lng) => {
      if (!places) return;
      setLoading(true);
      setError(null);
      setAllHotels([]);
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
            "photos",
            "place_id",
          ],
        };

        const results = await new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === places.PlacesServiceStatus.OK) {
              resolve(results || []);
            } else if (status === places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              reject(new Error(`Error fetching hotels: ${status}`));
            }
          });
        });

        const formattedHotels = results.map((place) => ({
          id: place.place_id,
          place_id: place.place_id,
          nombre: place.name,
          estrellas: place.rating || 0,
          total_calificaciones: place.user_ratings_total || 0,
          previewImageUrl: place.photos
            ? place.photos[0].getUrl({ maxWidth: 800 })
            : null,
          images: null,
          isCustom: false,
        }));

        setAllHotels(formattedHotels);
        setCurrentPage(0);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("No se pudieron cargar los hoteles. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [places],
  );

  useEffect(() => {
    if (destination?.lat && destination?.lng) {
      fetchHotels(destination.lat, destination.lng);
    } else {
      setAllHotels([]);
    }
  }, [destination, fetchHotels]);

  const handleSelectHotel = (hotel) => {
    onHotelSelect(hotel);
    setSelectedHotelInfo(hotel);
    setIsManualFormVisible(false);
  };

  const handleShowManualForm = () => {
    onHotelSelect(null);
    setSelectedHotelInfo(null);
    setIsManualFormVisible(true);
  };

  const handleAddCustomHotel = () => {
    if (!customHotel.nombre.trim()) {
      setError("Por favor ingresa el nombre del hotel.");
      return;
    }
    setError(null);
    const newHotel = {
      id: `custom-${Date.now()}`,
      nombre: customHotel.nombre,
      estrellas: customHotel.estrellas,
      images: customHotel.images.map((img, index) => ({
        ...img,
        orden: index + 1,
      })),
      isCustom: true,
      total_calificaciones: null,
    };
    setAllHotels((prev) => [newHotel, ...prev]);
    onHotelSelect(newHotel);
    setSelectedHotelInfo(newHotel);
    setCustomHotel({ nombre: "", estrellas: 3, images: [] });
    setIsManualFormVisible(false);
  };

  const handleCustomHotelChange = (e) => {
    const { name, value } = e.target;
    setCustomHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomHotelImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          url: base64,
          file: file,
        };
      }),
    );
    setCustomHotel((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const filterHotelsByName = (hotels, term) => {
    if (!term.trim()) return hotels;
    return hotels.filter((hotel) =>
      hotel.nombre.toLowerCase().includes(term.toLowerCase()),
    );
  };

  const filteredHotels = filterHotelsByName(allHotels, searchTerm);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const getCurrentHotels = () => {
    const startIndex = currentPage * itemsPerPage;
    return filteredHotels.slice(startIndex, startIndex + itemsPerPage);
  };

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
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
    <div className="bg-white rounded-xl  overflow-hidden transition-all duration-300 ">
      <div className="">
        {!destination?.lat && (
          <p className="mt-2 text-gray-600">
            Selecciona un destino en el mapa para buscar hoteles cercanos.
          </p>
        )}
      </div>

      {destination?.lat && (
        <div className="p-6">
          <div className="mb-6">
            <label
              htmlFor="hotelSearch"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Buscar hotel por nombre
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="hotelSearch"
                type="text"
                placeholder="Escribe el nombre del hotel..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Buscando hoteles cercanos...</p>
              </div>
            ) : error && !isManualFormVisible ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4 flex items-start">
                <svg
                  className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentHotels().map((hotel) => {
                    const isSelected = hotel.id === selectedHotelInfo?.id;
                    const imageUrl = hotel.isCustom
                      ? hotel.imagenes?.[0]?.url || hotel.images?.[0]?.url
                      : hotel.previewImageUrl;

                    return (
                      <div
                        key={hotel.id}
                        onClick={() => handleSelectHotel(hotel)}
                        className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-400 ring-opacity-50 transform scale-[1.02] shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        {imageUrl ? (
                          <div className="h-48 bg-gray-200 overflow-hidden relative">
                            <img
                              src={imageUrl}
                              alt={hotel.nombre}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Seleccionado
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">
                              <svg
                                className="w-12 h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </span>
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-lg text-gray-800 mb-1 truncate">
                            {hotel.nombre}
                          </h4>
                          <div className="flex items-center gap-2 mb-3">
                            <StarRating rating={hotel.estrellas} size="sm" />
                            <span className="text-sm text-gray-600">
                              {hotel.estrellas.toFixed(1)}
                              {typeof hotel.total_calificaciones === "number" &&
                                ` (${hotel.total_calificaciones} opiniones)`}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`w-full mt-2 text-white py-2.5 px-4 rounded-lg transition-all duration-200 ${
                              isSelected
                                ? "bg-green-500 hover:bg-green-600 shadow-inner"
                                : "bg-blue-500 hover:bg-blue-600 shadow-md"
                            }`}
                          >
                            {isSelected
                              ? "✓ Seleccionado"
                              : "Seleccionar este hotel"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <button
                      type="button"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                        currentPage === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-800 text-white hover:bg-gray-700 shadow-md"
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

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                            currentPage === index
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                        currentPage === totalPages - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-800 text-white hover:bg-gray-700 shadow-md"
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
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                {searchTerm ? (
                  <>
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      No encontramos hoteles con ese nombre
                    </h4>
                    <p className="text-gray-500 mb-4">
                      No hay resultados para "{searchTerm}"
                    </p>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      No hay hoteles disponibles
                    </h4>
                    <p className="text-gray-500 mb-4">
                      No encontramos hoteles cercanos en esta ubicación
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            {!isManualFormVisible ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleShowManualForm}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <svg
                    className="-ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Agregar hotel manualmente
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  ¿No encuentras tu hotel? Agrégalo manualmente
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-bold text-xl text-gray-800">
                    Agregar hotel manualmente
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsManualFormVisible(false)}
                    className="p-1 rounded-full hover:bg-blue-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {error && isManualFormVisible && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5 rounded-lg flex items-start">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Hotel *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej. Hotel Paradise"
                      value={customHotel.nombre}
                      onChange={handleCustomHotelChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación
                    </label>
                    <div className="flex items-center gap-3">
                      <StarRating
                        rating={customHotel.estrellas}
                        setRating={(rating) =>
                          setCustomHotel((prev) => ({
                            ...prev,
                            estrellas: rating,
                          }))
                        }
                        interactive
                        size="md"
                      />
                      <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                        {customHotel.estrellas} estrellas
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imágenes del Hotel
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="pt-1 text-sm tracking-wider text-gray-500">
                            Haz clic para subir imágenes o arrástralas aquí
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleCustomHotelImagesChange}
                          className="opacity-0"
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {customHotel.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.url}
                            alt={`preview ${index}`}
                            className="h-24 w-24 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCustomHotel((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCustomHotel}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="-ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Agregar y Seleccionar Hotel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelFinder;
