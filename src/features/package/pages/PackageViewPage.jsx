import { useParams } from "react-router-dom";
import { usePackage } from "../hooks/usePackage";
import {
  Error,
  ImageCarousel,
  Itinerary,
  Loading,
  NotFound,
  PackageHeader,
  PackageInfo,
  Requirements,
  RouteMap,
  HotelInfo,
} from "../components";
import WeatherForecast from "../components/WeatherForecast"; // Importa el nuevo componente

function PaqueteDetalle() {
  const { url } = useParams();

  const { paquete, loading, error } = usePackage(url);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <Error message={error} />
      </div>
    );
  }

  if (!paquete) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-gray-100 border border-gray-400 text-gray-700 rounded-md">
        <NotFound />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <ImageCarousel imagenes={paquete.imagenes} />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-3xl font-bold mb-2">
              {paquete.nombre_paquete}
            </h2>
            <p className="text-lg">
              {paquete.origen} <span className="font-semibold">→</span>{" "}
              {paquete.destino}
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <PackageInfo
              duracion={paquete.duracion}
              vuelo={paquete.vuelo}
              precio_base={paquete.precio_base}
            />
          </div>

          {/* Sección del Clima */}
          {paquete.destino_lat && paquete.destino_lng && (
            <div className="mb-6 border-b border-gray-200 pb-4">
               <WeatherForecast
                  lat={paquete.destino_lat}
                  lon={paquete.destino_lng}
               />
            </div>
          )}

          {paquete.itinerario && paquete.itinerario.length > 0 && (
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3"></h3>
              <Itinerary itinerario={paquete.itinerario} />
            </div>
          )}

          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3"></h3>
            <div className="rounded-md overflow-hidden shadow-md">
              <RouteMap paquete={paquete} />
            </div>
          </div>

          {paquete.requisitos && (
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3"></h3>
              <Requirements requisitos={paquete.requisitos} />
            </div>
          )}

          {paquete.hotel && <HotelInfo hotel={paquete.hotel} />}
        </div>
      </div>
    </div>
  );
}

export default PaqueteDetalle;