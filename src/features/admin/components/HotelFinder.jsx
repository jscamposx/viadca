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
  const [isManualFormVisible, setIsManualFormVisible] = useState(false);
  const [isLoadingHotelImages, setIsLoadingHotelImages] = useState(false);
  const [customHotel, setCustomHotel] = useState({
    nombre: "",
    estrellas: 3,
    images: [],
  });

  useEffect(() => {    
    if (
      selectedHotel &&
      !allHotels.some((hotel) => hotel.id === selectedHotel.id)
    ) {
      setAllHotels((prev) => [selectedHotel, ...prev]);
    }
  }, [selectedHotel, allHotels]);

  const itemsPerPage = 3;

  const fetchHotels = useCallback(
    async (lat, lng) => {
      if (!places) return;
      setLoading(true);
      setError(null);
      setAllHotels([]);
      try {
        const originalWarn = console.warn;
        console.warn = (...args) => {
          const message = args[0];
          if (
            typeof message === "string" &&
            (message.includes(
              "google.maps.places.PlacesService is not available to new customers",
            ) ||
              message.includes(
                "google.maps.places.Autocomplete is not available to new customers",
              ))
          ) {
            return;
          }
          originalWarn.apply(console, args);
        };

        const service = new places.PlacesService(document.createElement("div"));

        console.warn = originalWarn;

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
          previewImageUrl:
            place.photos && place.photos.length > 0
              ? place.photos[0].getUrl({ maxWidth: 800 })
              : null,

          googlePhotos: place.photos || [],
          totalPhotos: place.photos ? place.photos.length : 0,
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

  const handleSelectHotel = async (hotel) => {
    setIsLoadingHotelImages(true);
    let hotelWithImages = { ...hotel };

    if (!hotel.isCustom && hotel.place_id) {
      try {
        const service = new places.PlacesService(document.createElement("div"));

        const placeDetails = await new Promise((resolve, reject) => {
          service.getDetails(
            {
              placeId: hotel.place_id,
              fields: ["photos", "name", "rating", "user_ratings_total"],
            },
            (place, status) => {
              if (status === places.PlacesServiceStatus.OK) {
                resolve(place);
              } else {
                reject(new Error(`Error fetching place details: ${status}`));
              }
            },
          );
        });

        const photosToUse = placeDetails.photos || hotel.googlePhotos || [];

        if (photosToUse.length > 0) {
          const imageUrls = [];

          for (let i = 0; i < Math.min(photosToUse.length, 3); i++) {
            try {
              const photo = photosToUse[i];

              const sizes = [
                { maxWidth: 800, maxHeight: 600 },
                { maxWidth: 600, maxHeight: 400 },
                { maxWidth: 400, maxHeight: 300 },
              ];

              let photoUrl = null;
              for (const size of sizes) {
                try {
                  photoUrl = photo.getUrl(size);
                  if (photoUrl) break;
                } catch (sizeError) {
                  console.warn(
                    `Error with size ${size.maxWidth}x${size.maxHeight}:`,
                    sizeError,
                  );
                }
              }

              if (photoUrl) {
                imageUrls.push({
                  orden: i + 1,
                  tipo: "google_places_url",
                  contenido: photoUrl,
                  mime_type: "image/jpeg",
                  nombre: `hotel-${hotel.nombre.toLowerCase().replace(/\s+/g, "-")}-${i + 1}.jpg`,
                });
              }
            } catch (photoError) {
              console.error(`Error processing photo ${i}:`, photoError);
            }
          }

          hotelWithImages = {
            ...hotel,
            imagenes: imageUrls,
            googlePhotos: undefined,
            previewImageUrl: null,
          };
        } else {
          hotelWithImages = {
            ...hotel,
            imagenes: [],
            googlePhotos: undefined,
          };
        }
      } catch (error) {

        if (hotel.googlePhotos && hotel.googlePhotos.length > 0) {
          try {
            const fallbackImages = [];

            for (let i = 0; i < Math.min(hotel.googlePhotos.length, 3); i++) {
              try {
                const photo = hotel.googlePhotos[i];
                const photoUrl = photo.getUrl({
                  maxWidth: 800,
                  maxHeight: 600,
                });

                if (photoUrl) {
                  fallbackImages.push({
                    orden: i + 1,
                    tipo: "google_places_url",
                    contenido: photoUrl,
                    mime_type: "image/jpeg",
                    nombre: `hotel-${hotel.nombre.toLowerCase().replace(/\s+/g, "-")}-${i + 1}.jpg`,
                  });
                }
              } catch (individualPhotoError) {
                // Error silencioso para fotos individuales
              }
            }

            hotelWithImages = {
              ...hotel,
              imagenes: fallbackImages,
              googlePhotos: undefined,
              previewImageUrl: null,
            };
          } catch (fallbackError) {
            console.error("Error con imágenes de fallback:", fallbackError);
            hotelWithImages = {
              ...hotel,
              imagenes: [],
              googlePhotos: undefined,
              previewImageUrl: null,
            };
          }
        } else {
          hotelWithImages = {
            ...hotel,
            imagenes: [],
            googlePhotos: undefined,
            previewImageUrl: null,
          };
        }
      }
    } else if (hotel.isCustom && hotel.images) {
      hotelWithImages = {
        ...hotel,
        imagenes: hotel.images.map((img, index) => ({
          orden: index + 1,
          tipo: img.file ? "file" : "url",
          contenido: img.url,
          mime_type: img.file ? img.file.type : "image/jpeg",
          nombre: img.file ? img.file.name : `custom-hotel-${index + 1}.jpeg`,
          file: img.file,
        })),
        images: undefined,
      };
    }

    setIsLoadingHotelImages(false);
    onHotelSelect(hotelWithImages);
    setIsManualFormVisible(false);
  };

  const handleShowManualForm = () => {
    onHotelSelect(null);
    setIsManualFormVisible(true);
  };

  const handleAddCustomHotel = () => {
    if (!customHotel.nombre.trim()) {
      setError("Por favor, ingresa el nombre del hotel.");
      return;
    }
    setError(null);
    const newHotel = {
      id: `custom-${Date.now()}`,
      nombre: customHotel.nombre,
      estrellas: customHotel.estrellas,
      imagenes: customHotel.images.map((img, index) => ({
        orden: index + 1,
        tipo: img.file ? "file" : "url",
        contenido: img.url,
        mime_type: img.file ? img.file.type : "image/jpeg",
        nombre: img.file ? img.file.name : `custom-hotel-${index + 1}.jpeg`,
        file: img.file,
      })),
      isCustom: true,
      total_calificaciones: null,
    };
    setAllHotels((prev) => [newHotel, ...prev]);
    onHotelSelect(newHotel);
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
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🏨 Seleccionar Hotel</h3>
            <p className="text-blue-100 text-sm">Encuentra el alojamiento perfecto para tu paquete de viaje</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!destination?.lat ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2">📍 Destino requerido</h4>
            <p className="text-slate-500 max-w-sm mx-auto">
              Selecciona un destino en el mapa para buscar hoteles cercanos y completar tu paquete de viaje.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de búsqueda mejorada */}
            <div className="mb-8">
              <label htmlFor="hotelSearch" className="block text-sm font-semibold text-slate-700 mb-3">
                🔍 Buscar hotel por nombre
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="hotelSearch"
                  type="text"
                  placeholder="Escribe el nombre del hotel que buscas..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 shadow-sm transition-all duration-200 text-base"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Estados de carga y error mejorados */}
            <div className="mb-8">
              {loading ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border border-blue-100">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                      <div className="relative w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">🏨 Buscando hoteles</h4>
                  <p className="text-blue-700">Encontrando las mejores opciones de alojamiento cerca de {destination?.name}...</p>
                </div>
              ) : error && !isManualFormVisible ? (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-red-900 mb-2">❌ Error al cargar hoteles</h4>
                      <p className="text-red-700 mb-4">{error}</p>
                      <button
                        type="button"
                        onClick={() => destination?.lat && fetchHotels(destination.lat, destination.lng)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Intentar de nuevo
                      </button>
                    </div>
                  </div>
                </div>
              ) : filteredHotels.length > 0 ? (
              <div className="relative">
                {/* Grid de hoteles mejorado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getCurrentHotels().map((hotel) => {
                    const isSelected = hotel.id === selectedHotel?.id;

                    const imageUrl = hotel.isCustom
                      ? hotel.imagenes?.[0]?.contenido || hotel.images?.[0]?.url
                      : hotel.previewImageUrl;

                    return (
                      <div
                        key={hotel.id}
                        onClick={() => handleSelectHotel(hotel)}
                        className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
                          isSelected
                            ? "ring-4 ring-blue-500/30 shadow-2xl border-2 border-blue-500 scale-105"
                            : "border border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {/* Imagen del hotel mejorada */}
                        {imageUrl ? (
                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={hotel.nombre}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Overlay con gradiente mejorado */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Badge de tipo de hotel */}
                            <div className="absolute top-3 left-3">
                              {hotel.isCustom ? (
                                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Personalizado
                                </span>
                              ) : (
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Google Places
                                </span>
                              )}
                            </div>
                            
                            {/* Badge de selección mejorado */}
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Seleccionado
                              </div>
                            )}
                            
                            {/* Badge de fotos mejorado */}
                            {!hotel.isCustom && hotel.totalPhotos > 1 && (
                              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold">{Math.min(hotel.totalPhotos, 3)}</span>
                                <span className="opacity-90">fotos</span>
                              </div>
                            )}

                            {/* Indicador de calidad si tiene buena puntuación */}
                            {hotel.estrellas >= 4.5 && (
                              <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Destacado
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-52 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Patrón de fondo sutil */}
                            <div className="absolute inset-0 opacity-20">
                              <svg width="40" height="40" viewBox="0 0 40 40" className="fill-slate-400">
                                <rect width="2" height="2" x="0" y="0" />
                                <rect width="2" height="2" x="20" y="20" />
                              </svg>
                            </div>
                            <div className="relative z-10 text-center">
                              <div className="w-16 h-16 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                                <svg
                                  className="w-8 h-8 text-slate-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v12"
                                  />
                                </svg>
                              </div>
                              <p className="text-slate-600 text-sm font-medium mb-1">Sin imagen</p>
                              <p className="text-slate-500 text-xs">No hay foto disponible</p>
                            </div>
                          </div>
                        )}

                        {/* Contenido de la tarjeta mejorado */}
                        <div className="p-5">
                          {/* Header con nombre y categoría */}
                          <div className="mb-3">
                            <h4 className="font-bold text-xl text-slate-800 mb-1 truncate leading-tight">
                              {hotel.nombre}
                            </h4>
                            {hotel.isCustom && (
                              <p className="text-purple-600 text-xs font-medium">Hotel personalizado</p>
                            )}
                          </div>

                          {/* Rating y reseñas mejorado */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <StarRating rating={hotel.estrellas} size="sm" />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">
                                  {hotel.estrellas.toFixed(1)}
                                </span>
                                {typeof hotel.total_calificaciones === "number" && hotel.total_calificaciones > 0 && (
                                  <span className="text-xs text-slate-500">
                                    {hotel.total_calificaciones} reseñas
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Indicador de calidad visual */}
                            {hotel.estrellas >= 4.5 ? (
                              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Excelente
                              </div>
                            ) : hotel.estrellas >= 4.0 ? (
                              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Muy bueno
                              </div>
                            ) : hotel.estrellas >= 3.0 ? (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Bueno
                              </div>
                            ) : null}
                          </div>

                          {/* Botón de selección mejorado */}
                          <button
                            type="button"
                            className={`w-full text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                              isSelected
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            } ${isLoadingHotelImages ? "opacity-75 cursor-wait" : ""}`}
                            disabled={isLoadingHotelImages}
                          >
                            {isLoadingHotelImages ? (
                              <>
                                <svg
                                  className="animate-spin h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span>Cargando imágenes...</span>
                              </>
                            ) : isSelected ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Hotel Seleccionado</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Seleccionar Hotel</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginación mejorada */}
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

          {/* Sección manual mejorada */}
          <div className="border-t border-gray-100 pt-6">
            {!isManualFormVisible ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleShowManualForm}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
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
                  ➕ Agregar hotel manualmente
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  ¿No encuentras tu hotel? Agrégalo manualmente con toda la información
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-bold text-xl text-gray-800">
                    ➕ Agregar hotel manualmente
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
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
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
                    ✅ Agregar y Seleccionar Hotel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default HotelFinder;
