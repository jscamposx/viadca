import React from 'react'

const Services = () => (
  <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 relative scroll-mt-32">
    {/* Background Decoration */}
    <div className="absolute top-0 right-0 grid grid-cols-5 gap-4 opacity-20">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`w-4 h-8 ${i === 10 ? 'text-purple' : i === 4 ? 'text-orange' : 'text-light-gray'}`}>
          +
        </div>
      ))}
    </div>
    
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-slate-600 font-semibold text-lg uppercase tracking-wide mb-4">NUESTROS SERVICIOS</p>
        <h2 className="font-volkhov font-bold text-5xl text-slate-800">Te ofrecemos experiencias completas</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Tours Personalizados */}
        <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
          <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-orange-300 transition-colors duration-300">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Tours Personalizados</h3>
          <p className="text-slate-600 leading-relaxed">
            Diseñamos itinerarios únicos adaptados a tus gustos, presupuesto y tiempo disponible.
          </p>
        </article>
        
        {/* Paquetes Nacionales e Internacionales */}
        <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 relative">
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-600 rounded-3xl opacity-20"></div>
          <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 hover:bg-blue-300 transition-colors duration-300">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Destinos Nacionales e Internacionales</h3>
          <p className="text-slate-600 leading-relaxed">
            Explora México y el mundo con nuestros paquetes completos que incluyen vuelos, hospedaje y actividades.
          </p>
        </article>
        
        {/* Viajes de Negocios */}
        <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
          <div className="w-16 h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-green-300 transition-colors duration-300">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
            </svg>
          </div>
          <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Viajes Corporativos</h3>
          <p className="text-slate-600 leading-relaxed">
            Soluciones empresariales para convenciones, reuniones de trabajo y eventos corporativos.
          </p>
        </article>
        
        {/* Asesoría Especializada */}
        <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
          <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-purple-300 transition-colors duration-300">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Asesoría Especializada</h3>
          <p className="text-slate-600 leading-relaxed">
            Más de 15 años de experiencia respaldándonos para brindarte la mejor asesoría y recomendaciones.
          </p>
        </article>
      </div>
    </div>
  </section>
)

export default Services
