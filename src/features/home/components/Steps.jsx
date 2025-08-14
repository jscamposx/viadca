import React from 'react'

const Steps = () => (
  <section id="pasos" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <p className="text-text-gray font-semibold text-lg uppercase tracking-wide">Proceso simple</p>
          
          <h2 className="font-volkhov font-bold text-5xl text-secondary leading-tight">
            Reserva con VIADCA<br />
            en 3 pasos sencillos
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-gray mb-2">Consulta personalizada</h3>
                <p className="text-text-gray leading-relaxed">
                  Agenda una cita con nuestros asesores especializados.<br />
                  Te ayudamos a diseñar el viaje perfecto para ti.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-gray mb-2">Cotización y reserva</h3>
                <p className="text-text-gray leading-relaxed">
                  Recibe tu cotización detallada y realiza tu reserva<br />
                  con facilidades de pago y seguros incluidos.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-gray mb-2">¡Disfruta tu experiencia!</h3>
                <p className="text-text-gray leading-relaxed">
                  Te acompañamos durante todo el proceso.<br />
                  Soporte 24/7 para que vivas una experiencia inolvidable.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Content - Trip Card */}
        <div className="relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-40"></div>
          
          {/* Main Trip Card */}
          <div className="relative bg-white rounded-3xl p-6 shadow-custom max-w-md mx-auto">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/TV4baWkhQk.png" 
              alt="Tour a las Pirámides" 
              className="w-full h-48 object-cover rounded-3xl mb-6"
            />
            
            <h3 className="font-medium text-lg text-secondary mb-4">Tour Pirámides de Teotihuacán</h3>
            
            <div className="flex items-center text-text-gray text-sm mb-4">
              <span>Salida: Sábados</span>
              <span className="mx-2">|</span>
              <span>por VIADCA Tours</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-text-gray text-sm">Grupos disponibles</span>
              </div>
              <div className="text-lg font-bold text-blue-600">$2,500</div>
            </div>
          </div>
          
          {/* Ongoing Trip Card */}
          <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-custom w-80">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/7K2Xap5m0S.png" 
                alt="Cancún" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-text-gray text-sm">Próximo viaje</p>
                <h4 className="font-medium text-secondary">Cancún & Riviera Maya</h4>
                <p className="text-text-gray text-sm">Disponible todo el año</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default Steps
