import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useContactInfo } from '../../../hooks/useContactInfo'
import PageTransition from '../../../components/ui/PageTransition'

import Hero from '../components/Hero'
import Services from '../components/Services'
import Destinations from '../components/Destinations'
import Steps from '../components/Steps'
import Testimonials from '../components/Testimonials'
import Logos from '../components/Logos'
import Footer from '../components/Footer'

// Estilos CSS-in-JS para animaciones móviles
const mobileStyles = `
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  // Medición del header para offset del contenido
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(90)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { contactInfo, loading: contactLoading } = useContactInfo()
  const [activeSection, setActiveSection] = useState('hero')

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

  // Inyectar estilos para animaciones
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = mobileStyles
    document.head.appendChild(styleElement)
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  // Scroll: solo alterna el estado con rAF (sin medir layout para evitar reflows)
  useEffect(() => {
    let last = window.scrollY > 50
    setIsScrolled(last)
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const sc = window.scrollY > 50
        if (sc !== last) {
          last = sc
          setIsScrolled(sc)
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Medir altura estable del nav con ResizeObserver (cambia por padding/breakpoints)
  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const measure = () => setHeaderHeight(el.offsetHeight || 90)
    measure()

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => measure())
      ro.observe(el)
      return () => ro.disconnect()
    } else {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
  }, [])

  // Actualiza altura cuando cambian estados que sí afectan el alto del nav (no el menú móvil desplegado)
  useEffect(() => {
    setHeaderHeight(navRef.current?.offsetHeight || 90)
  }, [isUserMenuOpen, isScrolled])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const closeUserMenu = () => setIsUserMenuOpen(false)

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
  ], [])
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const sectionIds = ['hero','servicios','destinos','pasos','testimonios']
    const getHeaderH = () => headerHeight

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
        if (rect.bottom < viewportTop || rect.top > viewportBottom) continue
        const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)
        if (visible > maxVisible && visible > 30) {
          maxVisible = visible
          current = id
        }
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (!el) continue
        const topAbs = el.getBoundingClientRect().top
        if (topAbs <= getHeaderH() + 10) {
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
  }, [headerHeight])

  const handleNavClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const dynamicOffset = (headerHeight || 90) + 10
      const y = el.getBoundingClientRect().top + window.pageYOffset - dynamicOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    closeMobileMenu()
  }

  return (
    <>
      {/* Navbar global fija */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transform-gpu transition-colors duration-500 ease-in-out px-3 sm:px-6 lg:px-8 ${
          isScrolled
            ? 'bg-white/95 shadow-md border-b border-blue-200/60 lg:backdrop-blur-lg'
            : 'bg-white/80 lg:bg-gradient-to-br lg:from-blue-50/90 lg:to-orange-50/90'
        }`}
        style={{ willChange: 'transform, opacity', contain: 'layout paint' }}
      >
        <nav
          ref={navRef}
          className={`flex items-center justify-between max-w-7xl mx-auto transition-[padding] duration-300 ${
            isScrolled ? 'py-2.5' : 'py-4 sm:py-6'
          }`}
        >
          <div className="flex items-center w-full">
            {/* Logo - Optimizado para mobile */}
            <div className="flex items-center shrink-0">
              <img 
                src="/viadcalogo.webp" 
                alt="VIADCA by Zafiro Tours" 
                className={`w-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm ${
                  isScrolled ? 'h-10 sm:h-12' : 'h-11 sm:h-12'
                }`}
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
            {/* Botón móvil - Mejorado */}
            <div className="lg:hidden ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50' 
                    : 'text-slate-700 hover:text-blue-600 hover:bg-white/20'
                }`}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-3' : ''
                  }`}></span>
                  <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-3' : ''
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu - Mejorado con animaciones */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`backdrop-blur-md border-t transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/98 border-blue-100/50' 
              : 'bg-gradient-to-br from-blue-50/98 to-orange-50/98 border-white/30'
          }`}>
            <div className="px-4 py-6 space-y-2">
              {/* Enlaces de navegación mejorados para mobile */}
              <div className="space-y-1">
                {[
                  { 
                    id: 'hero', 
                    label: 'Inicio', 
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  },
                  { 
                    id: 'servicios', 
                    label: 'Servicios', 
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" /></svg>
                  },
                  { 
                    id: 'destinos', 
                    label: 'Destinos', 
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  },
                  { 
                    id: 'pasos', 
                    label: 'Cómo Reservar', 
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  },
                  { 
                    id: 'testimonios', 
                    label: 'Testimonios', 
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  }
                ].map((link, index) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`flex items-center gap-3 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02] ${
                      activeSection === link.id
                        ? 'text-blue-600 bg-blue-50 shadow-md border border-blue-200'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 hover:shadow-sm'
                    }`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? 'slideInFromLeft 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                    {activeSection === link.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                  </a>
                ))}
              </div>

              {/* Sección de usuario mejorada */}
              <div className={`pt-6 space-y-3 border-t ${
                isScrolled ? 'border-blue-100/50' : 'border-white/30'
              }`}>
                {isAuthenticated() ? (
                  // Usuario autenticado en móvil - Rediseñado
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold text-lg truncate">{displayName}</p>
                          <p className="text-slate-600 text-sm truncate">{displayEmail || 'Sin email'}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {isAdmin() && (
                        <Link 
                          to="/admin" 
                          onClick={closeMobileMenu} 
                          className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        onClick={closeMobileMenu} 
                        className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mi Perfil</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          closeMobileMenu()
                        }}
                        className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                ) : (
                  // Usuario no autenticado en móvil - Rediseñado
                  <div className="space-y-3">
                    <Link 
                      to="/login" 
                      onClick={closeMobileMenu} 
                      className="flex items-center justify-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium border border-slate-200 hover:border-blue-300 transform hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Iniciar sesión</span>
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMobileMenu} 
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Registrarse</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <PageTransition>
        <div className="min-h-screen bg-white overflow-x-hidden" style={{ paddingTop: headerHeight }}>
          {/* Contenido principal */}
          <Hero />

          <Services />
          <Destinations />
          <Steps />
          <Testimonials />
          <Logos logos={logos} />

          <Footer contactInfo={contactInfo} contactLoading={contactLoading} currentYear={currentYear} />
        </div>
      </PageTransition>
    </>
  )
}

export default Home
