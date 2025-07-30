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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        role="status"
        className="text-center space-y-6 sm:space-y-8 relative z-10"
      >
        {/* Spinner mejorado */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <div className="space-y-2">
            <p className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Preparando tu experiencia de viaje
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Cargando los mejores momentos...
            </p>
          </div>

          {/* Barra de progreso animada */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse w-2/3"></div>
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-red-100/50 relative z-10">
        {/* Icono mejorado */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full animate-ping"></div>
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
          className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4"
        >
          ¡Ups! Algo salió mal
        </h3>

        <p className="text-slate-600 mb-8 leading-relaxed text-base">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="group w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-base relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
          <span className="relative">Intentar de nuevo</span>
        </button>
      </div>
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-slate-100/50 relative z-10">
        {/* Icono mejorado */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full animate-pulse"></div>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-500 relative z-10"
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

        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
          Paquete no encontrado
        </h3>

        <p className="text-slate-600 mb-8 leading-relaxed text-base">
          Lo sentimos, no pudimos encontrar el paquete que buscas. Puede que
          haya sido movido o ya no esté disponible.
        </p>

        <button
          onClick={() => window.history.back()}
          className="group w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-base relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
          <span className="relative">Explorar otros paquetes</span>
        </button>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default", icon: Icon }) {
  const variants = {
    default:
      "bg-white/80 text-slate-700 border-slate-200/50 shadow-sm hover:shadow-md",
    success:
      "bg-emerald-50/80 text-emerald-700 border-emerald-200/50 shadow-sm hover:shadow-md hover:bg-emerald-100/80",
    warning:
      "bg-amber-50/80 text-amber-700 border-amber-200/50 shadow-sm hover:shadow-md hover:bg-amber-100/80",
    info: "bg-blue-50/80 text-blue-700 border-blue-200/50 shadow-sm hover:shadow-md hover:bg-blue-100/80",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold border backdrop-blur-sm transition-all duration-300 ${variants[variant]}`}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 lg:mr-2 flex-shrink-0"
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
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header mejorado */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Badges responsivos */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto sm:mr-4">
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
                  <span className="hidden xs:inline">
                    {parseFloat(paquete.precio_total).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </span>
                  <span className="xs:hidden">
                    ${Math.round(parseFloat(paquete.precio_total) / 1000)}k
                  </span>
                </Badge>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 self-end sm:self-center">
              <button
                onClick={() => setIsLiked(!isLiked)}
                aria-pressed={isLiked}
                aria-label={
                  isLiked ? "Quitar de favoritos" : "Añadir a favoritos"
                }
                className={`group p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isLiked
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-white/80 text-slate-500 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <FiHeart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isLiked ? "fill-current scale-110" : "group-hover:scale-110"
                  }`}
                />
              </button>

              <button
                onClick={handleShare}
                aria-label="Compartir paquete"
                className="group p-2.5 sm:p-3 rounded-full bg-white/80 text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 lg:py-12 relative z-10">
        {/* Hero Section mejorado */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text leading-tight px-2">
                {paquete.titulo}
              </h1>

              <div className="max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto">
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed px-2 sm:px-4">
                  Descubre una experiencia única que combina
                  <span className="font-semibold text-blue-600"> aventura</span>
                  ,
                  <span className="font-semibold text-emerald-600">
                    {" "}
                    cultura
                  </span>{" "}
                  y
                  <span className="font-semibold text-purple-600">
                    {" "}
                    momentos inolvidables
                  </span>
                </p>
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {paquete.duracion_dias}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Días
                  </div>
                </div>
                {paquete.destinos && (
                  <div className="text-center group cursor-pointer">
                    <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                      {paquete.destinos.length}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      {paquete.destinos.length === 1 ? "Destino" : "Destinos"}
                    </div>
                  </div>
                )}
                {paquete.hotel && (
                  <div className="text-center group cursor-pointer">
                    <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-amber-600 group-hover:scale-110 transition-transform duration-300">
                      {paquete.hotel.estrellas}★
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      Hotel
                    </div>
                  </div>
                )}
                {(() => {
                  const validImages =
                    paquete.imagenes?.filter((img) => {
                      const contenido = img?.contenido || img?.url;
                      return contenido && contenido.trim() !== "";
                    }) || [];

                  return (
                    validImages.length > 0 && (
                      <div className="text-center group cursor-pointer">
                        <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                          {validImages.length}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-500 font-medium">
                          Fotos
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Imagen principal mejorada */}
          <div className="relative h-48 xs:h-60 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl group">
            <ImageCarousel
              imagenes={paquete.imagenes}
              emptyStateTitle="Sin fotos del paquete"
              emptyStateDescription="Las imágenes de este paquete turístico se cargarán próximamente"
            />

            {/* Overlay con gradiente mejorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500"></div>

            {/* Indicador de más fotos */}
            {(() => {
              const validImages =
                paquete.imagenes?.filter((img) => {
                  const contenido = img?.contenido || img?.url;
                  return contenido && contenido.trim() !== "";
                }) || [];

              return (
                validImages.length > 1 && (
                  <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-black/30 backdrop-blur-md rounded-full px-2 sm:px-3 py-1 text-white text-xs sm:text-sm">
                    +{validImages.length - 1} fotos
                  </div>
                )
              );
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12 xl:space-y-16">
            {/* Información del Paquete */}
            <section
              aria-labelledby="info-heading"
              className="group bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-xl hover:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
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
                  className="group bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-xl hover:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 lg:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-sky-400/50 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <FiSun
                        aria-hidden="true"
                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white relative z-10"
                      />
                    </div>
                    <div>
                      <h2
                        id="weather-heading"
                        className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent"
                      >
                        Pronóstico del Clima
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
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
              className="group bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-xl hover:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 lg:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-purple-400/50 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <FiMapPin
                    aria-hidden="true"
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white relative z-10"
                  />
                </div>
                <div>
                  <h2
                    id="routemap-heading"
                    className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-700 bg-clip-text text-transparent"
                  >
                    Ruta del Viaje
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                    Explora todos los destinos de tu aventura
                    {paquete?.destinos && paquete.destinos.length > 1 && (
                      <span className="block text-xs sm:text-sm text-purple-600 font-medium mt-1">
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
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiCalendar
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="itinerary-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
                    >
                      Itinerario
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
                      Tu aventura día a día
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200/50 backdrop-blur-sm">
                  <Itinerary itinerario={paquete.itinerarios} />
                </div>
              </section>
            )}

            {/* Hotel */}
            {paquete.hotel && (
              <section
                aria-labelledby="hotel-heading"
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-amber-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiHome
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="hotel-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-amber-700 bg-clip-text text-transparent"
                    >
                      Alojamiento
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
                      Tu hogar durante el viaje
                    </p>
                  </div>
                </div>
                <div className="h-80 sm:h-96 lg:h-[450px] overflow-hidden rounded-2xl shadow-lg">
                  <HotelInfo hotel={paquete.hotel} />
                </div>
              </section>
            )}

            {/* Sección Notas */}
            {paquete.notas && (
              <section
                aria-labelledby="notas-heading"
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-amber-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiInfo
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="notas-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-amber-700 bg-clip-text text-transparent"
                    >
                      Notas importantes
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
                      Información adicional que debes considerar
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/50 backdrop-blur-sm">
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                    {paquete.notas}
                  </p>
                </div>
              </section>
            )}

            {/* Requisitos */}
            {paquete.requisitos && (
              <section
                aria-labelledby="requirements-heading"
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiCheckSquare
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="requirements-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
                    >
                      Requisitos
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
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
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiCheck
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="incluye-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
                    >
                      ¿Qué incluye?
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
                      Todo lo que está incluido en tu paquete
                    </p>
                  </div>
                </div>
                <div className="bg-white/40 rounded-2xl p-6 sm:p-8 border border-slate-200/50 backdrop-blur-sm">
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                    {paquete.incluye}
                  </p>
                </div>
              </section>
            )}

            {/* Sección No Incluye */}
            {paquete.no_incluye && (
              <section
                aria-labelledby="no-incluye-heading"
                className="group bg-white/60 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-xl hover:shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-slate-400/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <FiX
                      aria-hidden="true"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10"
                    />
                  </div>
                  <div>
                    <h2
                      id="no-incluye-heading"
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                    >
                      ¿Qué no incluye?
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg">
                      Gastos adicionales no incluidos en el paquete
                    </p>
                  </div>
                </div>
                <div className="bg-white/40 rounded-2xl p-6 sm:p-8 border border-slate-200/50 backdrop-blur-sm">
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                    {paquete.no_incluye}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar de Precio y Reservación */}
          <aside className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-32 lg:max-h-screen lg:overflow-y-auto scrollbar-hide">
              <div className="group bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-2xl hover:shadow-3xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20 transition-all duration-500 hover:-translate-y-2">
                {/* Precio Principal */}
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="mb-3 sm:mb-4">
                    {paquete.descuento && parseFloat(paquete.descuento) > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {/* Precio original tachado */}
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-400 line-through">
                          {(
                            parseFloat(paquete.precio_total) +
                            parseFloat(paquete.descuento)
                          ).toLocaleString("es-MX", {
                            style: "currency",
                            currency: "MXN",
                          })}
                        </div>

                        {/* Precio con descuento */}
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                            {parseFloat(paquete.precio_total).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              },
                            )}
                          </span>
                          <span className="text-slate-500 text-sm sm:text-base lg:text-lg font-medium">
                            / persona
                          </span>
                        </div>

                        {/* Badge de descuento */}
                        <div className="flex justify-center">
                          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                            🔥 ¡Ahorras{" "}
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
                        <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                          {parseFloat(paquete.precio_total).toLocaleString(
                            "es-MX",
                            {
                              style: "currency",
                              currency: "MXN",
                            },
                          )}
                        </span>
                        <span className="text-slate-500 text-sm sm:text-base lg:text-lg font-medium">
                          / persona
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">
                    Precio todo incluido
                  </p>
                </div>

                {/* Información de anticipo */}
                {paquete.anticipo && parseFloat(paquete.anticipo) > 0 && (
                  <div className="mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/50 backdrop-blur-sm">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                        <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-blue-900 text-base sm:text-lg">
                        Anticipo requerido
                      </h3>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-800 mb-2">
                      {parseFloat(paquete.anticipo).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </p>
                    <p className="text-blue-700 text-sm sm:text-base">
                      Para asegurar tu reservación
                    </p>
                  </div>
                )}

                {/* Resumen del paquete */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-5 mb-6 sm:mb-8 lg:mb-10">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg lg:text-xl">
                    ✨ Resumen del paquete
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <li className="flex items-center group">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <FiCheckSquare
                          aria-hidden="true"
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600"
                        />
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base lg:text-lg font-medium">
                        {paquete.duracion_dias} días de aventura
                      </span>
                    </li>
                    {paquete.hotel && (
                      <li className="flex items-center group">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FiStar
                            aria-hidden="true"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600"
                          />
                        </div>
                        <span className="text-slate-700 text-sm sm:text-base lg:text-lg font-medium">
                          Hotel {paquete.hotel.estrellas} estrellas
                        </span>
                      </li>
                    )}
                    {paquete.destinos && (
                      <li className="flex items-center group">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FiMapPin
                            aria-hidden="true"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                          />
                        </div>
                        <span className="text-slate-700 text-sm sm:text-base lg:text-lg font-medium">
                          {paquete.destinos.length} destino
                          {paquete.destinos.length > 1 ? "s" : ""} increíble
                          {paquete.destinos.length > 1 ? "s" : ""}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Botón de reservación */}
                <button className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 sm:py-5 lg:py-6 px-4 sm:px-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 hover:from-blue-600 hover:to-blue-700 mb-4 sm:mb-6 relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
                  <span className="text-base sm:text-lg lg:text-xl relative z-10 flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Reservar Aventura
                    <span className="ml-2">✨</span>
                  </span>
                </button>

                {/* Calificación mejorada */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-emerald-200/50 backdrop-blur-sm">
                  <div
                    className="flex items-center justify-center mb-3 sm:mb-4"
                    aria-label="Calificación: 4.9 de 5 estrellas"
                    role="img"
                  >
                    <div
                      className="flex items-center space-x-1"
                      aria-hidden="true"
                    >
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current drop-shadow-sm"
                        />
                      ))}
                    </div>
                    <span
                      className="ml-2 sm:ml-3 font-black text-slate-700 text-lg sm:text-xl"
                      aria-hidden="true"
                    >
                      4.9
                    </span>
                  </div>
                  <p className="text-center text-slate-600 text-sm sm:text-base font-medium">
                    Más de 1,000 viajeros satisfechos
                  </p>
                  <p className="text-center text-slate-500 text-xs sm:text-sm mt-2">
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
