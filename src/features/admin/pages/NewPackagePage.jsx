import { APIProvider } from "@vis.gl/react-google-maps";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiImage,
  FiCalendar,
  FiInfo,
  FiFileText,
  FiTag,
  FiDollarSign,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { usePackage } from "../../package/hooks/usePackage";
import { usePackageForm } from "../hooks/usePackageForm";
import BasicInfoForm from "../components/BasicInfoForm";
import PricingForm from "../components/PricingForm";
import LocationSelector from "../components/LocationSelector";
import DestinationImageManager from "../components/DestinationImageManager";
import HotelFinder from "../components/HotelFinder";
import MayoristasForm from "../components/MayoristasForm";
import ConfigurationForm from "../components/ConfigurationForm";
import Loading from "../../package/components/Loading";
import Error from "../../package/components/Error";
import { useNotification } from "./AdminLayout";

const NuevoPaquete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basicos");
  const { addNotification } = useNotification();

  const { paquete, loading, error } = usePackage(id, true);

  const {
    formData,
    setFormData,
    selectionMode,
    searchValue,
    origin,
    destination,
    setSelectionMode,
    setSearchValue,
    handlePlaceSelected,
    onMapClick,
    handleFormChange,
    handleHotelSelected,
    handleImagesChange,
    handleAddDestination,
    handleRemoveDestination,
    handleSubmit: formSubmitHandler,
  } = usePackageForm(paquete);

  const handleHotelSelectedWrapper = async (hotel) => {
    try {
      await handleHotelSelected(hotel);
    } catch (error) {
      console.error("Error seleccionando hotel:", error);
      addNotification(
        "Error al procesar las imágenes del hotel",
        "error",
      );
    }
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

  const sectionIcons = {
    basicos: <FiInfo className="w-4 h-4" />,
    precios: <FiDollarSign className="w-4 h-4" />,
    ubicaciones: <FiMapPin className="w-4 h-4" />,
    imagenes: <FiImage className="w-4 h-4" />,
    hotel: <FiCalendar className="w-4 h-4" />,
    mayoristas: <FiUsers className="w-4 h-4" />,
    itinerario: <FiFileText className="w-4 h-4" />,
    configuracion: <FiSettings className="w-4 h-4" />,
  };

  const sections = [
    { id: "basicos", label: "Básicos", description: "Título y fechas" },
    { id: "precios", label: "Precios", description: "Costos y descuentos" },
    {
      id: "ubicaciones",
      label: "Ubicaciones",
      description: "Origen y destinos",
    },
    { id: "imagenes", label: "Imágenes", description: "Fotos del destino" },
    { id: "hotel", label: "Hotel", description: "Hospedaje incluido" },
    {
      id: "mayoristas",
      label: "Mayoristas",
      description: "Socios distribuidores",
    },
    { id: "itinerario", label: "Itinerario", description: "Plan de viaje" },
    {
      id: "configuracion",
      label: "Configuración",
      description: "Estado y notas",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  if (id && loading) return <Loading />;
  if (id && error) return <Error message={error} />;

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_Maps_API_KEY}
      libraries={["places", "geocoding", "marker"]}
      language="es"
      region="MX"
      version="beta"
    >
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
            <div className="py-5 sm:py-7 px-4 sm:px-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {id
                    ? "Editar Paquete Turístico"
                    : "Crear nuevo paquete turístico"}
                </h1>
                <p className="text-blue-100 mt-1.5 text-base">
                  Complete toda la información para crear un paquete atractivo
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/paquetes")}
                aria-label="Regresar a paquetes"
                className="flex-shrink-0 p-2.5 rounded-lg text-white bg-white/15 hover:bg-white/25 transition-colors duration-200 flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm py-3 px-4">
              <div className="flex overflow-x-auto gap-1 pb-1">
                {sections.map((section, index) => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === activeSection,
                  );
                  const isCompleted = index < currentIndex;
                  const isActive = activeSection === section.id;

                  return (
                    <div key={section.id} className="flex items-center">
                      {index > 0 && (
                        <div
                          className={`w-4 h-0.5 mx-1 ${isCompleted || isActive ? "bg-blue-400" : "bg-gray-400"}`}
                        ></div>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-xs ${
                          isActive
                            ? "bg-white text-blue-800 shadow-md"
                            : isCompleted
                              ? "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30"
                              : "bg-white/10 text-blue-100 hover:bg-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className={`${isCompleted ? "hidden" : "flex"}`}
                          >
                            {sectionIcons[section.id]}
                          </span>
                          {isCompleted && (
                            <FiCheckCircle className="w-4 h-4 text-green-300" />
                          )}
                          <span className="font-medium">{section.label}</span>
                        </div>
                        <span className="text-xs opacity-75 leading-tight">
                          {section.description}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-7"
            noValidate
          >
            {/* Información Básica */}
            <div
              className={`${activeSection !== "basicos" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                      <FiInfo className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Información Básica
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Detalles esenciales del paquete turístico
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <BasicInfoForm
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Precios */}
            <div
              className={`${activeSection !== "precios" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-700">
                      <FiDollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Precios y Costos
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Define los precios y opciones de descuento
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <PricingForm
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Ubicaciones */}
            <div
              className={`${activeSection !== "ubicaciones" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Ubicaciones del Viaje
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Define el lugar de origen y destino del viaje
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <LocationSelector
                    onMapClick={onMapClick}
                    origin={origin}
                    destination={destination}
                    onPlaceSelected={handlePlaceSelected}
                    searchValue={searchValue}
                    onSearchValueChange={setSearchValue}
                    selectionMode={selectionMode}
                    setSelectionMode={setSelectionMode}
                    additionalDestinations={formData.additionalDestinations}
                    onAddDestination={handleAddDestination}
                    onRemoveDestination={handleRemoveDestination}
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div
              className={`${activeSection !== "imagenes" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                      <FiImage className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Imágenes del Destino
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Agrega imágenes atractivas para mostrar el destino
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <DestinationImageManager
                    destination={destination}
                    onImagesChange={handleImagesChange}
                    initialImages={formData.imagenes}
                  />
                </div>
              </div>
            </div>

            {/* Hotel */}
            <div
              className={`${activeSection !== "hotel" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Selección de Hotel
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Elige el hotel que se incluirá en este paquete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <HotelFinder
                    destination={destination}
                    onHotelSelect={handleHotelSelectedWrapper}
                    selectedHotel={formData.hotel}
                  />
                </div>
              </div>
            </div>

            {/* Mayoristas */}
            <div
              className={`${activeSection !== "mayoristas" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Mayoristas Asociados
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Selecciona quiénes pueden vender este paquete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <MayoristasForm
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Itinerario */}
            <div
              className={`${activeSection !== "itinerario" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Texto del Itinerario
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Describe el plan de viaje día por día.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <textarea
                    name="itinerario_texto"
                    value={formData.itinerario_texto || ""}
                    onChange={handleFormChange}
                    rows="15"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="DÍA 1: Salida de CDMX...\nDÍA 2: Llegada a Madrid..."
                  />
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div
              className={`${activeSection !== "configuracion" ? "hidden" : ""} animate-fadeIn`}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
                      <FiSettings className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Configuración y Resumen
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Ajustes finales y revisión del paquete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <ConfigurationForm
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            {/* Navegación y Envío */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-4 sm:px-6 rounded-xl shadow-lg z-10">
              <div className="flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const sectionIds = sections.map((s) => s.id);
                    const currentIndex = sectionIds.indexOf(activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sectionIds[currentIndex - 1]);
                    }
                  }}
                  disabled={activeSection === "basicos"}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base ${
                    activeSection === "basicos"
                      ? "opacity-50 cursor-not-allowed text-gray-500"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Anterior
                </button>

                {activeSection !== "configuracion" ? (
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
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Siguiente
                    <FiArrowLeft className="w-4 h-4 transform rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all text-sm sm:text-base disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {id ? "Actualizando..." : "Creando..."}
                      </>
                    ) : id ? (
                      "Actualizar Paquete"
                    ) : (
                      "Crear Paquete"
                    )}
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
