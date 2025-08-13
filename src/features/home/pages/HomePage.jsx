import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useContactInfo } from '../../../hooks/useContactInfo'

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { contactInfo, loading: contactLoading } = useContactInfo()
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
      const viewportTop = headerH + 4
      const viewportBottom = window.innerHeight

      let current = sectionIds[0]
      let maxVisible = 0

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.bottom < viewportTop || rect.top > viewportBottom) continue // totalmente fuera
        const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)
        // console.log(id, visible, rect.top, rect.bottom)
        if (visible > maxVisible && visible > 30) { // umbral reducido a 30px
          maxVisible = visible
          current = id
        }
      }

      // Fallback adicional: si hemos pasado el top de una sección claramente, úsala
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (!el) continue
        const topAbs = el.getBoundingClientRect().top
        if (topAbs <= getHeaderH() + 10) { // su inicio ya pasó debajo del header
          current = sectionIds[i]
          break
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

      {/* Top Destinations Section */}
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

      {/* Book a Trip Section */}
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

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <p className="text-text-gray font-semibold text-lg uppercase tracking-wide">Testimonios</p>
              
              <h2 className="font-volkhov font-bold text-5xl text-secondary leading-tight">
                Lo que dicen nuestros<br />
                viajeros satisfechos
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
                  alt="María González" 
                  className="w-16 h-16 rounded-full object-cover mb-6"
                />
                
                <p className="text-text-gray leading-relaxed mb-6">
                  "VIADCA hizo que nuestro viaje a Europa fuera perfecto. La atención personalizada y el seguimiento durante todo el viaje nos dieron total tranquilidad. Definitivamente volveremos a viajar con ellos."
                </p>
                
                <div>
                  <h4 className="font-semibold text-lg text-text-gray">María González</h4>
                  <p className="text-text-gray">Durango, México</p>
                </div>
              </div>
              
              {/* Background Testimonial */}
              <div className="absolute top-8 right-8 bg-white rounded-xl p-8 shadow-custom w-full max-w-md">
                <p className="text-text-gray leading-relaxed mb-6">
                  "Excelente servicio desde la cotización hasta el regreso. Los asesores de VIADCA conocen muy bien los destinos y nos dieron las mejores recomendaciones. Altamente recomendados."
                </p>
                
                <div>
                  <h4 className="font-semibold text-lg text-text-gray">Carlos Herrera</h4>
                  <p className="text-text-gray">Cliente frecuente</p>
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
      <footer role="contentinfo" className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20 text-slate-700 pt-20 pb-8 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -left-32 w-64 h-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full bg-purple-200/20 blur-2xl" />
          
          {/* Geometric patterns */}
          <div className="absolute top-10 left-10 opacity-10">
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-10 right-10 opacity-10">
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2 h-2 border border-orange-400 rotate-45" />
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute -top-[1px] left-0 w-full" aria-hidden="true">
          <svg className="w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
            <path d="M0 32L60 29.3C120 26.7 240 21.3 360 24C480 26.7 600 37.3 720 40C840 42.7 960 37.3 1080 29.3C1200 21.3 1320 10.7 1380 5.3L1440 0V64H1380C1320 64 1200 64 1080 64C960 64 840 64 720 64C600 64 480 64 360 64C240 64 120 64 60 64H0V32Z" 
                  fill="url(#footerGradient)" />
            <defs>
              <linearGradient id="footerGradient" x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="0.5" stopColor="#eff6ff" />
                <stop offset="1" stopColor="#fef7ed" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/viadca2.png" alt="Logo Viadca" className="h-16 w-auto drop-shadow-sm hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">VIADCA by Zafiro Tours</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  Tu agencia de viajes de confianza en Durango. Más de 15 años creando experiencias inolvidables y conectando sueños con destinos únicos alrededor del mundo.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Destinos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">5K+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Años</div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Síguenos</h4>
                <div className="flex items-center gap-3">
                  {contactInfo.facebook && contactInfo.facebook !== "https://www.facebook.com/" && (
                    <a 
                      href={contactInfo.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-blue-100"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  
                  {contactInfo.instagram && contactInfo.instagram !== "https://www.instagram.com/" && (
                    <a 
                      href={contactInfo.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-purple-100"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  
                  {contactInfo.tiktok && contactInfo.tiktok !== "https://www.tiktok.com/" && (
                    <a 
                      href={contactInfo.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-black rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                      aria-label="TikTok"
                    >
                      <svg className="w-5 h-5 text-black group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>
                  )}
                  
                  {contactInfo.youtube && contactInfo.youtube !== "https://www.youtube.com/" && (
                    <a 
                      href={contactInfo.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-white hover:bg-red-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-red-100"
                      aria-label="YouTube"
                    >
                      <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                  Contacto
                </h4>
                
                {contactLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactInfo.direccion && (
                      <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Dirección</div>
                          <div className="text-sm text-slate-700 font-medium">{contactInfo.direccion}</div>
                        </div>
                      </div>
                      )}
                      
                      {contactInfo.telefono && (
                        <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                          <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Teléfono</div>
                            <a href={`tel:${contactInfo.telefono}`} className="text-sm text-slate-700 font-medium hover:text-blue-600 transition-colors">
                              {contactInfo.telefono}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {contactInfo.whatsapp && (
                        <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                          <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">WhatsApp</div>
                            <a 
                              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-slate-700 font-medium hover:text-emerald-600 transition-colors"
                            >
                              {contactInfo.whatsapp}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {contactInfo.email && (
                        <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                          <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email</div>
                            <a href={`mailto:${contactInfo.email}`} className="text-sm text-slate-700 font-medium hover:text-purple-600 transition-colors">
                              {contactInfo.email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {contactInfo.horario && (
                        <div className="group flex items-start gap-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-300">
                          <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Horario</div>
                            <div className="text-sm text-slate-700 font-medium">{contactInfo.horario}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Map Section */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                    Ubicación
                  </h4>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                      <div className="aspect-[4/3] w-full">
                        <iframe
                          title="Mapa de ubicación"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.direccion || 'Durango, Mexico')}&output=embed`}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {contactInfo.direccion ? 
                        `📍 Nos encontramos en ${contactInfo.direccion}. ¡Te esperamos para planificar tu próxima aventura!` : 
                        '📍 Contáctanos para conocer nuestra ubicación exacta y agendar una visita.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-16 pt-8 border-t border-white/60">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <p className="text-sm text-slate-600">
                    © {currentYear} <span className="font-semibold text-slate-800">VIADCA by Zafiro Tours</span>. Todos los derechos reservados.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>Hecho con</span>
                    <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>en México</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <a href="#privacidad" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:underline">
                    Privacidad
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="#terminos" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:underline">
                    Términos
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="#cookies" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 hover:underline">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  export default Home;
