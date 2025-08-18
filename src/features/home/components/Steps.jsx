import React from "react";

const Steps = () => (
  <section
    id="pasos"
    className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-white to-blue-50"
    aria-labelledby="pasos-heading"
  >
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content - Mejorado para mobile */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <div className="text-center lg:text-left">
            <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3">
              Proceso simple
            </p>

            <h2
              id="pasos-heading"
              className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight"
            >
              Reserva con VIADCA
              <br />
              en 3 pasos sencillos
            </h2>

            <p className="text-slate-600 text-base sm:text-lg mt-4 lg:hidden">
              Un proceso diseñado para hacer tu experiencia de reserva fácil y
              confiable
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {/* Step 1 - Mejorado */}
            <div className="flex items-start space-x-4 lg:space-x-6 group">
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg lg:text-xl text-slate-800">
                    Consulta personalizada
                  </h3>
                  <span className="bg-yellow-100 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                    Paso 1
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                  Agenda una cita con nuestros asesores especializados. Te
                  ayudamos a diseñar el viaje perfecto para ti.
                </p>
                <div className="mt-3 flex items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    30 min promedio
                  </span>
                  <span className="mx-2">•</span>
                  <span>Gratis</span>
                </div>
              </div>
            </div>

            {/* Step 2 - Mejorado */}
            <div className="flex items-start space-x-4 lg:space-x-6 group">
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg lg:text-xl text-slate-800">
                    Cotización y reserva
                  </h3>
                  <span className="bg-red-100 text-red-900 px-2 py-1 rounded-full text-xs font-medium">
                    Paso 2
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                  Recibe tu cotización detallada y realiza tu reserva con
                  facilidades de pago y seguros incluidos.
                </p>
                <div className="mt-3 flex items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Pago seguro
                  </span>
                  <span className="mx-2">•</span>
                  <span>Meses sin intereses</span>
                </div>
              </div>
            </div>

            {/* Step 3 - Mejorado */}
            <div className="flex items-start space-x-4 lg:space-x-6 group">
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-teal-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg lg:text-xl text-slate-800">
                    ¡Disfruta tu experiencia!
                  </h3>
                  <span className="bg-green-100 text-green-900 px-2 py-1 rounded-full text-xs font-medium">
                    Paso 3
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                  Te acompañamos durante todo el proceso. Soporte 24/7 para que
                  vivas una experiencia inolvidable.
                </p>
                <div className="mt-3 flex items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Soporte 24/7
                  </span>
                  <span className="mx-2">•</span>
                  <span>App móvil</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA móvil */}
          <div className="lg:hidden pt-6">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              type="button"
              aria-label="Comenzar mi viaje"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Comenzar mi viaje</span>
            </button>
          </div>
        </div>

        {/* Right Content - Trip Card mejorado para mobile */}
        <div className="relative order-1 lg:order-2">
          {/* Background Decoration - Solo desktop */}
          <div
            className="hidden lg:block absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-40"
            aria-hidden="true"
          ></div>

          {/* Main Trip Card - Responsivo */}
          <div className="relative bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-100 max-w-md mx-auto hover:shadow-2xl transition-shadow duration-300">
            <div className="relative overflow-hidden rounded-2xl mb-4 sm:mb-6">
              <img
                src="/HomePage/como-reservar-card1.avif"
                alt="Tour a las Pirámides"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Destacado
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg sm:text-xl text-slate-800 mb-2 sm:mb-4">
              Tour Pirámides de Teotihuacán
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-600 text-sm mb-4">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Salidas: Sábados
              </span>
              <span className="hidden sm:block" aria-hidden="true">
                |
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                por VIADCA Tours
              </span>
            </div>

            {/* Iconos de servicios incluidos */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>
                <span className="text-xs text-slate-600 mt-1">Transporte</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-slate-600 mt-1">Comidas</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-slate-600 mt-1">Guía</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-slate-600 text-sm">Cupo disponible</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Desde</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  $2,500
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Trip Card - Solo visible en desktop */}
          <div className="hidden lg:block absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-xl border border-blue-100 w-80">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/HomePage/como-reservar-card2.avif"
                alt="Cancún"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-slate-600 text-sm">Próximo viaje</p>
                <h4 className="font-semibold text-slate-800">
                  Cancún & Riviera Maya
                </h4>
                <p className="text-slate-600 text-sm">Disponible todo el año</p>
              </div>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2"
              aria-hidden="true"
            >
              <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
            </div>
          </div>

          {/* Stats móviles */}
          <div className="lg:hidden mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100 text-center">
              <div className="text-lg font-bold text-blue-600">24/7</div>
              <div className="text-xs text-slate-600">Soporte</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100 text-center">
              <div className="text-lg font-bold text-green-600">15+</div>
              <div className="text-xs text-slate-600">Años</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-md border border-blue-100 text-center">
              <div className="text-lg font-bold text-orange-600">100%</div>
              <div className="text-xs text-slate-600">Seguro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Steps;
