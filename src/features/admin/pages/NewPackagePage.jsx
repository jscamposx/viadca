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
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";
import { usePackage } from "../../package/hooks/usePackage";
import { usePackageForm } from "../hooks/usePackageForm";
import BasicInfoForm from "../components/BasicInfoForm";
import PricingForm from "../components/PricingForm";
import LocationSelector from "../components/LocationSelector";
import DestinationImageManager from "../components/DestinationImageManager";
import HotelFinder from "../components/HotelFinder.jsx";
import MayoristasForm from "../components/MayoristasForm";
import ConfigurationForm from "../components/ConfigurationForm";
import Loading from "../../package/components/Loading";
import Error from "../../package/components/Error";
import { useNotification } from "./AdminLayout";
import { useNotifications } from "../hooks/useNotifications";
import PatchPreview from "../components/PatchPreview";

const NuevoPaquete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basicos");
  const { notify, removeNotification, clearAll } = useNotifications();

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
    currentPatchPayload,
  } = usePackageForm(paquete);

  const handleHotelSelectedWrapper = async (hotel) => {
    try {
      await handleHotelSelected(hotel);
    } catch (error) {
      console.error("Error seleccionando hotel:", error);
      notify.error("Error al procesar las imágenes del hotel", {
        title: "Error de procesamiento",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ejecutar en modo background para obtener la promesa
      const result = await formSubmitHandler(e, (message, type) => {
        if (type === 'error') {
          notify.error(message, { title: "Error", persistent: true });
        }
      }, true); // backgroundMode = true

      if (result && result.operation) {
        // Mostrar notificación de progreso
        const progressId = notify.loading(
          id ? `Actualizando "${result.packageTitle}"...` : `Creando "${result.packageTitle}"...`,
          {
            title: "Procesando en segundo plano",
            persistent: true
          }
        );

        // Navegar inmediatamente
        navigate("/admin/paquetes", { 
          state: { 
            backgroundOperation: true,
            operationType: result.isEdit ? 'update' : 'create',
            packageTitle: result.packageTitle
          }
        });

        // Continuar la operación en segundo plano
        result.operation
          .then((operationResult) => {
            // Remover notificación de progreso
            removeNotification(progressId);
            
            // Mostrar notificación de éxito
            const successMessage = result.isEdit ? 
              `"${result.packageTitle}" actualizado exitosamente` : 
              `"${result.packageTitle}" creado exitosamente`;
            
            notify.success(successMessage, {
              title: "Operación completada",
              persistent: true,
              duration: 5000
            });
          })
          .catch((error) => {
            // Remover notificación de progreso
            removeNotification(progressId);
            
            // Mostrar notificación de error
            const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado.";
            notify.error(`Error: ${errorMessage}`, {
              title: "Error en operación en segundo plano",
              persistent: true
            });
          });
      }
    } catch (err) {
      console.error("Error inesperado en el componente de envío:", err);
      notify.error("Ocurrió un error inesperado al enviar el formulario.", {
        title: "Error inesperado",
        persistent: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionIcons = {
    basicos: <FiInfo className="w-5 h-5" />,
    precios: <FiDollarSign className="w-5 h-5" />,
    ubicaciones: <FiMapPin className="w-5 h-5" />,
    imagenes: <FiImage className="w-5 h-5" />,
    hotel: <FiCalendar className="w-5 h-5" />,
    mayoristas: <FiUsers className="w-5 h-5" />,
    itinerario: <FiFileText className="w-5 h-5" />,
    configuracion: <FiSettings className="w-5 h-5" />,
  };

  const sections = [
    {
      id: "basicos",
      label: "Básicos",
      description: "Título y fechas",
      color: "blue",
    },
    {
      id: "precios",
      label: "Precios",
      description: "Costos y descuentos",
      color: "emerald",
    },
    {
      id: "ubicaciones",
      label: "Ubicaciones",
      description: "Origen y destinos",
      color: "purple",
    },
    {
      id: "imagenes",
      label: "Imágenes",
      description: "Fotos del destino",
      color: "orange",
    },
    {
      id: "hotel",
      label: "Hotel",
      description: "Hospedaje incluido",
      color: "teal",
    },
    {
      id: "mayoristas",
      label: "Mayoristas",
      description: "Socios distribuidores",
      color: "indigo",
    },
    {
      id: "itinerario",
      label: "Itinerario",
      description: "Plan de viaje",
      color: "rose",
    },
    {
      id: "configuracion",
      label: "Configuración",
      description: "Estado y notas",
      color: "gray",
    },
  ];

  const getCurrentSectionIndex = () => {
    return sections.findIndex((s) => s.id === activeSection);
  };

  const navigateToSection = (direction) => {
    const currentIndex = getCurrentSectionIndex();
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      setActiveSection(sections[newIndex].id);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  if (id && loading) return <Loading />;
  if (id && error) return <Error message={error} />;

  const currentSection = sections.find((s) => s.id === activeSection);
  const progress = ((getCurrentSectionIndex() + 1) / sections.length) * 100;

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_Maps_API_KEY}
      libraries={["places", "geocoding", "marker"]}
      language="es"
      region="MX"
      version="beta"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/paquetes")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {id ? "Editar Paquete" : "Nuevo Paquete"}
                  </h1>
                  <p className="text-sm text-slate-500 hidden sm:block">
                    {currentSection?.description}
                  </p>
                </div>
              </div>

              {id &&
                paquete &&
                currentPatchPayload &&
                Object.keys(currentPatchPayload).length > 0 && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-orange-700">
                      {Object.keys(currentPatchPayload).length} cambio
                      {Object.keys(currentPatchPayload).length !== 1
                        ? "s"
                        : ""}{" "}
                      pendiente
                      {Object.keys(currentPatchPayload).length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex text-sm text-slate-500">
                  {getCurrentSectionIndex() + 1} de {sections.length}
                </div>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-3">
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Secciones
                  </h3>
                  <div className="space-y-2">
                    {sections.map((section, index) => {
                      const isCompleted = index < getCurrentSectionIndex();
                      const isActive = activeSection === section.id;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            isActive
                              ? `bg-${section.color}-50 text-${section.color}-700 border border-${section.color}-200`
                              : isCompleted
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                              isActive
                                ? `bg-${section.color}-100`
                                : isCompleted
                                  ? "bg-green-100"
                                  : "bg-slate-100"
                            }`}
                          >
                            {isCompleted ? (
                              <FiCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <span
                                className={
                                  isActive
                                    ? `text-${section.color}-600`
                                    : "text-slate-500"
                                }
                              >
                                {sectionIcons[section.id]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {section.label}
                            </p>
                            <p className="text-xs opacity-75 truncate">
                              {section.description}
                            </p>
                          </div>
                          {isActive && <FiChevronRight className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-3 rounded-xl bg-${currentSection?.color}-50`}
                    >
                      <span className={`text-${currentSection?.color}-600`}>
                        {sectionIcons[activeSection]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {currentSection?.label}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        {currentSection?.description}
                      </p>
                    </div>
                  </div>

                  <div className="animate-fadeIn">
                    {activeSection === "basicos" && (
                      <BasicInfoForm
                        formData={formData}
                        onFormChange={handleFormChange}
                      />
                    )}

                    {activeSection === "precios" && (
                      <PricingForm
                        formData={formData}
                        onFormChange={handleFormChange}
                      />
                    )}

                    {activeSection === "ubicaciones" && (
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
                    )}

                    {activeSection === "imagenes" && (
                      <DestinationImageManager
                        destination={destination}
                        onImagesChange={handleImagesChange}
                        initialImages={formData.imagenes}
                      />
                    )}

                    {activeSection === "hotel" && (
                      <HotelFinder
                        destination={destination}
                        onHotelSelect={handleHotelSelectedWrapper}
                        selectedHotel={formData.hotel}
                      />
                    )}

                    {activeSection === "mayoristas" && (
                      <MayoristasForm
                        formData={formData}
                        onFormChange={handleFormChange}
                      />
                    )}

                    {activeSection === "itinerario" && (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                          Descripción del itinerario
                        </label>
                        <textarea
                          name="itinerario_texto"
                          value={formData.itinerario_texto || ""}
                          onChange={handleFormChange}
                          rows="12"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="DÍA 1: Salida de CDMX...&#10;DÍA 2: Llegada a Madrid...&#10;&#10;Describe el plan día por día con todos los detalles importantes."
                        />
                      </div>
                    )}

                    {activeSection === "configuracion" && (
                      <ConfigurationForm
                        formData={formData}
                        onFormChange={handleFormChange}
                      />
                    )}
                  </div>
                </div>

                <div className="sticky bottom-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigateToSection("prev")}
                      disabled={getCurrentSectionIndex() === 0}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                        getCurrentSectionIndex() === 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {sections.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === getCurrentSectionIndex()
                              ? "bg-blue-500 w-6"
                              : index < getCurrentSectionIndex()
                                ? "bg-green-400"
                                : "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {getCurrentSectionIndex() < sections.length - 1 && (
                        <button
                          type="button"
                          onClick={() => navigateToSection("next")}
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                          <span className="hidden sm:inline">Siguiente</span>
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {getCurrentSectionIndex() === sections.length - 1 && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg 
                                   shadow-md hover:shadow-lg transition-all duration-200 
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center gap-3 ${
                                     isSubmitting ? 'animate-pulse' : ''
                                   }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>
                                {id ? "Actualizando..." : "Creando..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <FiCheckCircle className="w-5 h-5" />
                              <span>
                                {id ? "Actualizar Paquete" : "Crear Paquete"}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {id && paquete && <PatchPreview patchPayload={currentPatchPayload} />}
    </APIProvider>
  );
};

export default NuevoPaquete;
