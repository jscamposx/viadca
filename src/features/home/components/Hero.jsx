import React from 'react'
import { Link } from 'react-router-dom'

const Hero = ({ isScrolled, isAuthenticated, isAdmin, displayName, displayEmail, userInitial, activeSection, handleNavClick, logos, handlers }) => {
  const { setIsMobileMenuOpen, isMobileMenuOpen, setIsUserMenuOpen, isUserMenuOpen, closeMobileMenu, closeUserMenu, handleLogout } = handlers
  return (
    <section id="hero" className="relative min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 scroll-mt-32">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-hero-pattern bg-no-repeat bg-right-top opacity-20"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full opacity-30"></div>
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out px-4 sm:px-6 lg:px-8 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-lg shadow-2xl border-b border-blue-200/60' 
          : 'bg-gradient-to-br from-blue-50/90 to-orange-50/90 backdrop-blur-md'
      }`}>
        <nav className={`flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-6'
        }`}>
          <div className="flex items-center w-full">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <img 
                src="/viadcalogo.webp" 
                alt="Logo" 
                className="h-12 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />
            </div>
            {/* Links centro */}
            <div className="hidden lg:flex items-center space-x-8 mx-auto">
              {[
                { id: 'hero', label: 'Inicio' },
                { id: 'servicios', label: 'Servicios' },
                { id: 'destinos', label: 'Destinos' },
                { id: 'pasos', label: 'Cómo Reservar' },
                { id: 'testimonios', label: 'Testimonios' }
              ].map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative transition-all duration-300 font-medium hover:scale-105 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-300 ${
                    activeSection === link.id
                      ? 'text-blue-600 after:w-full after:bg-blue-600'
                      : 'text-slate-700 hover:text-blue-600 after:w-0 after:bg-blue-600 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Usuario derecha */}
            <div className="hidden lg:flex items-center gap-6 ml-auto">
              {isAuthenticated() ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userInitial}
                    </div>
                    <span>{displayName}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-blue-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {userInitial}
                          </div>
                          <div>
                            <p className="text-slate-800 font-medium">{displayName}</p>
                            <p className="text-slate-600 text-sm">{displayEmail || 'Sin email'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            onClick={closeUserMenu}
                            className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                          >
                            Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={closeUserMenu}
                          className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                        >
                          Mi Perfil
                        </Link>
                        <hr className="my-2 border-blue-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="relative text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">Iniciar sesión</Link>
                  <Link to="/register" className="border-2 border-slate-700 text-slate-700 px-6 py-3 rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
            {/* Botón móvil */}
            <div className="lg:hidden ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-blue-600 p-2 transition-colors duration-300"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden backdrop-blur-md border-t transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/98 border-blue-100/50' 
              : 'bg-gradient-to-br from-blue-50/98 to-orange-50/98 border-white/30'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {[
                { id: 'hero', label: 'Inicio' },
                { id: 'servicios', label: 'Servicios' },
                { id: 'destinos', label: 'Destinos' },
                { id: 'pasos', label: 'Cómo Reservar' },
                { id: 'testimonios', label: 'Testimonios' }
              ].map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`block transition-all duration-300 py-2 px-3 rounded-lg font-medium ${
                    activeSection === link.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >{link.label}</a>
              ))}

              <div className={`pt-4 space-y-4 border-t ${
                isScrolled ? 'border-blue-100/50' : 'border-white/30'
              }`}>
                {isAuthenticated() ? (
                  // Usuario autenticado en móvil
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-slate-800 font-medium">{displayName}</p>
                        <p className="text-slate-600 text-sm">{displayEmail || 'Sin email'}</p>
                      </div>
                    </div>
                    {isAdmin() && (
                      <Link to="/admin" onClick={closeMobileMenu} className="block text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-2 px-3 rounded-lg font-medium">Dashboard</Link>
                    )}
                    <Link to="/profile" onClick={closeMobileMenu} className="block text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-2 px-3 rounded-lg font-medium">Mi Perfil</Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 py-2 px-3 rounded-lg font-medium"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  // Usuario no autenticado en móvil
                  <>
                    <Link to="/login" onClick={closeMobileMenu} className="block text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-2 px-3 rounded-lg font-medium">Iniciar sesión</Link>
                    <Link to="/register" onClick={closeMobileMenu} className="block w-full text-center border-2 border-slate-700 text-slate-700 px-6 py-3 rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:shadow-lg transition-all duration-300 font-medium">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <p className="text-blue-600 font-bold text-xl uppercase tracking-wide">
                VIADCA by Zafiro Tours - Desde Durango para el mundo
              </p>
              
              <h1 className="font-volkhov font-bold text-6xl lg:text-7xl leading-tight text-slate-800">
                Vive experiencias<br />
                extraordinarias,<br />
                viaja sin límites
              </h1>
              
              <p className="text-slate-600 text-xl leading-relaxed max-w-lg">
                Somos tu agencia de viajes de confianza en Durango. Más de 15 años creando aventuras únicas, tours personalizados y experiencias inolvidables para exploradores como tú.
              </p>
              
              <div className="flex items-center space-x-6">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105">
                  Planifica tu viaje
                </button>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="relative">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/1pyELBTywW.png" 
                alt="Traveler" 
                className="w-full h-auto rounded-3xl"
              />
              
              {/* Floating Plane Icons */}
              <div className="absolute top-10 right-10 animate-bounce">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/BTbQz3WXGG.svg" 
                  alt="Plane" 
                  className="w-12 h-12"
                />
              </div>
              
              <div className="absolute bottom-20 left-10 animate-bounce delay-1000">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/RYL1asKg5e.svg" 
                  alt="Plane" 
                  className="w-12 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
