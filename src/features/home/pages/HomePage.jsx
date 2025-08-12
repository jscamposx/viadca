import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [activeSection, setActiveSection] = useState('hero')

  // Centralizar obtención del nombre a mostrar
  const displayName = useMemo(() => {
    if (!user) return 'Usuario'
    const candidate = (
      user.nombre ||
      user.name ||
      user.usuario ||
      user.username ||
      (user.primerNombre && user.apellido ? `${user.primerNombre} ${user.apellido}` : null) ||
      (user.primerNombre && user.primerApellido ? `${user.primerNombre} ${user.primerApellido}` : null) ||
      (user.nombreCompleto) ||
      (user.email ? user.email.split('@')[0] : null) ||
      (user.correo ? user.correo.split('@')[0] : null)
    )
    return (candidate || 'Usuario').toString().trim()
  }, [user])

  const displayEmail = user?.email || user?.correo || user?.mail || null
  const userInitial = useMemo(() => displayName.charAt(0).toUpperCase(), [displayName])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const closeUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      closeUserMenu()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const logos = useMemo(() => [
    { src: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/De1PjNgdS5.png', alt: 'Partner 1', h: 'h-24' },
    { src: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/t0MtADoBfm.png', alt: 'Partner 2', h: 'h-24' },
    { src: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/KQ9JLYeVaR.png', alt: 'Partner 3', h: 'h-24', boxed: true },
    { src: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/zDib26LXd7.png', alt: 'Partner 4', h: 'h-14' },
    { src: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/nW9CCvp1eD.png', alt: 'Partner 5', h: 'h-12' }
  ], []);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const sectionIds = ['hero','servicios','destinos','pasos','testimonios']
    const getHeaderH = () => (document.querySelector('header')?.offsetHeight || 90)

    let ticking = false

    const calcActive = () => {
      const headerH = getHeaderH()
      const viewportTop = headerH + 4 // debajo del header fijo
      const viewportBottom = window.innerHeight

      let current = sectionIds[0]
      let maxVisible = 0

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Visibilidad dentro del viewport (considerando header)
        const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)
        if (visible > maxVisible && visible > 60) { // umbral mínimo 60px para evitar parpadeos
          maxVisible = visible
          current = id
        }
      }

      setActiveSection(prev => prev !== current ? current : prev)
      ticking = false
    }

    const requestCalc = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(calcActive)
      }
    }

    window.addEventListener('scroll', requestCalc, { passive: true })
    window.addEventListener('resize', requestCalc)
    calcActive()

    return () => {
      window.removeEventListener('scroll', requestCalc)
      window.removeEventListener('resize', requestCalc)
    }
  }, [])

  const handleNavClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const header = document.querySelector('header')
      const dynamicOffset = (header?.offsetHeight || 90) + 10
      const y = el.getBoundingClientRect().top + window.pageYOffset - dynamicOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    closeMobileMenu()
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
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
                      <Link to="/profile" onClick={closeMobileMenu} className="block text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-2 px-3 rounded-lg font-medium">Mi Perfil {/* Perfil usuario */}</Link>
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
                  Los mejores destinos alrededor del mundo
                </p>
                
                <h1 className="font-volkhov font-bold text-6xl lg:text-7xl leading-tight text-slate-800">
                  Viaja, disfruta<br />
                  y vive una nueva<br />
                  vida plena
                </h1>
                
                <p className="text-slate-600 text-xl leading-relaxed max-w-lg">
                  Construye aventuras más largas, admira y disfruta de la vanidad en sí misma. Preferido por deportistas, compromete la escucha atenta. La puerta del parque vende lo que es difícil para el oeste.
                </p>
                
                <div className="flex items-center space-x-6">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105">
                    Descubre más
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

      {/* Services Section */}
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
            <p className="text-slate-600 font-semibold text-lg uppercase tracking-wide mb-4">CATEGORÍA</p>
            <h2 className="font-volkhov font-bold text-5xl text-slate-800">Ofrecemos los mejores servicios</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Calculated Weather */}
            <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-orange-300 transition-colors duration-300">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/hrNeNkRtjE.svg" 
                  alt="Weather" 
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Clima Calculado</h3>
              <p className="text-slate-600 leading-relaxed">
                Construido con la sabiduría del tiempo para admirar la vanidad del lugar mismo.
              </p>
            </article>
            
            {/* Best Flights */}
            <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300 relative">
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-600 rounded-3xl opacity-20"></div>
              <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 hover:bg-orange-300 transition-colors duration-300">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/sBDd5fx857.svg" 
                  alt="Flights" 
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Mejores Vuelos</h3>
              <p className="text-slate-600 leading-relaxed">
                Escucha comprometida. La puerta del parque vende lo que es difícil para el oeste.
              </p>
            </article>
            
            {/* Local Events */}
            <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-orange-300 transition-colors duration-300">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/MjuB60hMP3.png" 
                  alt="Events" 
                  className="w-8 h-8 rounded"
                />
              </div>
              <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Eventos Locales</h3>
              <p className="text-slate-600 leading-relaxed">
                La vanidad de Barton en sí misma lo hace. Preferido por los hombres, compromete la escucha.
              </p>
            </article>
            
            {/* Customization */}
            <article className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 hover:border-blue-300">
              <div className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-orange-300 transition-colors duration-300">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/Krv9qgwbZR.svg" 
                  alt="Customization" 
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-open-sans font-semibold text-xl text-slate-800 mb-4">Personalización</h3>
              <p className="text-slate-600 leading-relaxed">
                Entregamos servicios de aviación externalizados para clientes militares
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Top Destinations Section */}
      <section id="destinos" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-text-gray font-semibold text-lg uppercase tracking-wide mb-4">Más vendidos</p>
            <h2 className="font-volkhov font-bold text-5xl text-secondary">Principales destinos</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Rome, Italy */}
            <article className="destination-card">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/gDmJzZ4BVi.png" 
                alt="Rome, Italy" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-text-gray">Roma, Italia</h3>
                  <span className="font-medium text-lg text-text-gray">$5,42k</span>
                </div>
                <div className="flex items-center text-text-gray">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Viaje de 10 días</span>
                </div>
              </div>
            </article>
            
            {/* London, UK */}
            <article className="destination-card">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/nfi38uiyfN.png" 
                alt="London, UK" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-text-gray">Londres, Reino Unido</h3>
                  <span className="font-medium text-lg text-text-gray">$4.2k</span>
                </div>
                <div className="flex items-center text-text-gray">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Viaje de 12 días</span>
                </div>
              </div>
            </article>
            
            {/* Full Europe */}
            <article className="destination-card">
              <img 
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/R7t6L1BN8O.png" 
                alt="Full Europe" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-text-gray">Toda Europa</h3>
                  <span className="font-medium text-lg text-text-gray">$15k</span>
                </div>
                <div className="flex items-center text-text-gray">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Viaje de 28 días</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Book a Trip Section */}
      <section id="pasos" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <p className="text-text-gray font-semibold text-lg uppercase tracking-wide">Fácil y rápido</p>
              
              <h2 className="font-volkhov font-bold text-5xl text-secondary leading-tight">
                Reserva tu próximo viaje<br />
                en 3 sencillos pasos
              </h2>
              
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-08-12/59762e88-5ab8-476a-8d48-da9abf144e16.svg" 
                      alt="Choose Destination" 
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-gray mb-2">Elige tu destino</h3>
                    <p className="text-text-gray leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur<br />
                      adipiscing elit. Urna, tortor tempus.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/yjtyauH9mv.svg" 
                      alt="Make Payment" 
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-gray mb-2">Realiza el pago</h3>
                    <p className="text-text-gray leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur<br />
                      adipiscing elit. Urna, tortor tempus.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/MX5DN5NPuf.svg" 
                      alt="Reach Airport" 
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-gray mb-2">Llega al aeropuerto en la fecha seleccionada</h3>
                    <p className="text-text-gray leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur<br />
                      adipiscing elit. Urna, tortor tempus.
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
                  alt="Trip to Greece" 
                  className="w-full h-48 object-cover rounded-3xl mb-6"
                />
                
                <h3 className="font-medium text-lg text-secondary mb-4">Viaje a Grecia</h3>
                
                <div className="flex items-center text-text-gray text-sm mb-4">
                  <span>14-29 Junio</span>
                  <span className="mx-2">|</span>
                  <span>por Robbin joseph</span>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-08-12/5836e571-7c9d-47e3-a3fa-c4461a45b3e9.svg" 
                      alt="Leaf" 
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-08-12/d1dc5a3e-89ad-4bc0-a8c3-7d05c93db257.svg" 
                      alt="Map" 
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-08-12/4b28057b-a305-4ad6-986e-b5325fbeded9.svg" 
                      alt="Send" 
                      className="w-4 h-4"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-08-12/5836e571-7c9d-47e3-a3fa-c4461a45b3e9.svg" 
                      alt="Building" 
                      className="w-5 h-5"
                    />
                    <span className="text-text-gray text-sm">24 personas van</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img 
                      src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/cynvAkg4Hr.svg" 
                      alt="Heart" 
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              
              {/* Ongoing Trip Card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-custom w-80">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/7K2Xap5m0S.png" 
                    alt="Rome" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-text-gray text-sm">En curso</p>
                    <h4 className="font-medium text-secondary">Viaje a Roma</h4>
                    <p className="text-text-gray text-sm">40% completado</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple h-2 rounded-full w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <p className="text-text-gray font-semibold text-lg uppercase tracking-wide">Testimonios</p>
              
              <h2 className="font-volkhov font-bold text-5xl text-secondary leading-tight">
                Lo que la gente dice<br />
                sobre nosotros.
              </h2>
              
              <div className="flex space-x-4">
                <div className="w-4 h-4 bg-secondary rounded-full"></div>
                <div className="w-4 h-4 bg-light-gray rounded-full"></div>
                <div className="w-4 h-4 bg-light-gray rounded-full"></div>
              </div>
            </div>
            
            {/* Right Content - Testimonials */}
            <div className="relative">
              {/* Main Testimonial */}
              <div className="bg-white rounded-xl p-8 shadow-custom relative z-10">
                <img 
                  src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png" 
                  alt="Mike Taylor" 
                  className="w-16 h-16 rounded-full object-cover mb-6"
                />
                
                <p className="text-text-gray leading-relaxed mb-6">
                  "En las ventanas hablando del paisaje pintado, sin embargo, sus fiestas expresas lo usan. Seguro que al final sobre él, lo mismo que sabía después. De creído o desviado no."
                </p>
                
                <div>
                  <h4 className="font-semibold text-lg text-text-gray">Mike Taylor</h4>
                  <p className="text-text-gray">Lahore, Pakistán</p>
                </div>
              </div>
              
              {/* Background Testimonial */}
              <div className="absolute top-8 right-8 bg-white rounded-xl p-8 shadow-custom w-full max-w-md">
                <p className="text-text-gray leading-relaxed mb-6">
                  "En las ventanas hablando del paisaje pintado, sin embargo, sus fiestas expresas lo usan. Seguro que al final sobre él, lo mismo que sabía después. De creído o desviado no."
                </p>
                
                <div>
                  <h4 className="font-semibold text-lg text-text-gray">Chris Thomas</h4>
                  <p className="text-text-gray">CEO de Red Button</p>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4">
                <button className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section id="socios" className="py-16 px-4 sm:px-6 lg:px-8 relative scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <h3 className="sr-only">Socios y marcas colaboradoras</h3>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="flex w-max items-center gap-24 animate-logo-marquee opacity-90 hover:opacity-100 transition-opacity py-4 will-change-transform">
              {([...logos, ...logos]).map((logo, idx) => (
                <div key={idx} className={`flex items-center justify-center ${logo.boxed ? 'bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-slate-100' : ''}`}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.h} w-auto grayscale hover:grayscale-0 transition-all duration-500 ease-linear drop-shadow`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" className="relative bg-white text-slate-600 pt-28 pb-14 px-4 sm:px-8 overflow-hidden border-t border-slate-200/70">
        {/* Decorative subtle gradients */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] rounded-full bg-orange-100 blur-[140px] opacity-70" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
        {/* Wave divider retains white root bg so removed fill white */}
        <div className="absolute -top-[70px] left-0 w-full" aria-hidden="true">
          <svg className="w-full h-[70px]" viewBox="0 0 1440 70" preserveAspectRatio="none" fill="none"><path d="M0 35L60 31C120 27 240 19 360 23C480 27 600 43 720 47C840 51 960 43 1080 31C1200 19 1320 3 1380 -5L1440 -13V70H1380C1320 70 1200 70 1080 70C960 70 840 70 720 70C600 70 480 70 360 70C240 70 120 70 60 70H0V35Z" fill="url(#gradFooter)" /><defs><linearGradient id="gradFooter" x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" /><stop offset="1" stopColor="#ffffff" /></linearGradient></defs></svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Brand + Contact */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <img src="/viadca2.png" alt="Logo Viadca" className="h-14 w-auto drop-shadow-sm" />
              </div>
              <p className="leading-relaxed text-sm">Reserva tu viaje en minutos y mantén control total de tus experiencias. Inspiramos a viajeros a explorar sin límites.</p>
              <div className="space-y-2 text-sm font-medium">
                <p className="flex gap-2"><span className="text-blue-600 font-semibold">Dirección:</span><span className="flex-1">Av. 20 de Noviembre 123, Zona Centro, Durango, Dgo., México</span></p>
                <p className="flex gap-2"><span className="text-blue-600 font-semibold">Tel:</span> +52 (618) 123 4567</p>
                <p className="flex gap-2"><span className="text-blue-600 font-semibold">Correo:</span> contacto@viadca.com</p>
                <p className="flex gap-2"><span className="text-blue-600 font-semibold">Horario:</span> Lun - Vie 09:00 - 18:00 (GMT-6)</p>
              </div>
            </div>
            {/* Links */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-900 uppercase mb-4">Empresa</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="hover:text-blue-700 transition-colors">Acerca de</a></li>
                  <li><a href="#careers" className="hover:text-blue-700 transition-colors">Carreras</a></li>
                  <li><a href="#blog" className="hover:text-blue-700 transition-colors">Blog</a></li>
                  <li><a href="#press" className="hover:text-blue-700 transition-colors">Prensa</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-900 uppercase mb-4">Recursos</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#destinos" className="hover:text-blue-700 transition-colors">Destinos</a></li>
                  <li><a href="#ofertas" className="hover:text-blue-700 transition-colors">Ofertas</a></li>
                  <li><a href="#guias" className="hover:text-blue-700 transition-colors">Guías</a></li>
                  <li><a href="#app" className="hover:text-blue-700 transition-colors">Aplicación móvil</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-900 uppercase mb-4">Soporte</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#faq" className="hover:text-blue-700 transition-colors">Ayuda / FAQ</a></li>
                  <li><a href="#contacto" className="hover:text-blue-700 transition-colors">Contacto</a></li>
                  <li><a href="#afiliados" className="hover:text-blue-700 transition-colors">Afiliados</a></li>
                  <li><a href="#estado" className="hover:text-blue-700 transition-colors">Estado del servicio</a></li>
                </ul>
              </div>
            </div>
            {/* Map */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-semibold tracking-wider text-slate-900 uppercase">Ubicación</h3>
              <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200 shadow after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent)]">
                <div className="aspect-[4/3] w-full">
                  <iframe
                    title="Mapa Durango"
                    src="https://www.google.com/maps?q=Durango+Mexico&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">Ubicación referencial en el centro de Durango. Contáctanos para agendar una visita o reunión presencial.</p>
            </div>
          </div>
          {/* Divider */}
          <div className="mt-14 mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          {/* Newsletter */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-slate-900">Mantente al día</h4>
              <p className="text-sm text-slate-500 max-w-md">Suscríbete y recibe novedades, alertas de tarifas, inspiración para tu próximo viaje y consejos exclusivos.</p>
            </div>
            <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input type="email" required placeholder="Tu correo electrónico" className="w-full bg-white/60 backdrop-blur-sm border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl py-4 px-5 text-sm placeholder:text-slate-400 text-slate-700 outline-none transition" />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/50" />
              </div>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow hover:shadow-blue-500/30 hover:brightness-110 transition">
                Suscribirme
              </button>
            </form>
          </div>
          {/* Bottom bar */}
          <div className="mt-16 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-xs text-slate-500">
            <p className="order-2 md:order-1">© {currentYear} Viadca. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-4 order-1 md:order-2">
              <a href="#privacidad" className="hover:text-slate-800 transition">Privacidad</a>
              <span className="opacity-30">|</span>
              <a href="#terminos" className="hover:text-slate-800 transition">Términos</a>
              <span className="opacity-30">|</span>
              <a href="#cookies" className="hover:text-slate-800 transition">Cookies</a>
              <span className="opacity-30">|</span>
              <a href="#mapa" className="hover:text-slate-800 transition">Mapa del sitio</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home;
