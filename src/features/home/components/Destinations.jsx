import React from 'react'

const Destinations = () => (
  <section id="destinos" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-text-gray font-semibold text-lg uppercase tracking-wide mb-4">Destinos favoritos</p>
        <h2 className="font-volkhov font-bold text-5xl text-secondary">Explora nuestros destinos más populares</h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Playa del Carmen */}
        <article className="destination-card">
          <img 
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/gDmJzZ4BVi.png" 
            alt="Playa del Carmen, México" 
            className="w-full h-80 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-text-gray">Playa del Carmen, México</h3>
              <span className="font-medium text-lg text-text-gray">$8,500</span>
            </div>
            <div className="flex items-center text-text-gray">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Paquete de 5 días</span>
            </div>
          </div>
        </article>
        
        {/* Nueva York */}
        <article className="destination-card">
          <img 
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/nfi38uiyfN.png" 
            alt="Nueva York, Estados Unidos" 
            className="w-full h-80 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-text-gray">Nueva York, Estados Unidos</h3>
              <span className="font-medium text-lg text-text-gray">$25,000</span>
            </div>
            <div className="flex items-center text-text-gray">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Paquete de 7 días</span>
            </div>
          </div>
        </article>
        
        {/* Europa Clásica */}
        <article className="destination-card">
          <img 
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/R7t6L1BN8O.png" 
            alt="Europa Clásica" 
            className="w-full h-80 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-text-gray">Tour Europa Clásica</h3>
              <span className="font-medium text-lg text-text-gray">$45,000</span>
            </div>
            <div className="flex items-center text-text-gray">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Paquete de 15 días</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
)

export default Destinations
