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
import { FiArrowLeft } from "react-icons/fi";
import { useNotification } from "./AdminLayout";

const NuevoPaquete = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("informacion");
  const { addNotification } = useNotification();

  const { paquete, loading, error } = usePackage(url);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await formSubmitHandler(e, addNotification);
    } catch (err) {
      console.error("Error inesperado en el componente de envío:", err);
      addNotification(
        "Ocurrió un error inesperado al enviar el formulario.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden mb-5 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 sm:py-6 px-4 sm:px-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {url
                    ? "Editar Paquete Turístico"
                    : "Crear nuevo paquete turístico"}
                </h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  Complete toda la información para crear un paquete atractivo
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/paquetes")}
                aria-label="Regresar a paquetes"
                className="flex-shrink-0 p-2 sm:p-3 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto py-2 sm:py-3 px-3 gap-1 sm:gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm sm:text-base ${
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

          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-8"
            noValidate
          >
            <div
              className={`${activeSection !== "informacion" ? "hidden" : ""}`}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Información Básica
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Detalles esenciales del paquete turístico.
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <PackageForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    flights={flights}
                  />
                </div>
              </div>
            </div>

            <div className={`${activeSection !== "ubicacion" ? "hidden" : ""}`}>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Selección de Ubicación
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Define los lugares de origen y destino.
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                    <p className="text-gray-700 font-medium self-center text-sm sm:text-base">
                      Seleccionando:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectionMode("origen")}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm sm:text-base ${
                          selectionMode === "origen"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {selectionMode === "origen" && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                        Origen
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectionMode("destino")}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm sm:text-base ${
                          selectionMode === "destino"
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {selectionMode === "destino" && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Imágenes del Destino
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Agrega imágenes atractivas para mostrar el destino
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <DestinationImageManager
                    destination={destination}
                    onImagesChange={handleImagesChange}
                    initialImages={formData.imagenes}
                  />
                </div>
              </div>
            </div>

            <div className={`${activeSection !== "vuelo" ? "hidden" : ""}`}>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Selección de Vuelo
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Elige el vuelo que se incluirá en este paquete
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <FlightCarousel
                    flights={flights}
                    onFlightSelect={handleFlightSelect}
                    selectedFlightId={formData.id_vuelo}
                  />
                </div>
              </div>
            </div>

            <div className={`${activeSection !== "hotel" ? "hidden" : ""}`}>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Selección de Hotel
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Elige el hotel que se incluirá en este paquete
                  </p>
                </div>
                <div className="p-4 sm:p-6">
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
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Itinerario del Viaje
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Define las actividades diarias del paquete
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <ItineraryEditor
                    itinerario={formData.itinerario}
                    onItinerarioChange={handleItinerarioChange}
                    onAddItinerario={handleAddItinerario}
                    onRemoveItinerario={handleRemoveItinerario}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-3 sm:py-4 px-4 sm:px-6 rounded-b-xl sm:rounded-b-2xl shadow-lg">
              <div className="flex justify-end items-center gap-3">
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
                  className={`w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm sm:text-base ${
                    activeSection === "informacion"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
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
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all text-sm sm:text-base disabled:opacity-70 disabled:cursor-wait"
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
          </form>
        </div>
      </div>
    </APIProvider>
  );
};

export default NuevoPaquete;
