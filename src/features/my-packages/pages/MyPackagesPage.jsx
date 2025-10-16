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
  FiUsers,
  FiAlertCircle,
  FiRefreshCw,
  FiShield
} from "react-icons/fi";

const MyPackagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { contactInfo, loading: contactLoading } = useContactInfo();
  
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo cargar si está autenticado
    if (isAuthenticated) {
      fetchMisPaquetes();
    }
  }, [isAuthenticated]);

  const fetchMisPaquetes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.packages.getMisPaquetes();
      // El endpoint devuelve { data: { data: [...], total, page, ... } }
      const paquetesData = response?.data?.data || response?.data || [];
      // FILTRAR SOLO PAQUETES PRIVADOS (excluir públicos)
      const paquetesPrivados = Array.isArray(paquetesData) 
        ? paquetesData.filter(p => p.esPublico === false) 
        : [];
      setPaquetes(paquetesPrivados);
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <UnifiedNav contactInfo={contactInfo} />
        
        <main className="flex-grow container mx-auto px-4 pt-24 md:pt-28 pb-8 md:pb-12 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Mis Paquetes
                </h1>
                <p className="text-slate-600 mt-1">
                  {isAdmin ? "Todos los paquetes del sistema" : "Paquetes exclusivos autorizados para ti"}
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className={`rounded-xl p-4 border ${
              isAdmin 
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isAdmin ? "bg-blue-100" : "bg-purple-100"
                }`}>
                  {isAdmin ? (
                    <FiShield key="admin-icon" className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FiUsers key="user-icon" className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${
                    isAdmin ? "text-blue-900" : "text-purple-900"
                  }`}>
                    {user?.nombre_completo || user?.usuario}
                  </p>
                  <p className={`text-sm mt-1 ${
                    isAdmin ? "text-blue-700" : "text-purple-700"
                  }`}>
                    {isAdmin 
                      ? "🔓 Como administrador, puedes ver todos los paquetes (públicos y privados)"
                      : "🔒 Aquí solo aparecen los paquetes privados exclusivos autorizados para ti"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Cargando tus paquetes...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-800 font-semibold mb-2">Error al cargar paquetes</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchMisPaquetes}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && paquetes.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No hay paquetes exclusivos para ti
              </h3>
              <p className="text-slate-600 mb-6">
                No tienes paquetes privados autorizados en este momento.
              </p>
              <Link
                to="/paquetes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <FiGlobe className="w-4 h-4" />
                Explorar Paquetes Públicos
              </Link>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && paquetes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paquetes.map((paquete) => (
                <PackageCard key={paquete.id} paquete={paquete} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </main>

        <Footer contactInfo={contactInfo} />
      </div>
    </PageTransition>
  );
};

// Package Card Component
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
    <article className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {showExclusiveBadge && (
            <div key="exclusive-badge" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              ⭐ Exclusivo para ti
            </div>
          )}
          {showAdminBadge && (
            <div key="admin-badge" className="bg-gray-900/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1">
              <FiLock className="w-3 h-3" />
              Privado
            </div>
          )}
          {paquete.descuento > 0 && (
            <div key="descuento-badge" className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {paquete.descuento}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {paquete?.titulo}
        </h3>

        {/* Destination */}
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <FiMapPin className="w-4 h-4 flex-shrink-0 text-purple-500" />
          <span className="text-sm line-clamp-1">{destinoPrincipal}</span>
        </div>

        {/* Duration */}
        {duracion && (
          <div className="flex items-center gap-2 text-slate-600 mb-4">
            <FiClock className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span className="text-sm">{duracion}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {precio}
            </span>
            {paquete.personas && (
              <span className="text-sm text-slate-500 ml-2">
                / {paquete.personas} {paquete.personas === 1 ? 'persona' : 'personas'}
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={url}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-[1.02]"
        >
          Ver Detalles
        </Link>
      </div>
    </article>
  );
};

export default MyPackagesPage;
