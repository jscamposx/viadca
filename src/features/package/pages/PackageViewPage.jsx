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
  FiDollarSign,
  FiUsers,
  FiStar,
  FiClock,
  FiShield,
  FiHeart,
  FiShare2,
  FiCamera
} from "react-icons/fi";

// Componente de Loading mejorado
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="w-12 h-12 border-2 border-indigo-400 border-b-transparent rounded-full animate-spin absolute top-2 left-2"></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-700 font-semibold text-lg">Preparando tu experiencia de viaje</p>
          <p className="text-slate-500 text-sm">Cargando los mejores momentos...</p>
        </div>
      </div>
    </div>
  );
}

// Componente de Error mejorado
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center backdrop-blur-sm border border-red-100">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-3">¡Ups! Algo salió mal</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onRetry}
          className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:from-red-600 hover:to-red-700"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

// Componente de Not Found mejorado
function NotFoundMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center backdrop-blur-sm border border-slate-100">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Paquete no encontrado</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">Lo sentimos, no pudimos encontrar el paquete que buscas. Puede que haya sido movido o ya no esté disponible.</p>
        <button
          onClick={() => window.history.back()}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700"
        >
          Explorar otros paquetes
        </button>
      </div>
    </div>
  );
}

// Componente de badge mejorado
function Badge({ children, variant = "default", icon: Icon }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    info: "bg-blue-100 text-blue-700 border-blue-200"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${variants[variant]} backdrop-blur-sm`}>
      {Icon && <Icon className="w-4 h-4 mr-1.5" />}
      {children}
    </span>
  );
}

// Componente principal mejorado
function PackageViewPage() {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);
  const [isLiked, setIsLiked] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!paquete) return <NotFoundMessage />;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header flotante */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant="info" icon={FiMapPin}>
                {paquete.origen} → {paquete.destino}
              </Badge>
              <Badge variant="success" icon={FiCalendar}>
                {paquete.duracion} días
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-300 ${isLiked ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all duration-300">
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              {paquete.nombre_paquete}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Descubre una experiencia única que combina aventura, cultura y momentos inolvidables
            </p>
          </div>

          {/* Galería de Imágenes Mejorada */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
            <ImageCarousel imagenes={paquete.imagenes} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-6 left-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiCamera className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Ver todas las fotos</span>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna Izquierda: Contenido Principal */}
          <div className="lg:col-span-2 space-y-16">
            {/* Información del Paquete */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <PackageInfo
                duracion={paquete.duracion}
                vuelo={paquete.vuelo}
                precio_base={paquete.precio_base}
              />
            </section>

            {/* Itinerario */}
            {paquete.itinerario && paquete.itinerario.length > 0 && (
              <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Itinerario</h2>
                    <p className="text-slate-600">Tu aventura día a día</p>
                  </div>
                </div>
                <Itinerary itinerario={paquete.itinerario} />
              </section>
            )}

            {/* Hotel */}
            {paquete.hotel && (
              <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <HotelInfo hotel={paquete.hotel} />
              </section>
            )}

            {/* Mapa */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Ubicación</h2>
                  <p className="text-slate-600">Explora el destino</p>
                </div>
              </div>
              <RouteMap paquete={paquete} />
            </section>

            {/* Clima */}
            {paquete.destino_lat && paquete.destino_lng && (
              <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                    <FiSun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Clima</h2>
                    <p className="text-slate-600">Pronóstico para tu viaje</p>
                  </div>
                </div>
                <WeatherForecast
                  lat={paquete.destino_lat}
                  lon={paquete.destino_lng}
                />
              </section>
            )}

            {/* Requisitos */}
            {paquete.requisitos && (
              <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <FiShield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Requisitos</h2>
                    <p className="text-slate-600">Lo que necesitas saber</p>
                  </div>
                </div>
                <Requirements requisitos={paquete.requisitos} />
              </section>
            )}
          </div>

          {/* Columna Derecha: Tarjeta de Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 backdrop-blur-sm">
                {/* Precio */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-baseline">
                    <span className="text-5xl font-bold text-slate-900">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </span>
                    <span className="ml-2 text-slate-500 text-lg">/ persona</span>
                  </div>
                  <p className="text-slate-600 mt-2">Precio todo incluido</p>
                </div>

                {/* Incluye */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-semibold text-slate-900 text-lg">¿Qué incluye?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <FiCheckSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Vuelo redondo incluido</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <FiCheckSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Alojamiento premium</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <FiCheckSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Actividades exclusivas</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <FiCheckSquare className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700">Guía especializado</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Reserva */}
                <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 mb-4">
                  <span className="text-lg">🚀 Reservar Aventura</span>
                </button>

                {/* Información adicional */}
                <div className="space-y-2 text-center">
                  <p className="text-sm text-slate-500">
                    <FiShield className="inline w-4 h-4 mr-1" />
                    Pagos 100% seguros
                  </p>
                  <p className="text-sm text-slate-500">
                    <FiClock className="inline w-4 h-4 mr-1" />
                    Cancelación flexible
                  </p>
                  <p className="text-sm text-slate-500">
                    <FiUsers className="inline w-4 h-4 mr-1" />
                    Atención 24/7
                  </p>
                </div>
              </div>

              {/* Tarjeta de confianza */}
              <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold text-slate-700">4.9</span>
                </div>
                <p className="text-center text-slate-600 text-sm">
                  Más de 1,000 viajeros satisfechos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageViewPage;