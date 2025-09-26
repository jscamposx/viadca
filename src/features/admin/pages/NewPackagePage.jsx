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
import PatchPreview from "../components/PatchPreview";
import { setOperation } from "../utils/operationBus";

const NuevoPaquete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basicos");
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMap, setValidationMap] = useState({});

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
      // Notificaciones deshabilitadas en esta página
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  setValidationErrors([]);
  setValidationMap({});

    try {
      const result = await formSubmitHandler(
        e,
        () => {}, // sin notificaciones aquí (mostramos nuestro banner)
        true, // backgroundMode = true
      );

      if (result && result.operation) {
        const opKey = `package:${result.isEdit ? "update" : "create"}:${Date.now()}`;
        setOperation(opKey, result.operation);

        navigate("/admin/paquetes", {
          state: {
            pendingOperation: true,
            operationType: result.isEdit ? "update" : "create",
            packageTitle: result.packageTitle,
            opKey,
          },
        });

        // Continuar la operación en segundo plano (sin notificar aquí)
        result.operation.catch((err) => {
          if (import.meta.env.DEV)
            console.error("Error en operación paquete:", err);
        });
      }
    } catch (err) {
      console.error("Error inesperado en el envío del paquete:", err);
      // Mostrar banner compacto de validación si aplica
      if (err?.isValidationError && Array.isArray(err.validationErrors)) {
        setActiveSection("basicos");
        setValidationErrors(err.validationErrors);
        setValidationMap(err.validationMap || {});
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="grid grid-cols-3 items-center h-14 sm:h-16 lg:h-20">
              {/* Sección izquierda - Botón atrás y título */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate("/admin/paquetes")}
                  className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg flex-shrink-0"
                >
                  <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">
                    {id ? "Editar Paquete" : "Nuevo Paquete"}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 hidden md:block truncate">
                    {currentSection?.description}
                  </p>
                </div>
              </div>

              {/* Sección central - Indicador de cambios pendientes */}
              <div className="flex justify-center">
                {id && paquete && currentPatchPayload && (() => {
                  // Replicar la lógica de PatchPreview: filtrar campos sin valor significativo
                  const monedaTmp = currentPatchPayload?.moneda || currentPatchPayload?.currency || "MXN";
                  const isMeaningfulPrice = (value) => {
                    if (value === null || value === undefined || value === "") return false;
                    if (typeof value === "number" && isNaN(value)) return false;
                    return true;
                  };
                  const isSkippable = (field, value) => {
                    // Campos de precio / monetarios vacíos
                    if ((field.includes("precio") || ["anticipo", "descuento"].includes(field)) && !isMeaningfulPrice(value)) return true;
                    // Null / undefined genéricos
                    if (value === null || value === undefined) return true;
                    // Strings vacíos o whitespace
                    if (typeof value === "string" && value.trim() === "") return true;
                    return false;
                  };
                  const meaningfulEntries = Object.entries(currentPatchPayload).filter(([field, value]) => !isSkippable(field, value));
                  const meaningfulCount = meaningfulEntries.length;
                  if (meaningfulCount === 0) return null;
                  return (
                    <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-orange-700 whitespace-nowrap">
                        {meaningfulCount} cambio{meaningfulCount !== 1 ? "s" : ""} pendiente{meaningfulCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Sección derecha - Progreso y contador */}
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <div className="hidden lg:flex text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                  {getCurrentSectionIndex() + 1} de {sections.length}
                </div>
                <div className="w-16 sm:w-20 lg:w-24 h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {validationErrors.length > 0 && (
            <div className="mb-4 sm:mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-red-800">Por favor corrige los siguientes campos:</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-red-700 text-sm">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
                <div className="hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setActiveSection("basicos")}
                    className="px-3 py-1.5 rounded-md bg-white text-red-700 border border-red-200 hover:bg-red-100 text-sm"
                  >
                    Ir a Básicos
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Sidebar para desktop */}
            <div className="hidden xl:block xl:col-span-3">
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

            {/* Navegación horizontal para móviles y tablets */}
            <div className="xl:hidden mb-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    {currentSection?.label}
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-500">
                    {getCurrentSectionIndex() + 1} de {sections.length}
                  </span>
                </div>

                {/* Progreso con puntos */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {sections.map((section, index) => {
                    const isCompleted = index < getCurrentSectionIndex();
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                          isActive
                            ? `bg-${section.color}-100 text-${section.color}-700 border border-${section.color}-200`
                            : isCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {isCompleted ? (
                          <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="xl:col-span-9">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-${currentSection?.color}-50 flex-shrink-0`}
                    >
                      <span className={`text-${currentSection?.color}-600`}>
                        {sectionIcons[activeSection]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                        {currentSection?.label}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 mt-1 hidden sm:block">
                        {currentSection?.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {activeSection === "basicos" && (
                      <BasicInfoForm
                        formData={formData}
                        onFormChange={handleFormChange}
                        errors={validationMap}
                      />
                    )}

                    {activeSection === "precios" && (
                      <PricingForm
                        formData={formData}
                        onFormChange={handleFormChange}
                        errors={validationMap}
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
                        isEdit={!!id} // Nuevo prop para mostrar mensaje en edición
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
                          rows="8"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
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

                <div className="sticky bottom-4 sm:bottom-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigateToSection("prev")}
                      disabled={getCurrentSectionIndex() === 0}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all ${
                        getCurrentSectionIndex() === 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {sections.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                            index === getCurrentSectionIndex()
                              ? "bg-blue-500 w-4 sm:w-6"
                              : index < getCurrentSectionIndex()
                                ? "bg-green-400"
                                : "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {getCurrentSectionIndex() < sections.length - 1 && (
                        <button
                          type="button"
                          onClick={() => navigateToSection("next")}
                          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg sm:rounded-xl text-sm sm:text-base transition-all"
                        >
                          <span className="hidden sm:inline">Siguiente</span>
                          <span className="sm:hidden">Sig.</span>
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {getCurrentSectionIndex() === sections.length - 1 && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-lg 
                                   shadow-md hover:shadow-lg 
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center gap-2 sm:gap-3 text-sm sm:text-base transition-all`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full" />
                              <span className="hidden sm:inline">
                                {id ? "Actualizando..." : "Creando..."}
                              </span>
                              <span className="sm:hidden">
                                {id ? "Actualizando..." : "Creando..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="hidden sm:inline">
                                {id ? "Actualizar Paquete" : "Crear Paquete"}
                              </span>
                              <span className="sm:hidden">
                                {id ? "Actualizar" : "Crear"}
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
