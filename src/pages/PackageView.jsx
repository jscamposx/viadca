import { useParams } from "react-router-dom";
import api from "../api";
import { useFetch } from "../hooks/useFetch";
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
} from "../components/package";

function PaqueteDetalle() {
  const { url } = useParams();

  const {
    data: paquete,
    loading,
    error,
  } = useFetch(api.packages.getPaqueteByUrl, [url]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!paquete) return <NotFound />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-10">
      <div className="relative">
        <ImageCarousel imagenes={paquete.imagenes} />
        <PackageHeader
          nombre_paquete={paquete.nombre_paquete}
          origen={paquete.origen}
          destino={paquete.destino}
        />
      </div>

      <div className="p-8">
        <PackageInfo
          duracion={paquete.duracion}
          id_vuelo={paquete.id_vuelo}
          precio_base={paquete.precio_base}
        />
        <Itinerary itinerario={paquete.itinerario} />
        <RouteMap paquete={paquete} />
        <Requirements requisitos={paquete.requisitos} />
      </div>
    </div>
  );
}

export default PaqueteDetalle;
