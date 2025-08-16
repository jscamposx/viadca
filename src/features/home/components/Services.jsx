import React from "react";
import { FiMapPin, FiGlobe, FiBriefcase, FiCompass, FiPhoneCall, FiMessageSquare } from "react-icons/fi";

const Services = () => (
  <section
    id="servicios"
    className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-white via-blue-50/40 to-white"
    aria-labelledby="servicios-heading"
  >
    {/* Background Decoration - Oculto en mobile */}
    <div
      className="absolute top-0 right-0 opacity-20 hidden lg:grid lg:grid-cols-5 lg:gap-4 pointer-events-none select-none"
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

    {/* Blobs decorativos sutiles para profundidad */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-200/60 blur-3xl opacity-50" aria-hidden="true" />
    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200/50 to-rose-200/50 blur-3xl opacity-40" aria-hidden="true" />

    <div className="max-w-7xl mx-auto relative">
      <div className="text-center mb-12 lg:mb-16">
        <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
          NUESTROS SERVICIOS
        </p>
        <h2
          id="servicios-heading"
          className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700"
        >
          Te ofrecemos experiencias completas
        </h2>
        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" aria-hidden="true" />
        <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
          Descubre nuestros servicios especializados diseñados para hacer de tu
          viaje una experiencia inolvidable
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Tours Personalizados */}
        <article
          className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100 hover:border-orange-300 group"
          role="article"
          aria-labelledby="svc-tours-title"
        >
          {/* Glow suave */}
          <span className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-orange-200/0 via-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" aria-hidden="true" />
          {/* Blob de acento */}
          <span className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-200 to-amber-200 blur-2xl opacity-40 group-hover:opacity-60 transition" aria-hidden="true" />

          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-orange-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-orange-300/40"
            aria-hidden="true"
          >
            <FiCompass className="w-7 h-7 lg:w-8 lg:h-8 text-orange-600" aria-hidden="true" />
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-900">Personalizado</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">Flexibilidad</span>
          </div>
        </article>

        {/* Paquetes Nacionales e Internacionales */}
        <article
          className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 group"
          role="article"
          aria-labelledby="svc-paquetes-title"
        >
          <span className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-blue-200/0 via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" aria-hidden="true" />
          <span className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 blur-2xl opacity-40 group-hover:opacity-60 transition" aria-hidden="true" />

          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-blue-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-blue-300/40"
            aria-hidden="true"
          >
            <FiGlobe className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600" aria-hidden="true" />
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900">Nacional / Internacional</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Todo incluido</span>
          </div>
        </article>

        {/* Viajes de Negocios */}
        <article
          className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100 hover:border-green-300 group"
          role="article"
          aria-labelledby="svc-corp-title"
        >
          <span className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-green-200/0 via-green-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" aria-hidden="true" />
          <span className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-green-200 to-emerald-200 blur-2xl opacity-40 group-hover:opacity-60 transition" aria-hidden="true" />

          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-green-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-green-300/40"
            aria-hidden="true"
          >
            <FiBriefcase className="w-7 h-7 lg:w-8 lg:h-8 text-green-600" aria-hidden="true" />
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-900">Empresarial</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Optimización</span>
          </div>
        </article>

        {/* Asesoría Especializada */}
        <article
          className="relative overflow-hidden bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100 hover:border-purple-300 group"
          role="article"
          aria-labelledby="svc-asesoria-title"
        >
          <span className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-purple-200/0 via-purple-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" aria-hidden="true" />
          <span className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-purple-200 to-fuchsia-200 blur-2xl opacity-40 group-hover:opacity-60 transition" aria-hidden="true" />

          <div
            className="w-14 h-14 lg:w-16 lg:h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-purple-300 transition-colors duration-300 group-hover:scale-110 transform ring-1 ring-purple-300/40"
            aria-hidden="true"
          >
            <FiMapPin className="w-7 h-7 lg:w-8 lg:h-8 text-purple-600" aria-hidden="true" />
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-900">Expertos</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">Confianza</span>
          </div>
        </article>
      </div>

      {/* Call to Action - Mejorado para mobile */}
      <div className="mt-12 lg:mt-16 text-center">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 border border-blue-200">
          {/* brillo sutil */}
          <span className="pointer-events-none absolute -inset-16 bg-gradient-to-br from-blue-200/0 via-indigo-200/20 to-transparent blur-3xl opacity-70" aria-hidden="true" />

          <h3 className="relative font-semibold text-xl lg:text-2xl text-slate-800 mb-3 lg:mb-4">
            ¿Listo para tu próxima aventura?
          </h3>
          <p className="relative text-slate-600 text-sm lg:text-base mb-6 max-w-2xl mx-auto">
            Nuestro equipo de expertos está aquí para ayudarte a planificar el
            viaje perfecto
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              type="button"
              aria-label="Contactar al equipo"
            >
              <FiPhoneCall className="w-5 h-5" aria-hidden="true" />
              <span>Contáctanos</span>
            </button>
            <button
              className="w-full sm:w-auto border-2 border-blue-600 text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              type="button"
              aria-label="Abrir chat en línea"
            >
              <FiMessageSquare className="w-5 h-5" aria-hidden="true" />
              <span>Chat en línea</span>
            </button>
          </div>
          <p className="relative mt-3 text-xs text-slate-500">Respuesta en minutos • Atención personalizada</p>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
