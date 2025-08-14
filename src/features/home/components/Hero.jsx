import React from 'react'

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 scroll-mt-32">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-hero-pattern bg-no-repeat bg-right-top opacity-20"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full opacity-30"></div>

      {/* Hero Content - Optimizado para mobile */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-8 lg:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <p className="text-blue-600 font-bold text-base sm:text-lg lg:text-xl uppercase tracking-wide">
                  VIADCA by Zafiro Tours
                </p>
                <p className="text-slate-600 text-sm sm:text-base lg:hidden">
                  Desde Durango para el mundo
                </p>
              </div>
              
              <h1 className="font-volkhov font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-slate-800">
                <span className="block">Vive experiencias</span>
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  extraordinarias,
                </span>
                <span className="block">viaja sin límites</span>
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Somos tu agencia de viajes de confianza en Durango. Más de 15 años creando aventuras únicas, tours personalizados y experiencias inolvidables.
              </p>
              
              {/* CTA Buttons - Mejorados para mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Planifica tu viaje</span>
                </button>
                <button className="w-full sm:w-auto border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Contáctanos</span>
                </button>
              </div>

              {/* Stats - Solo visible en desktop */}
              <div className="hidden lg:flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">15+</div>
                  <div className="text-sm text-slate-600">Años de experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">5,000+</div>
                  <div className="text-sm text-slate-600">Viajeros felices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">50+</div>
                  <div className="text-sm text-slate-600">Destinos</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Hero Image optimizada para mobile */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-3xl overflow-hidden shadow-none border-0">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/1pyELBTywW.png" 
                  alt="Viajero explorando destinos increíbles" 
                  className="w-full h-auto sm:h-80 lg:h-auto max-h-[70vh] object-contain sm:object-cover border-0 shadow-none ring-0 outline-none"
                />
                
                {/* Overlay gradient para mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden"></div>
                
                {/* Floating elements - Adaptados para mobile */}
                <div className="absolute top-4 right-4 lg:top-10 lg:right-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg animate-bounce">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/BTbQz3WXGG.svg" 
                      alt="Icono de avión" 
                      className="w-6 h-6 lg:w-8 lg:h-8"
                    />
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 lg:bottom-20 lg:left-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/RYL1asKg5e.svg" 
                      alt="Icono de avión" 
                      className="w-6 h-6 lg:w-8 lg:h-8"
                    />
                  </div>
                </div>

                {/* Badge de confianza - Solo mobile */}
                <div className="absolute bottom-4 right-4 lg:hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Agencia certificada</span>
                  </div>
                </div>
              </div>

              {/* Stats móviles - Tarjetas flotantes */}
              <div className="flex lg:hidden justify-center gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center flex-1 max-w-24">
                  <div className="text-xl font-bold text-blue-600">15+</div>
                  <div className="text-xs text-slate-600">Años</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center flex-1 max-w-24">
                  <div className="text-xl font-bold text-green-600">5K+</div>
                  <div className="text-xs text-slate-600">Clientes</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100 text-center flex-1 max-w-24">
                  <div className="text-xl font-bold text-orange-600">50+</div>
                  <div className="text-xs text-slate-600">Destinos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
