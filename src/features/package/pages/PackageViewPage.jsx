import { useParams } from "react-router-dom";
import { usePackage } from "../hooks/usePackage";
import {
  Error,
  ImageCarousel,
  Itinerary,
  Loading,
  NotFound,
  PackageInfo,
  Requirements,
  RouteMap,
  HotelInfo,
} from "../components";
import WeatherForecast from "../components/WeatherForecast";

function PackageViewPage() {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Preparando tu experiencia de viaje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!paquete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Paquete no encontrado</h3>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar el paquete que buscas.</p>
          <button 
            onClick={() => window.history.back()} 
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
          >
            Explorar otros paquetes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Parallax Effect */}
      <div className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageCarousel imagenes={paquete.imagenes} />
        </div>
        
        {/* Glass Morphism Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 pb-12">
            <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl p-8 max-w-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-blue-500/10 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Experiencia Premium
                </span>
                <span className="text-gray-500 text-sm">
                  {paquete.duracion} días
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                {paquete.nombre_paquete}
              </h1>
              
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mr-4">{paquete.origen}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="ml-4 font-medium">{paquete.destino}</span>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Desde</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        {/* Floating Navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex overflow-x-auto scrollbar-hide -mx-2">
              {['Detalles', 'Itinerario', 'Mapa', 'Hotel', 'Clima', 'Requisitos'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-blue-600 whitespace-nowrap mx-2 border-b-2 border-transparent hover:border-blue-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto space-y-20">
            {/* Package Details */}
            <section id="detalles" className="scroll-mt-20">
              <div className="flex items-center mb-8">
                <div className="h-px bg-gray-200 flex-1"></div>
                <h2 className="text-2xl font-bold text-gray-900 px-6">Detalles del viaje</h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <PackageInfo
                duracion={paquete.duracion}
                vuelo={paquete.vuelo}
                precio_base={paquete.precio_base}
              />
            </section>

            {/* Itinerary */}
            {paquete.itinerario && paquete.itinerario.length > 0 && (
              <section id="itinerario" className="scroll-mt-20">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-2xl font-bold text-gray-900 px-6">Tu itinerario</h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <Itinerary itinerario={paquete.itinerario} />
              </section>
            )}

            {/* Route Map */}
            <section id="mapa" className="scroll-mt-20">
              <div className="flex items-center mb-8">
                <div className="h-px bg-gray-200 flex-1"></div>
                <h2 className="text-2xl font-bold text-gray-900 px-6">Ruta del viaje</h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <RouteMap paquete={paquete} />
            </section>

            {/* Hotel Info */}
            {paquete.hotel && (
              <section id="hotel" className="scroll-mt-20">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-2xl font-bold text-gray-900 px-6">Tu alojamiento</h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <HotelInfo hotel={paquete.hotel} />
              </section>
            )}

            {/* Weather Forecast */}
            {paquete.destino_lat && paquete.destino_lng && (
              <section id="clima" className="scroll-mt-20">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-2xl font-bold text-gray-900 px-6">Pronóstico del clima</h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <WeatherForecast
                  lat={paquete.destino_lat}
                  lon={paquete.destino_lng}
                />
              </section>
            )}

            {/* Requirements */}
            {paquete.requisitos && (
              <section id="requisitos" className="scroll-mt-20">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <h2 className="text-2xl font-bold text-gray-900 px-6">Requisitos de viaje</h2>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <Requirements requisitos={paquete.requisitos} />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 lg:hidden">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Desde</p>
              <p className="text-lg font-bold text-blue-600">
                {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
              </p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all">
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageViewPage;