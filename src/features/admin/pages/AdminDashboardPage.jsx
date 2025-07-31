import { useState } from "react";

import { useNotifications } from "../hooks/useNotifications";

const AdminDashboard = () => {
  const { notify } = useNotifications();
  const [timeFilter, setTimeFilter] = useState('monthly');

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6 lg:p-8" role="main">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-md sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Gestiona tu plataforma con herramientas avanzadas y visualización de
            datos en tiempo real
          </p>
        </header>


        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" role="region" aria-label="Métricas principales del dashboard">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl" role="article" aria-labelledby="paquetes-totales-title">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium" id="paquetes-totales-title">Paquetes Totales</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">142</h2>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-xl" aria-hidden="true">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Icono de paquetes"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Tendencia positiva"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
                <span className="text-sm text-green-600 ml-1 font-medium">
                  +12% este mes
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl" role="article" aria-labelledby="ventas-mes-title">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium" id="ventas-mes-title">Ventas del Mes</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  $8,250
                </h2>
              </div>
              <div className="bg-green-500/10 p-3 rounded-xl" aria-hidden="true">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Icono de dinero"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2v1m0 0v1m-3.343-3.343A6 6 0 0112 6m-3.343 3.343a6 6 0 000 8.486m11.314-8.486a6 6 0 010 8.486M12 18a6 6 0 01-3.343-10.657"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Tendencia positiva"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
                <span className="text-sm text-green-600 ml-1 font-medium">
                  +24% este mes
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl" role="article" aria-labelledby="usuarios-activos-title">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium" id="usuarios-activos-title">Usuarios Activos</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">2,842</h2>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-xl" aria-hidden="true">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Icono de usuarios"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Tendencia positiva"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
                <span className="text-sm text-green-600 ml-1 font-medium">
                  +8% este mes
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl" role="article" aria-labelledby="tasa-conversion-title">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium" id="tasa-conversion-title">Tasa de Conversión</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">24.8%</h2>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-xl" aria-hidden="true">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Icono de estadísticas"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Tendencia positiva"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  ></path>
                </svg>
                <span className="text-sm text-green-600 ml-1 font-medium">
                  +3.2% este mes
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10" role="region" aria-label="Gráficos y actividad reciente">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6" role="article" aria-labelledby="ventas-chart-title">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900" id="ventas-chart-title">
                Rendimiento de Ventas
              </h2>
              <div className="flex space-x-2" role="group" aria-label="Filtros de tiempo">
                <button 
                  className={`text-sm px-3 py-1 rounded-lg font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    timeFilter === 'monthly'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={timeFilter === 'monthly'}
                  aria-label="Ver datos mensuales"
                  onClick={() => setTimeFilter('monthly')}
                >
                  Mensual
                </button>
                <button 
                  className={`text-sm px-3 py-1 rounded-lg font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    timeFilter === 'yearly'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={timeFilter === 'yearly'}
                  aria-label="Ver datos anuales"
                  onClick={() => setTimeFilter('yearly')}
                >
                  Anual
                </button>
              </div>
            </div>

            <div className="relative h-64" role="img" aria-label="Gráfico de barras mostrando el rendimiento de ventas por día de la semana">
              <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
                <div className="border-t border-gray-200"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-5/6 flex items-end justify-between px-4">
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-3/5" aria-label="Lunes: 60% de ventas"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">L</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-4/5" aria-label="Martes: 80% de ventas"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">M</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-full" aria-label="Miércoles: 100% de ventas"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">M</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-2/3" aria-label="Jueves: 67% de ventas"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">J</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md h-1/2" aria-label="Viernes: 50% de ventas"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">V</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t-md h-3/4" aria-label="Sábado: 75% de ventas (semana pasada)"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">S</span>
                </div>
                <div className="flex flex-col items-center w-1/12">
                  <div className="w-3 bg-gradient-to-t from-green-400 to-green-600 rounded-t-md h-5/6" aria-label="Domingo: 83% de ventas (semana pasada)"></div>
                  <span className="text-xs text-gray-700 mt-1 font-medium">D</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center" role="group" aria-label="Leyenda del gráfico">
              <div className="flex items-center mr-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" aria-hidden="true"></div>
                <span className="text-sm text-gray-700 font-medium">Semana actual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" aria-hidden="true"></div>
                <span className="text-sm text-gray-700 font-medium">Semana pasada</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6" role="article" aria-labelledby="actividad-reciente-title">
            <h2 className="text-xl font-bold text-gray-900 mb-6" id="actividad-reciente-title">
              Actividad Reciente
            </h2>

            <div className="space-y-4" role="list" aria-label="Lista de actividades recientes">
              <div className="flex items-start" role="listitem">
                <div className="bg-blue-100 p-2 rounded-full mr-3" aria-hidden="true">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Pedido completado"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Nuevo pedido completado
                  </p>
                  <p className="text-sm text-gray-700">
                    Pedido #ORD-2841 por $320
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 12 minutos</p>
                </div>
              </div>

              <div className="flex items-start" role="listitem">
                <div className="bg-green-100 p-2 rounded-full mr-3" aria-hidden="true">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Nuevo usuario"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Nuevo usuario registrado
                  </p>
                  <p className="text-sm text-gray-700">Maria Rodriguez</p>
                  <p className="text-xs text-gray-500 mt-1">Hace 34 minutos</p>
                </div>
              </div>

              <div className="flex items-start" role="listitem">
                <div className="bg-amber-100 p-2 rounded-full mr-3" aria-hidden="true">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Pago pendiente"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pago pendiente</p>
                  <p className="text-sm text-gray-700">
                    Pedido #ORD-2839 por $150
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                </div>
              </div>

              <div className="flex items-start" role="listitem">
                <div className="bg-purple-100 p-2 rounded-full mr-3" aria-hidden="true">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Artículo actualizado"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Artículo actualizado
                  </p>
                  <p className="text-sm text-gray-700">
                    Paquete Premium por Carlos
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                </div>
              </div>
            </div>

            <button 
              className="w-full mt-6 py-2 text-center text-blue-700 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Ver toda la actividad reciente"
            >
              Ver toda la actividad
            </button>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-10" role="region" aria-labelledby="paquetes-vendidos-title">
          <h2 className="text-xl font-bold text-gray-900 mb-6" id="paquetes-vendidos-title">
            Paquetes Más Vendidos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="Lista de paquetes más vendidos">
            <article className="border border-gray-200 rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500" role="listitem" tabindex="0" aria-labelledby="paquete-premium-title">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium" aria-label="Posición número 1">
                  #1
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900" id="paquete-premium-title">
                  Paquete Premium
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  Todo incluido con beneficios exclusivos
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-gray-900 text-lg">$499</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                    142 ventas
                  </span>
                </div>
              </div>
            </article>

            <article className="border border-gray-200 rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500" role="listitem" tabindex="0" aria-labelledby="paquete-empresarial-title">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-32 relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium" aria-label="Posición número 2">
                  #2
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900" id="paquete-empresarial-title">
                  Paquete Empresarial
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  Solución completa para negocios
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-gray-900 text-lg">$899</span>
                  <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
                    98 ventas
                  </span>
                </div>
              </div>
            </article>

            <article className="border border-gray-200 rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500" role="listitem" tabindex="0" aria-labelledby="paquete-basico-title">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-32 relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium" aria-label="Posición número 3">
                  #3
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900" id="paquete-basico-title">
                  Paquete Básico
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  Solución esencial para principiantes
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-gray-900 text-lg">$199</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    87 ventas
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
