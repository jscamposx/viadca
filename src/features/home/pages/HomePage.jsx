import React, { useState, useEffect, useMemo } from 'react'
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

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
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
    <PageTransition>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Hero
          isScrolled={isScrolled}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          displayName={displayName}
          displayEmail={displayEmail}
          userInitial={userInitial}
          activeSection={activeSection}
          handleNavClick={handleNavClick}
          logos={logos}
          handlers={{
            setIsMobileMenuOpen,
            isMobileMenuOpen,
            setIsUserMenuOpen,
            isUserMenuOpen,
            closeMobileMenu,
            closeUserMenu,
            handleLogout,
          }}
        />

        <Services />
        <Destinations />
        <Steps />
        <Testimonials />
        <Logos logos={logos} />

        <Footer contactInfo={contactInfo} contactLoading={contactLoading} currentYear={currentYear} />
      </div>
    </PageTransition>
  )
}

export default Home
