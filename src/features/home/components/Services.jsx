import React from "react";

const Services = () => (
  <section
    id="servicios"
    className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative scroll-mt-32"
    aria-labelledby="servicios-heading"
  >
    {/* Background Decoration - Oculto en mobile */}
    <div
      className="absolute top-0 right-0 opacity-20 hidden lg:grid lg:grid-cols-5 lg:gap-4"
      aria-hidden="true"
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-8 ${i === 10 ? "text-purple" : i === 4 ? "text-orange" : "text-light-gray"}`}
        >
          +
        </div>
      ))}
    </div>

    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 lg:mb-16">
        <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
          NUESTROS SERVICIOS
        </p>
        <h2
          id="servicios-heading"
          className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight"
        >
          Te ofrecemos experiencias completas
        </h2>
        <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Descubre nuestros servicios especializados diseñados para hacer de tu
          viaje una experiencia inolvidable
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Tours Personalizados */}
        <article
          className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group"
          role="article"
          aria-labelledby="svc-tours-title"
        >
          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-orange-300 transition-colors duration-300 group-hover:scale-110 transform"
            aria-hidden="true"
          >
            <svg
              className="w-7 h-7 lg:w-8 lg:h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3
            id="svc-tours-title"
            className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
          >
            Tours Personalizados
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
            Diseñamos itinerarios únicos adaptados a tus gustos, presupuesto y
            tiempo disponible.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-900">
              Personalizado
            </span>
          </div>
        </article>

        {/* Paquetes Nacionales e Internacionales */}
        <article
          className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 relative group"
          role="article"
          aria-labelledby="svc-paquetes-title"
        >
       
          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 relative z-10 group-hover:bg-blue-300 transition-colors duration-300 group-hover:scale-110 transform"
            aria-hidden="true"
          >
            <svg
              className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3
            id="svc-paquetes-title"
            className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
          >
            Destinos Nacionales e Internacionales
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
            Explora México y el mundo con nuestros paquetes completos que
            incluyen vuelos, hospedaje y actividades.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900">
              Nacional / Internacional
            </span>
          </div>
        </article>

        {/* Viajes de Negocios */}
        <article
          className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group"
          role="article"
          aria-labelledby="svc-corp-title"
        >
          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-green-300 transition-colors duration-300 group-hover:scale-110 transform"
            aria-hidden="true"
          >
            <svg
              className="w-7 h-7 lg:w-8 lg:h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
              />
            </svg>
          </div>
          <h3
            id="svc-corp-title"
            className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
          >
            Viajes Corporativos
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
            Soluciones empresariales para convenciones, reuniones de trabajo y
            eventos corporativos.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">
              Empresarial
            </span>
          </div>
        </article>

        {/* Asesoría Especializada */}
        <article
          className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group"
          role="article"
          aria-labelledby="svc-asesoria-title"
        >
          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-purple-300 transition-colors duration-300 group-hover:scale-110 transform"
            aria-hidden="true"
          >
            <svg
              className="w-7 h-7 lg:w-8 lg:h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3
            id="svc-asesoria-title"
            className="font-open-sans font-semibold text-lg lg:text-xl text-slate-800 mb-3 lg:mb-4 text-center"
          >
            Asesoría Especializada
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base text-center">
            Más de 15 años de experiencia respaldándonos para brindarte la mejor
            asesoría y recomendaciones.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-900">
              Expertos
            </span>
          </div>
        </article>
      </div>

      {/* Call to Action - Mejorado para mobile */}
      <div className="mt-12 lg:mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 border border-blue-200">
          <h3 className="font-semibold text-xl lg:text-2xl text-slate-800 mb-3 lg:mb-4">
            ¿Listo para tu próxima aventura?
          </h3>
          <p className="text-slate-600 text-sm lg:text-base mb-6 max-w-2xl mx-auto">
            Nuestro equipo de expertos está aquí para ayudarte a planificar el
            viaje perfecto
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              type="button"
              aria-label="Contactar al equipo"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>Contáctanos</span>
            </button>
            <button
              className="w-full sm:w-auto border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              type="button"
              aria-label="Abrir chat en línea"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Chat en línea</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
