import { APIProvider } from "@vis.gl/react-google-maps";
import { useParams } from "react-router-dom";
import { usePackage } from "../../package/hooks/usePackage";
import { usePackageForm } from "../hooks/usePackageForm";
import PackageForm from "../components/PackageForm";
import LocationSelector from "../components/LocationSelector";
import ItineraryEditor from "../components/ItineraryEditor";
import DestinationImageManager from "../components/DestinationImageManager";
import HotelFinder from "../components/HotelFinder";
import Loading from "../../package/components/Loading";
import Error from "../../package/components/Error";

const NuevoPaquete = () => {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);

  const {
    formData,
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
    handleItinerarioChange,
    handleAddItinerario,
    handleRemoveItinerario,
    handleImagesChange,
    handleSubmit,
  } = usePackageForm(paquete);

  if (url && loading) return <Loading />;
  if (url && error) return <Error message={error} />;

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_Maps_API_KEY}
      libraries={["places", "geocoding", "marker"]}
    >
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">
          {url ? "Editar Paquete Turístico" : "Crear Nuevo Paquete Turístico"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PackageForm formData={formData} onFormChange={handleFormChange} />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Selección de Ubicación</h2>
            <div className="flex items-center gap-4 mb-4">
              <p>Seleccionando:</p>
              <button
                type="button"
                onClick={() => setSelectionMode("origen")}
                className={`p-2 rounded font-bold ${
                  selectionMode === "origen"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-200"
                }`}
                aria-pressed={selectionMode === "origen"}
              >
                Origen
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode("destino")}
                className={`p-2 rounded font-bold ${
                  selectionMode === "destino"
                    ? "bg-green-600 text-white"
                    : "bg-green-200"
                }`}
                aria-pressed={selectionMode === "destino"}
              >
                Destino
              </button>
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

          <DestinationImageManager
            destination={destination}
            onImagesChange={handleImagesChange}
            initialImages={formData.imagenes}
          />

          <HotelFinder 
            destination={destination}
            onHotelSelect={handleHotelSelected}
            selectedHotel={formData.hotel}
          />

          <ItineraryEditor
            itinerario={formData.itinerario}
            onItinerarioChange={handleItinerarioChange}
            onAddItinerario={handleAddItinerario}
            onRemoveItinerario={handleRemoveItinerario}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded font-bold"
          >
            {url ? "Guardar Cambios" : "Crear Paquete"}
          </button>
        </form>
      </div>
    </APIProvider>
  );
};

export default NuevoPaquete;