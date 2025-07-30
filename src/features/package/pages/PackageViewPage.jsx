import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePackage } from "../hooks/usePackage";
import {
  ImageCarousel,
  Itinerary,
  PackageInfo,
  Requirements,
  RouteMap,
  HotelInfo,
} from "../components";
import WeatherForecast from "../components/WeatherForecast";
import {
  FiMapPin,
  FiCalendar,
  FiSun,
  FiCheckSquare,
  FiHeart,
  FiShare2,
  FiHome,
  FiStar,
  FiCheck,
  FiX,
  FiInfo,
  FiDollarSign,
} from "react-icons/fi";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      <div
        role="status"
        className="text-center space-y-6 sm:space-y-8 relative z-10"
      >
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <div className="space-y-2">
            <p className="font-bold text-lg sm:text-xl text-gray-800">
              Preparando tu experiencia de viaje
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              Cargando los mejores momentos...
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <div className="relative w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3
          id="error-heading"
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          ¡Ups! Algo salió mal
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed text-base">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <div className="relative w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500 relative z-10"
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

        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Paquete no encontrado
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed text-base">
          Lo sentimos, no pudimos encontrar el paquete que buscas. Puede que
          haya sido movido o ya no esté disponible.
        </p>

        <button
          onClick={() => window.history.back()}
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
        >
          Explorar otros paquetes
        </button>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default", icon: Icon }) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className="w-3 h-3 mr-1.5 flex-shrink-0"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

function PackageViewPage() {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);
  const [isLiked, setIsLiked] = useState(false);

  const isMobile = () => {
    if (navigator.userAgentData?.mobile) {
      return true;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  const handleShare = async () => {
    if (!paquete) return;

    const shareData = {
      title: paquete.titulo,
      text: `¡Echa un vistazo a este increíble paquete de viaje: ${paquete.titulo}!`,
      url: window.location.href,
    };

    if (isMobile() && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error al compartir:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles!");
      } catch (err) {
        console.error("No se pudo copiar el enlace:", err);
        alert("Error al copiar el enlace.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!paquete) return <NotFoundMessage />;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <Badge variant="info" icon={FiMapPin}>
                {paquete.destinos && paquete.destinos.length > 0
                  ? paquete.destinos.length === 1
                    ? paquete.destinos[0].destino
                    : `${paquete.destinos.length} destinos`
                  : "Destino"}
              </Badge>
              <Badge variant="success" icon={FiCalendar}>
                {paquete.duracion_dias} días
              </Badge>
              {paquete.precio_total && (
                <Badge variant="warning" icon={FiDollarSign}>
                  {parseFloat(paquete.precio_total).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                aria-pressed={isLiked}
                aria-label={
                  isLiked ? "Quitar de favoritos" : "Añadir a favoritos"
                }
                className={`p-2 rounded-full transition-all ${
                  isLiked
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                }`}
              >
                <FiHeart
                  className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                />
              </button>

              <button
                onClick={handleShare}
                aria-label="Compartir paquete"
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-500 transition-all"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {paquete.titulo}
              </h1>

              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 text-base sm:text-lg">
                  Descubre una experiencia única que combina aventura, cultura y momentos inolvidables
                </p>
              </div>
            </div>
          </div>

          {/* Imagen principal */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <ImageCarousel
              imagenes={paquete.imagenes}
              emptyStateTitle="Sin fotos del paquete"
              emptyStateDescription="Las imágenes de este paquete turístico se cargarán próximamente"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Información del Paquete */}
            <section
              aria-labelledby="info-heading"
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <PackageInfo id="info-heading" paquete={paquete} />
            </section>

            {/* Pronóstico del Clima */}
            {paquete.destinos &&
              paquete.destinos.length > 0 &&
              paquete.destinos[0]?.destino_lat &&
              paquete.destinos[0]?.destino_lng && (
                <section
                  aria-labelledby="weather-heading"
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600">
                      <FiSun className="w-5 h-5" />
                    </div>
                    <div>
                      <h2
                        id="weather-heading"
                        className="text-xl font-bold text-gray-900"
                      >
                        Pronóstico del Clima
                      </h2>
                      <p className="text-gray-600">
                        El tiempo en {paquete.destinos[0].destino}
                      </p>
                    </div>
                  </div>
                  <WeatherForecast
                    lat={paquete.destinos[0].destino_lat}
                    lon={paquete.destinos[0].destino_lng}
                    cityName={paquete.destinos[0].destino}
                  />
                </section>
              )}

            {/* Mapa de Ruta */}
            <section
              aria-labelledby="routemap-heading"
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 text-purple-600">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="routemap-heading"
                    className="text-xl font-bold text-gray-900"
                  >
                    Ruta del Viaje
                  </h2>
                  <p className="text-gray-600">
                    Explora todos los destinos de tu aventura
                    {paquete?.destinos && paquete.destinos.length > 1 && (
                      <span className="block text-sm text-purple-600 font-medium mt-1">
                        {paquete.destinos.map((d) => d.destino).join(" → ")}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <RouteMap paquete={paquete} />
            </section>

            {/* Itinerario */}
            {paquete.itinerarios && paquete.itinerarios.length > 0 && (
              <section
                aria-labelledby="itinerary-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="itinerary-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      Itinerario
                    </h2>
                    <p className="text-gray-600">
                      Tu aventura día a día
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <Itinerary itinerario={paquete.itinerarios} />
                </div>
              </section>
            )}

            {/* Hotel */}
            {paquete.hotel && (
              <section
                aria-labelledby="hotel-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 text-amber-600">
                    <FiHome className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="hotel-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      Alojamiento
                    </h2>
                    <p className="text-gray-600">
                      Tu hogar durante el viaje
                    </p>
                  </div>
                </div>
                <div className="h-80 sm:h-96 overflow-hidden rounded-lg shadow">
                  <HotelInfo hotel={paquete.hotel} />
                </div>
              </section>
            )}

            {/* Sección Notas */}
            {paquete.notas && (
              <section
                aria-labelledby="notas-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 text-amber-600">
                    <FiInfo className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="notas-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      Notas importantes
                    </h2>
                    <p className="text-gray-600">
                      Información adicional que debes considerar
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {paquete.notas}
                  </p>
                </div>
              </section>
            )}

            {/* Requisitos */}
            {paquete.requisitos && (
              <section
                aria-labelledby="requirements-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600">
                    <FiCheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="requirements-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      Requisitos
                    </h2>
                    <p className="text-gray-600">
                      Lo que necesitas para tu viaje
                    </p>
                  </div>
                </div>
                <Requirements requisitos={paquete.requisitos} />
              </section>
            )}

            {/* Sección Incluye */}
            {paquete.incluye && (
              <section
                aria-labelledby="incluye-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 text-blue-600">
                    <FiCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="incluye-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      ¿Qué incluye?
                    </h2>
                    <p className="text-gray-600">
                      Todo lo que está incluido en tu paquete
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {paquete.incluye}
                  </p>
                </div>
              </section>
            )}

            {/* Sección No Incluye */}
            {paquete.no_incluye && (
              <section
                aria-labelledby="no-incluye-heading"
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 text-gray-600">
                    <FiX className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id="no-incluye-heading"
                      className="text-xl font-bold text-gray-900"
                    >
                      ¿Qué no incluye?
                    </h2>
                    <p className="text-gray-600">
                      Gastos adicionales no incluidos en el paquete
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {paquete.no_incluye}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar de Precio y Reservación */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Precio Principal */}
                <div className="text-center mb-6">
                  <div className="mb-4">
                    {paquete.descuento && parseFloat(paquete.descuento) > 0 ? (
                      <div className="space-y-3">
                        <div className="text-lg font-bold text-gray-400 line-through">
                          {(
                            parseFloat(paquete.precio_total) +
                            parseFloat(paquete.descuento)
                          ).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })}
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-3xl md:text-4xl font-bold text-emerald-600">
                            {parseFloat(paquete.precio_total).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              },
                            )}
                          </span>
                          <span className="text-gray-500 font-medium">
                            / persona
                          </span>
                        </div>

                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-600">
                            ¡Ahorras{" "}
                            {parseFloat(paquete.descuento).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              },
                            )}
                            !
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="text-3xl md:text-4xl font-bold text-blue-600">
                          {parseFloat(paquete.precio_total).toLocaleString(
                            "es-MX",
                            {
                              style: "currency",
                              currency: "MXN",
                            },
                          )}
                        </span>
                        <span className="text-gray-500 font-medium">
                          / persona
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium">
                    Precio todo incluido
                  </p>
                </div>

                {/* Información de anticipo */}
                {paquete.anticipo && parseFloat(paquete.anticipo) > 0 && (
                  <div className="mb-8 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white">
                        <FiDollarSign className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-blue-800">
                        Anticipo requerido
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 mb-2">
                      {parseFloat(paquete.anticipo).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </p>
                    <p className="text-blue-600 text-sm">
                      Para asegurar tu reservación
                    </p>
                  </div>
                )}

                {/* Resumen del paquete */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-gray-900">
                    ✨ Resumen del paquete
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <FiCheckSquare className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-gray-700">
                        {paquete.duracion_dias} días de aventura
                      </span>
                    </li>
                    {paquete.hotel && (
                      <li className="flex items-center">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                          <FiStar className="w-3 h-3 text-amber-600" />
                        </div>
                        <span className="text-gray-700">
                          Hotel {paquete.hotel.estrellas} estrellas
                        </span>
                      </li>
                    )}
                    {paquete.destinos && (
                      <li className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiMapPin className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700">
                          {paquete.destinos.length} destino
                          {paquete.destinos.length > 1 ? "s" : ""} increíble
                          {paquete.destinos.length > 1 ? "s" : ""}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Botón de reservación */}
                <button className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 mb-6">
                  Reservar Aventura
                </button>

                {/* Calificación */}
                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                  <div
                    className="flex items-center justify-center mb-3"
                    aria-label="Calificación: 4.9 de 5 estrellas"
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold text-gray-700">
                      4.9
                    </span>
                  </div>
                  <p className="text-center text-gray-600 font-medium">
                    Más de 1,000 viajeros satisfechos
                  </p>
                  <p className="text-center text-gray-500 text-sm mt-2">
                    "Una experiencia inolvidable" ⭐
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PackageViewPage;