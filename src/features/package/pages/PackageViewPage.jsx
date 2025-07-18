import { useEffect, useState } from "react";
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
} from "react-icons/fi";


function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
  
      <div role="status" className="text-center space-y-4 sm:space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-2">
          <p className="text-slate-700 font-semibold text-base sm:text-lg">
            Preparando tu experiencia de viaje
          </p>
          <p className="text-slate-500 text-sm">
            Cargando los mejores momentos...
          </p>
        </div>
      </div>
    </div>
  );
}


function ErrorMessage({ message, onRetry }) {
  return (

    <div role="alert" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center backdrop-blur-sm border border-red-100">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
     
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h3 id="error-heading" className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
          ¡Ups! Algo salió mal
        </h3>
        <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:from-red-600 hover:to-red-700 text-sm sm:text-base"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}


function NotFoundMessage() {
    return (
      <div role="alert" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center backdrop-blur-sm border border-slate-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
            Paquete no encontrado
          </h3>
          <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            Lo sentimos, no pudimos encontrar el paquete que buscas. Puede que
            haya sido movido o ya no esté disponible.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 text-sm sm:text-base"
          >
            Explorar otros paquetes
          </button>
        </div>
      </div>
    );
  }

function Badge({ children, variant = "default", icon: Icon }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${variants[variant]} backdrop-blur-sm`}
    >

      {Icon && <Icon aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

function PackageViewPage() {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);
  const [isLiked, setIsLiked] = useState(false);



  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!paquete) return <NotFoundMessage />;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
   
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto flex-1 mr-4">
              <Badge variant="info" icon={FiMapPin}>
                {paquete.origen} → {paquete.destino}
              </Badge>
              <Badge variant="success" icon={FiCalendar}>
                {paquete.duracion} días
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
         
              <button
                onClick={() => setIsLiked(!isLiked)}
                aria-pressed={isLiked}
                aria-label={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
                className={`p-2 rounded-full transition-all duration-300 ${isLiked ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                <FiHeart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
                />
              </button>
              <button 
                aria-label="Compartir paquete"
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all duration-300">
                <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight px-2">
              {paquete.nombre_paquete}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Descubre una experiencia única que combina aventura, cultura y
              momentos inolvidables
            </p>
          </div>
      
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
            <ImageCarousel imagenes={paquete.imagenes} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12 lg:space-y-16">
            

            <section aria-labelledby="info-heading" className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
       
              <PackageInfo
                id="info-heading"
                duracion={paquete.duracion}
                vuelo={paquete.vuelo}
                precio_base={paquete.precio_base}
              />
            </section>

            {paquete.itinerario && paquete.itinerario.length > 0 && (
              <section aria-labelledby="itinerary-heading" className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FiCalendar aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 id="itinerary-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Itinerario
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Tu aventura día a día
                    </p>
                  </div>
                </div>
                <Itinerary itinerario={paquete.itinerario} />
              </section>
            )}

            {paquete.hotel && (
              <section aria-labelledby="hotel-heading" className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FiHome aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 id="hotel-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Alojamiento
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Tu hogar durante el viaje
                    </p>
                  </div>
                </div>
                <div className="h-80 sm:h-96 lg:h-[400px] overflow-hidden rounded-xl sm:rounded-2xl">
                  <HotelInfo hotel={paquete.hotel} />
                </div>
              </section>
            )}
            
            {paquete.requisitos && (
              <section aria-labelledby="requirements-heading" className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FiCheckSquare aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 id="requirements-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Requisitos
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Lo que necesitas para tu viaje
                    </p>
                  </div>
                </div>
                <Requirements requisitos={paquete.requisitos} />
              </section>
            )}

            {paquete.destino_lat && paquete.destino_lng && (
                <section aria-labelledby="weather-heading" className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
                    <div className="flex items-center mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                            <FiSun aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 id="weather-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Pronóstico del Clima
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base">
                                El tiempo en {paquete.destino}
                            </p>
                        </div>
                    </div>
                    <WeatherForecast lat={paquete.destino_lat} lon={paquete.destino_lng} cityName={paquete.destino} />
                </section>
            )}
            
          </div>
 
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-slate-100 backdrop-blur-sm">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:items-baseline">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </span>
                    <span className="ml-0 sm:ml-2 text-slate-500 text-base sm:text-lg">
                      / persona
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2 text-sm sm:text-base">
                    Precio todo incluido
                  </p>
                </div>
                

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                    ¿Qué incluye?
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <FiCheckSquare aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base">Vuelo redondo incluido</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <FiCheckSquare aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base">Alojamiento premium</span>
                    </li>
                    <li className="flex items-center">
                       <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <FiCheckSquare aria-hidden="true" className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base">Actividades exclusivas</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 sm:py-5 px-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 mb-3 sm:mb-4">
                  <span className="text-base sm:text-lg">
                    🚀 Reservar Aventura
                  </span>
                </button>
    
                <div className="mt-4 sm:mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                  <div 
                    className="flex items-center justify-center mb-2 sm:mb-3"
               
                    aria-label="Calificación: 4.9 de 5 estrellas"
                    role="img"
                  >
                    <div className="flex items-center" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold text-slate-700 text-sm sm:text-base" aria-hidden="true">
                      4.9
                    </span>
                  </div>
                  <p className="text-center text-slate-600 text-xs sm:text-sm">
                    Más de 1,000 viajeros satisfechos
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