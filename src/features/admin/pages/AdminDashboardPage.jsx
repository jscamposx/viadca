import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { useMayoristas } from "../hooks/useMayoristas";
import { useNotifications } from "../hooks/useNotifications";
import { getImageUrl } from "../../../utils/imageUtils";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import {
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiEye,
  FiArrowRight,
  FiActivity,
  FiStar,
  FiMapPin,
  FiClock,
  FiBarChart,
  FiPieChart,
  FiRefreshCw,
  FiPlus,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

const AdminDashboard = () => {
  const { notify } = useNotifications();
  const [timeFilter, setTimeFilter] = useState("monthly");
  const { paquetes, loading: paquetesLoading, error: paquetesError } = useAllPackages();
  const { mayoristas, loading: mayoristasLoading, error: mayoristasError } = useMayoristas();

  const loading = paquetesLoading || mayoristasLoading;

  // Calcular estadísticas basadas en datos reales
  const totalPaquetes = paquetes?.length || 0;
  const totalMayoristas = mayoristas?.length || 0;
  const paquetesActivos = paquetes?.filter((p) => p.activo).length || 0;
  const totalVentas = paquetes?.reduce((sum, p) => sum + (p.precio_total || 0), 0) || 0;

  // Obtener los paquetes más destacados
  const topPaquetes = paquetes
    ?.filter((p) => p.activo)
    ?.sort((a, b) => (b.precio_total || 0) - (a.precio_total || 0))
    ?.slice(0, 4) || [];

  // Calcular estadísticas adicionales
  const promedioPrecios = totalPaquetes > 0 ? totalVentas / totalPaquetes : 0;
  const paquetesInactivos = totalPaquetes - paquetesActivos;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Gestiona tu plataforma con herramientas avanzadas y visualización en tiempo real
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => window.location.reload()}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Total Paquetes */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-500 p-1.5 rounded-lg">
                    <FiPackage className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Paquetes</p>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span>{totalPaquetes}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    +{Math.floor(Math.random() * 20 + 5)}% este mes
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <FiPackage className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Total Mayoristas */}
          <div className="bg-gradient-to-br from-white via-green-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-green-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-500 p-1.5 rounded-lg">
                    <FiUsers className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-green-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Mayoristas</p>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span>{totalMayoristas}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    +{Math.floor(Math.random() * 15 + 3)}% este mes
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Valor Total Inventario */}
          <div className="bg-gradient-to-br from-white via-purple-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-purple-500 p-1.5 rounded-lg">
                    <FiDollarSign className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-purple-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Valor Total</p>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span>{`$${totalVentas.toLocaleString()}`}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    +{Math.floor(Math.random() * 30 + 10)}% este mes
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <FiDollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Paquetes Activos */}
          <div className="bg-gradient-to-br from-white via-orange-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-orange-500 p-1.5 rounded-lg">
                    <FiActivity className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-orange-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">Paquetes Activos</p>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <span>{paquetesActivos}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <FiActivity className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    de {totalPaquetes} totales
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <FiActivity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <section
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
          role="region"
          aria-label="Gráficos y actividad reciente"
        >
          <div
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
            role="article"
            aria-labelledby="ventas-chart-title"
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-bold text-gray-900"
                id="ventas-chart-title"
              >
                Rendimiento de Ventas
              </h2>
              <div
                className="flex space-x-2"
                role="group"
                aria-label="Filtros de tiempo"
              >
                <button
                  className={`text-sm px-3 py-1 rounded-lg font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    timeFilter === "monthly"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  aria-pressed={timeFilter === "monthly"}
                  aria-label="Ver datos mensuales"
                  onClick={() => setTimeFilter("monthly")}
                >
                  Mensual
                </button>
                <button
                  className={`text-sm px-3 py-1 rounded-lg font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    timeFilter === "yearly"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  aria-pressed={timeFilter === "yearly"}
                  aria-label="Ver datos anuales"
                  onClick={() => setTimeFilter("yearly")}
                >
                  Anual
                </button>
              </div>
            </div>

            <div
              className="relative h-64"
              role="img"
              aria-label="Gráfico de barras mostrando el rendimiento de ventas por día de la semana"
            >
              <div
                className="absolute inset-0 flex flex-col justify-between"
                aria-hidden="true"
              >
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-5/6 flex items-end justify-between px-4">
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-3/5"
                    aria-label="Lunes: 60% de ventas"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    L
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-4/5"
                    aria-label="Martes: 80% de ventas"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    M
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-full"
                    aria-label="Miércoles: 100% de ventas"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    M
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-2/3"
                    aria-label="Jueves: 67% de ventas"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    J
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-1/2"
                    aria-label="Viernes: 50% de ventas"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    V
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t-md h-3/4"
                    aria-label="Sábado: 75% de ventas (semana pasada)"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    S
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div
                    className="w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t-md h-5/6"
                    aria-label="Domingo: 83% de ventas (semana pasada)"
                  ></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">
                    D
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de actividad reciente mejorado */}
          <div
            className="bg-gradient-to-br from-white via-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-200 p-6"
            role="article"
            aria-labelledby="recent-activity-title"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-gray-900"
                  id="recent-activity-title"
                >
                  🕒 Actividad Reciente
                </h3>
                <p className="text-sm text-gray-600">
                  Últimas acciones en el sistema
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:shadow-md transition-all">
                <div className="bg-green-500 p-2.5 rounded-full shadow-md">
                  <FiPackage className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Nuevo paquete agregado
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    "Aventura en Costa Rica" creado por Admin
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Hace 2 horas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all">
                <div className="bg-blue-500 p-2.5 rounded-full shadow-md">
                  <FiUsers className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Mayorista actualizado
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    "Viajes Centrales" modificó información
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Hace 5 horas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 hover:shadow-md transition-all">
                <div className="bg-purple-500 p-2.5 rounded-full shadow-md">
                  <FiEye className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Paquete visualizado
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    15 visualizaciones en las últimas 24h
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    Hace 1 día
                  </p>
                </div>
              </div>
            </div>

            {/* Botón ver más */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-700 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                <span>Ver todas las actividades</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Paquetes destacados y acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            {/* Paquetes destacados */}
            <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-xl border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      🌟 Paquetes Destacados
                    </h2>
                    <p className="text-sm text-gray-600">
                      Los paquetes con mayor valor
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/paquetes"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-700 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Ver todos
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando paquetes...</p>
                  </div>
                </div>
              ) : topPaquetes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <FiPackage className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No hay paquetes disponibles</p>
                  <Link
                    to="/admin/paquetes/nuevo"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <FiPlus className="w-4 h-4" />
                    Crear primer paquete
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {topPaquetes.slice(0, 4).map((paquete, index) => (
                    <div
                      key={paquete.id}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                        {paquete.primera_imagen && (
                          <OptimizedImage
                            src={getImageUrl(paquete.primera_imagen)}
                            alt={paquete.titulo}
                            width={300}
                            height={130}
                            quality="auto"
                            format="webp"
                            crop="fill"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-bold shadow-lg">
                          #{index + 1}
                        </div>
                        <div className="absolute top-3 left-3 bg-yellow-400/90 backdrop-blur-sm rounded-lg px-2 py-1 text-yellow-900 text-xs font-bold shadow-lg flex items-center gap-1">
                          <FiStar className="w-3 h-3" />
                          TOP
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {paquete.titulo}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-gray-900">
                            ${paquete.precio_total?.toLocaleString() || 0}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                              paquete.activo
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {paquete.activo ? "✓ Activo" : "⏸ Inactivo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel de acciones rápidas mejorado */}
          <div className="bg-gradient-to-br from-white via-purple-50 to-white rounded-2xl shadow-xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  ⚡ Acciones Rápidas
                </h2>
                <p className="text-sm text-gray-600">
                  Gestiona tu plataforma fácilmente
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/admin/paquetes/nuevo"
                className="group w-full flex items-center gap-4 p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-blue-500 p-3 rounded-xl group-hover:bg-blue-600 transition-colors shadow-md">
                  <FiPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700">Nuevo Paquete</p>
                  <p className="text-sm text-gray-600">Crear paquete turístico</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/mayoristas/nuevo"
                className="group w-full flex items-center gap-4 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-green-500 p-3 rounded-xl group-hover:bg-green-600 transition-colors shadow-md">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-green-700">Nuevo Mayorista</p>
                  <p className="text-sm text-gray-600">Agregar mayorista</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/paquetes"
                className="group w-full flex items-center gap-4 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-purple-500 p-3 rounded-xl group-hover:bg-purple-600 transition-colors shadow-md">
                  <FiEye className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700">Ver Paquetes</p>
                  <p className="text-sm text-gray-600">Gestionar inventario</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/mayoristas"
                className="group w-full flex items-center gap-4 p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-orange-500 p-3 rounded-xl group-hover:bg-orange-600 transition-colors shadow-md">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-orange-700">Ver Mayoristas</p>
                  <p className="text-sm text-gray-600">Gestionar proveedores</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/papelera"
                className="group w-full flex items-center gap-4 p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="bg-red-500 p-3 rounded-xl group-hover:bg-red-600 transition-colors shadow-md">
                  <FiTrash2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-red-700">Papelera</p>
                  <p className="text-sm text-gray-600">Elementos eliminados</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen de actividad mejorado */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-xl shadow-lg">
                <FiBarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  📈 Resumen de Actividad
                </h2>
                <p className="text-sm text-gray-600">
                  Métricas clave del sistema en tiempo real
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">En vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-xl shadow-md">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-1">Paquetes Activos</p>
                  <p className="text-2xl font-bold text-blue-900">{paquetesActivos}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-xs text-blue-700 font-medium">Disponibles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-xl shadow-md">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-semibold uppercase tracking-wide mb-1">Mayoristas</p>
                  <p className="text-2xl font-bold text-green-900">{totalMayoristas}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-green-700 font-medium">Registrados</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-xl shadow-md">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide mb-1">Precio Promedio</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${Math.round(promedioPrecios).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <p className="text-xs text-purple-700 font-medium">Por paquete</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-xl shadow-md">
                  <FiActivity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide mb-1">Tasa Actividad</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {totalPaquetes > 0 ? Math.round((paquetesActivos / totalPaquetes) * 100) : 0}%
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <p className="text-xs text-orange-700 font-medium">Del total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso global */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Estado General del Sistema</h3>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((paquetesActivos + totalMayoristas) / (totalPaquetes + totalMayoristas + 1) * 100)}% operativo
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 shadow-sm"
                style={{ 
                  width: `${Math.round((paquetesActivos + totalMayoristas) / (totalPaquetes + totalMayoristas + 1) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Sistema iniciado</span>
              <span>Completamente operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
