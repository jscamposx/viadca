import { APIProvider } from "@vis.gl/react-google-maps";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePackage } from "../../package/hooks/usePackage";
import { usePackageForm } from "../hooks/usePackageForm";
import PackageForm from "../components/PackageForm";
import LocationSelector from "../components/LocationSelector";
import ItineraryEditor from "../components/ItineraryEditor";
import DestinationImageManager from "../components/DestinationImageManager";
import HotelFinder from "../components/HotelFinder";
import Loading from "../../package/components/Loading";
import Error from "../../package/components/Error";
import FlightCarousel from "../components/FlightCarousel";

const NuevoPaquete = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("informacion");

  const { paquete, loading, error } = url
    ? usePackage(url)
    : { paquete: null, loading: false, error: null };

  const {
    formData,
    setFormData,
    selectionMode,
    flights,
    searchValue,
    origin,
    destination,
    setSelectionMode,
    setSearchValue,
    handlePlaceSelected,
    onMapClick,
    handleFormChange,
    handleHotelSelected,
    handleItinerarioChange,
    handleAddItinerario,
    handleRemoveItinerario,
    handleImagesChange,
    handleSubmit: formSubmitHandler,
  } = usePackageForm(paquete);

  const handleFlightSelect = (flightId) => {
    setFormData((prev) => ({ ...prev, id_vuelo: flightId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    formSubmitHandler(e);
  };

  if (url && loading) return <Loading />;
  if (url && error) return <Error message={error} />;

  const sections = [
    { id: "informacion", label: "Información" },
    { id: "ubicacion", label: "Ubicación" },
    { id: "imagenes", label: "Imágenes" },
    { id: "vuelo", label: "Vuelo" },
    { id: "hotel", label: "Hotel" },
    { id: "itinerario", label: "Itinerario" },
  ];

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_Maps_API_KEY}
      libraries={["places", "geocoding", "marker"]}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {url
                  ? "Editar Paquete Turístico"
                  : "Crear Nuevo Paquete Turístico"}
              </h1>
              <p className="text-blue-100 mt-2">
                Completa toda la información para crear un paquete atractivo
              </p>
            </div>
            <div className="bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto py-3 px-4 gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        
            <div
              className={`${activeSection !== "informacion" ? "hidden" : ""}`}
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Información Básica
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Detalles esenciales del paquete turístico. Los datos de
                    ubicación se definen en la siguiente sección.
                  </p>
                </div>
                <div className="p-6">
                  <PackageForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    flights={flights}
                  />
                </div>
              </div>
            </div>
            <div className={`${activeSection !== "ubicacion" ? "hidden" : ""}`}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Selección de Ubicación
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Define los lugares de origen y destino usando el mapa o el
                    buscador.
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <p className="text-gray-700 font-medium self-center">
                      Seleccionando:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectionMode("origen")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          selectionMode === "origen"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {selectionMode === "origen" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                        Origen
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectionMode("destino")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          selectionMode === "destino"
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {selectionMode === "destino" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                        Destino
                      </button>
                    </div>
                  </div>

                  <LocationSelector
                    onMapClick={onMapClick}
                    origin={origin}
                    destination={destination}
                    onPlaceSelected={handlePlaceSelected}
                    searchValue={searchValue}
                    onSearchValueChange={setSearchValue}
                  />
                </div>
              </div>
            </div>
            <div className={`${activeSection !== "imagenes" ? "hidden" : ""}`}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Imágenes del Destino
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Agrega imágenes atractivas para mostrar el destino
                  </p>
                </div>
                <div className="p-6">
                  <DestinationImageManager
                    destination={destination}
                    onImagesChange={handleImagesChange}
                    initialImages={formData.imagenes}
                  />
                </div>
              </div>
            </div>

            <div className={`${activeSection !== "vuelo" ? "hidden" : ""}`}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Selección de Vuelo
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Elige el vuelo que se incluirá en este paquete
                  </p>
                </div>
                <div className="p-6">
                  <FlightCarousel
                    flights={flights}
                    onFlightSelect={handleFlightSelect}
                    selectedFlightId={formData.id_vuelo}
                  />
                </div>
              </div>
            </div>

            <div className={`${activeSection !== "hotel" ? "hidden" : ""}`}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Selección de Hotel
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Elige el hotel que se incluirá en este paquete
                  </p>
                </div>
                <div className="p-6">
                  <HotelFinder
                    destination={destination}
                    onHotelSelect={handleHotelSelected}
                    selectedHotel={formData.hotel}
                  />
                </div>
              </div>
            </div>

            <div
              className={`${activeSection !== "itinerario" ? "hidden" : ""}`}
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Itinerario del Viaje
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Define las actividades diarias del paquete
                  </p>
                </div>
                <div className="p-6">
                  <ItineraryEditor
                    itinerario={formData.itinerario}
                    onItinerarioChange={handleItinerarioChange}
                    onAddItinerario={handleAddItinerario}
                    onRemoveItinerario={handleRemoveItinerario}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-6 rounded-b-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/paquetes")}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Regresar
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const sectionIds = sections.map((s) => s.id);
                      const currentIndex = sectionIds.indexOf(activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sectionIds[currentIndex - 1]);
                      }
                    }}
                    disabled={activeSection === "informacion"}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  {activeSection !== "itinerario" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();

                        const sectionIds = sections.map((s) => s.id);
                        const currentIndex = sectionIds.indexOf(activeSection);
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sectionIds[currentIndex + 1]);
                        }
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                     className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"

                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Guardando..."
                        : url
                          ? "Actualizar Paquete"
                          : "Crear Paquete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </APIProvider>
  );
};

export default NuevoPaquete;
