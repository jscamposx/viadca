import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api";
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import PageTransition from "../../../components/ui/PageTransition";
import { useContactInfo } from "../../../hooks/useContactInfo";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import { 
  FiPackage, 
  FiLock, 
  FiGlobe, 
  FiClock, 
  FiMapPin,
  FiAlertCircle,
  FiRefreshCw
} from "react-icons/fi";

const MyPackagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { contactInfo, loading: contactLoading } = useContactInfo();
  
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo cargar si está autenticado
    if (isAuthenticated) {
      fetchMisPaquetes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMisPaquetes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.packages.getMisPaquetes();
      
      // El backend YA devuelve solo paquetes privados, no necesitamos filtrar
      const paquetesData = response?.data?.data || response?.data || [];
      setPaquetes(Array.isArray(paquetesData) ? paquetesData : []);
    } catch (err) {
      console.error("Error cargando mis paquetes:", err);
      setError("No se pudieron cargar los paquetes. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.rol === "admin";

  // Si no está autenticado
  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
          <UnifiedNav contactInfo={contactInfo} />
          <main className="flex-grow flex items-center justify-center px-4 pt-24 md:pt-28 pb-12">
            <div className="max-w-lg w-full">
              {/* Card principal */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-100 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full -ml-16 -mb-16 opacity-50 blur-3xl"></div>
                
                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icono animado */}
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                      <FiLock className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 text-center">
                    🔐 Inicia Sesión
                  </h1>
                  <p className="text-slate-600 mb-2 text-center text-base md:text-lg">
                    Para acceder a tus paquetes exclusivos
                  </p>
                  <p className="text-slate-500 mb-8 text-center text-sm">
                    Inicia sesión para ver los paquetes personalizados y exclusivos asignados especialmente para ti.
                  </p>

                  {/* Características */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-100">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="text-purple-600">✨</span>
                      Con tu cuenta podrás:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span><strong>Ver paquetes exclusivos</strong> diseñados especialmente para ti</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span><strong>Acceder a ofertas privadas</strong> no disponibles públicamente</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span><strong>Gestionar tus reservas</strong> desde un solo lugar</span>
                      </li>
                    </ul>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <Link
                      to="/iniciar-sesion"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                    >
                      <FiLock className="w-5 h-5" />
                      Iniciar Sesión Ahora
                    </Link>
                    
                    <Link
                      to="/paquetes"
                      className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      <FiGlobe className="w-5 h-5" />
                      Ver Paquetes Públicos
                    </Link>

                    <Link
                      to="/"
                      className="block text-center text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors mt-4"
                    >
                      ← Volver al Inicio
                    </Link>
                  </div>

                  {/* Nota para nuevos usuarios */}
                  <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-600">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        to="/registro"
                        className="text-purple-600 hover:text-purple-700 font-semibold underline"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer contactInfo={contactInfo} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20">
        <UnifiedNav contactInfo={contactInfo} />
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12 md:pb-16 max-w-7xl">
          {/* Header Mejorado */}
          <div className="mb-10 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiPackage className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                    Mis Paquetes
                  </h1>
                  <p className="text-slate-600 mt-1 text-sm md:text-base">
                    Tus ofertas exclusivas
                  </p>
                </div>
              </div>
              
              {!loading && !error && paquetes.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">{paquetes.length}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total</p>
                    <p className="text-sm font-bold text-slate-700">{paquetes.length === 1 ? 'Paquete' : 'Paquetes'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 md:py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 font-medium mt-6 text-lg">Cargando tus paquetes...</p>
              <p className="text-slate-400 text-sm mt-2">Esto solo tomará un momento</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-red-200/50 p-8 md:p-10 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FiAlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Error al cargar</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchMisPaquetes}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && paquetes.length === 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-12 overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-32 -mb-32 opacity-40 blur-3xl"></div>
                
                <div className="relative text-center">
                  {/* Icono */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-30"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl">
                      <FiPackage className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    No hay paquetes aún
                  </h3>
                  
                  <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                    Aún no tienes acceso a paquetes exclusivos. Contáctanos para obtener ofertas personalizadas diseñadas especialmente para ti.
                  </p>

                  {/* Features */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-8 text-left max-w-xl mx-auto">
                    <h4 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <span className="text-2xl">✨</span>
                      ¿Qué son los paquetes exclusivos?
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Ofertas personalizadas</p>
                          <p className="text-sm text-slate-600 mt-0.5">Paquetes diseñados según tus preferencias y necesidades</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Precios especiales</p>
                          <p className="text-sm text-slate-600 mt-0.5">Tarifas exclusivas no disponibles al público general</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Atención prioritaria</p>
                          <p className="text-sm text-slate-600 mt-0.5">Asesoría personalizada y soporte dedicado</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    to="/paquetes"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                  >
                    <FiGlobe className="w-5 h-5" />
                    Explorar Paquetes Públicos
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && paquetes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paquetes.map((paquete) => (
                <PackageCard key={paquete.id || paquete.codigoUrl} paquete={paquete} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </main>

        <Footer contactInfo={contactInfo} />
      </div>
    </PageTransition>
  );
};

// Package Card Component - Rediseñado
const PackageCard = ({ paquete, isAdmin }) => {
  const img = paquete?.primera_imagen || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop";
  const moneda = sanitizeMoneda(paquete?.moneda);
  const precio = formatPrecio(paquete?.precio_total, moneda);
  const url = `/paquetes/${paquete?.codigoUrl}`;
  
  const isPrivate = paquete.esPublico === false;
  const showExclusiveBadge = isPrivate && !isAdmin;
  const showAdminBadge = isPrivate && isAdmin;

  // Construir destino principal
  const firstDest = Array.isArray(paquete?.destinos) && paquete.destinos.length > 0
    ? paquete.destinos[0]
    : null;
  
  const destinoPrincipal = firstDest 
    ? `${firstDest.ciudad || firstDest.destino || ""}, ${firstDest.pais || ""}`.trim().replace(/^,\s*|,\s*$/g, '')
    : paquete?.destino || "Destino";

  const duracion = paquete?.duracion_dias
    ? `${paquete.duracion_dias} días`
    : paquete?.duracion_noches
    ? `${paquete.duracion_noches} noches`
    : "";

  return (
    <article className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100">
      {/* Image */}
      <div className="relative overflow-hidden h-56 md:h-64">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || destinoPrincipal}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          width={400}
          height={300}
          responsive
          lazy={true}
          placeholder={true}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {showExclusiveBadge && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Exclusivo
            </div>
          )}
          {showAdminBadge && (
            <div className="bg-gray-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm flex items-center gap-1.5">
              <FiLock className="w-3.5 h-3.5" />
              Privado
            </div>
          )}
          {paquete.descuento > 0 && (
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl">
              {paquete.descuento}% OFF
            </div>
          )}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-xl md:text-2xl font-bold text-white line-clamp-2 drop-shadow-lg">
            {paquete?.titulo}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Destination & Duration */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-slate-600">
            <FiMapPin className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <span className="text-sm font-medium line-clamp-1">{destinoPrincipal}</span>
          </div>
          {duracion && (
            <div className="flex items-center gap-2.5 text-slate-600">
              <FiClock className="w-5 h-5 flex-shrink-0 text-indigo-600" />
              <span className="text-sm font-medium">{duracion}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-5 pb-5 border-b border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Precio total</p>
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {precio}
              </span>
            </div>
            {paquete.personas && (
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium mb-1">Personas</p>
                <span className="text-sm font-bold text-slate-700">
                  {paquete.personas} {paquete.personas === 1 ? 'pax' : 'pax'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={url}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-[1.02]"
        >
          Ver Detalles
        </Link>
      </div>
    </article>
  );
};export default MyPackagesPage;
