import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useContactInfo } from "../../../hooks/useContactInfo";
import PageTransition from "../../../components/ui/PageTransition";
import { FiGrid } from "react-icons/fi";
import {
  computePosition,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
} from "@floating-ui/dom";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Destinations from "../components/Destinations";
import Steps from "../components/Steps";
import Testimonials from "../components/Testimonials";
import Logos from "../components/Logos";
import Footer from "../components/Footer";
import { useSEO } from "../../../hooks/useSEO";
import {
  generateHomepageOG,
  generateHomepageTwitter,
  generateHomepageJsonLd,
} from "../../../utils/seoUtils";
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx"; // añadido

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
`;

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const isOnMyPackagesPage = location.pathname === "/mis-paquetes";
  // Medición del header para offset del contenido
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(90);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { contactInfo, loading: contactLoading } = useContactInfo();
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const userBtnRef = useRef(null);
  const dropdownRef = useRef(null);

  const displayName = useMemo(() => {
    if (!user) return "Usuario";
    const candidate =
      user.nombre ||
      user.name ||
      user.usuario ||
      user.username ||
      (user.primerNombre && user.apellido
        ? `${user.primerNombre} ${user.apellido}`
        : null) ||
      (user.primerNombre && user.primerApellido
        ? `${user.primerNombre} ${user.primerApellido}`
        : null) ||
      user.nombreCompleto ||
      (user.email ? user.email.split("@")[0] : null) ||
      (user.correo ? user.correo.split("@")[0] : null);
    return (candidate || "Usuario").toString().trim();
  }, [user]);

  const displayEmail = user?.email || user?.correo || user?.mail || null;
  const userInitial = useMemo(
    () => displayName.charAt(0).toUpperCase(),
    [displayName],
  );

  // Inyectar estilos para animaciones
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = mobileStyles;
    document.head.appendChild(styleElement);
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Scroll: solo alterna el estado con rAF (sin medir layout para evitar reflows)
  useEffect(() => {
    let last = window.scrollY > 50;
    setIsScrolled(last);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sc = window.scrollY > 50;
        if (sc !== last) {
          last = sc;
          setIsScrolled(sc);
        }
        // Calcular progreso de scroll (0-100)
        const doc = document.documentElement;
        const scrollTop =
          window.scrollY || doc.scrollTop || document.body.scrollTop || 0;
        const max = doc.scrollHeight - window.innerHeight;
        const pct =
          max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
        setScrollProgress(pct);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Medir altura estable del nav con ResizeObserver (cambia por padding/breakpoints)
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const measure = () => setHeaderHeight(el.offsetHeight || 90);
    measure();

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, []);

  // Actualiza altura cuando cambian estados que sí afectan el alto del nav (no el menú móvil desplegado)
  useEffect(() => {
    setHeaderHeight(navRef.current?.offsetHeight || 90);
  }, [isScrolled]);

  // Reposicionar el menú con Floating UI (Popper-like)
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const reference = userBtnRef.current;
    const floating = dropdownRef.current;
    if (!reference || !floating) return;

    // ocultar hasta tener la primera posición calculada
    floating.style.opacity = "0";
    let shown = false;

    const cleanupAuto = autoUpdate(reference, floating, async () => {
      await computePosition(reference, floating, {
        placement: "bottom-end",
        middleware: [
          offset(8),
          flip({ fallbackAxisSideDirection: "end" }),
          shift({ padding: 8 }),
          size({
            apply({ availableWidth, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                maxWidth: `${Math.min(availableWidth, 400)}px`,
                maxHeight: `${Math.min(availableHeight - 16, 600)}px`,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        if (!shown) {
          floating.style.opacity = "1";
          shown = true;
        }
      });
    });

    return () => cleanupAuto();
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeUserMenu();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const logos = useMemo(
    () => [
      {
        src: "/HomePage/logo1.avif",
        alt: "Partner 1",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo2.avif",
        alt: "Partner 2",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo3.avif",
        alt: "Partner 3",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo7.avif",
        alt: "Partner 4",
        h: "h-14", // 56px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo6.avif",
        alt: "Partner 5",
        h: "h-12", // 48px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo8.avif",
        alt: "Partner 1",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo9.avif",
        alt: "Partner 1",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
      {
        src: "/HomePage/logo10.avif",
        alt: "Partner 1",
        h: "h-24", // 96px
        width: 240,
        height: 96,
      },
    ],
    [],
  );
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const sectionIds = [
      "hero",
      "destinos",
      "pasos",
      "testimonios",
      "servicios",
    ];

    let ticking = false;
    let io = null;
    let onScroll = null;

    const setActiveSafe = (id) =>
      setActiveSection((prev) => (prev !== id ? id : prev));

    const setupIO = () => {
      if (typeof window === "undefined" || !("IntersectionObserver" in window))
        return false;
      if (window.innerWidth >= 1024) return false;

      const topOffset = Math.ceil((headerHeight || 90) + 12);
      const rootMargin = `-${topOffset}px 0px -55% 0px`;
      const thresholds = [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1];

      const visible = new Map();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            visible.set(
              e.target.id,
              e.isIntersecting ? e.intersectionRatio : 0,
            );
          }
          let bestId = sectionIds[0];
          let bestRatio = -1;
          for (const id of sectionIds) {
            const r = visible.get(id) ?? 0;
            if (r > bestRatio + 0.001) {
              bestRatio = r;
              bestId = id;
            }
          }
          setActiveSafe(bestId);
        },
        { root: null, rootMargin, threshold: thresholds },
      );

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
      return true;
    };

    const setupScrollProbe = () => {
      const calcActive = () => {
        const headerH = headerHeight || 90;
        const probeY = headerH + Math.round(window.innerHeight * 0.45);
        let current = sectionIds[0];

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom >= probeY) {
            current = id;
            break;
          }
          if (rect.top - probeY > 0) break;
        }

        setActiveSafe(current);
        ticking = false;
      };

      onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(calcActive);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      window.addEventListener("orientationchange", onScroll);
      // Primera ejecución
      onScroll();
    };

    const usingIO = setupIO();
    if (!usingIO) setupScrollProbe();

    return () => {
      if (io) io.disconnect();
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("orientationchange", onScroll);
      }
    };
  }, [headerHeight]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const dynamicOffset = (headerHeight || 90) + 10;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - dynamicOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    closeMobileMenu();
  };

  useSEO({
    title: "Agencia de Viajes en Durango - Tours y Paquetes | Viadca",
    description:
      "Agencia de viajes en Durango con los mejores tours nacionales e internacionales. Paquetes todo incluido, cruceros, circuitos. ¡Cotiza sin compromiso! ☎️ 618-XXX-XXXX",
    keywords: [
      "agencia de viajes en Durango",
      "agencia de viajes Durango",
      "viajes Durango",
      "tours desde Durango",
      "paquetes vacacionales Durango",
      "agencia viajes Durango Dgo",
      "viajes económicos Durango",
      "tours nacionales Durango",
      "viajes internacionales Durango",
      "Viadca Durango",
      "agencia de viajes en Durango Mexico",
      "mejores agencias de viajes Durango",
      "paquetes todo incluido Durango",
      "cruceros desde Durango",
      "circuitos Europa Durango",
    ],
    canonical: "https://www.viadca.app/",
    og: generateHomepageOG(),
    twitter: generateHomepageTwitter(),
    jsonLd: generateHomepageJsonLd(),
  });

  return (
    <>
      {/* Enlace accesible para saltar al contenido principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[10001] px-4 py-2 rounded-md bg-blue-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Saltar al contenido principal
      </a>

      {/* Barra de progreso de scroll superior */}
      <div
        className="fixed top-0 left-0 right-0 h-0.5 z-[10000]"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navbar global fija */}
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-[9999] transform-gpu transition-colors duration-500 ease-in-out px-3 sm:px-6 lg:px-8 ${
          isScrolled
            ? "bg-white/95 shadow-md border-b border-blue-200/60 lg:backdrop-blur-lg"
            : "bg-white/80 lg:bg-gradient-to-br lg:from-blue-50/90 lg:to-orange-50/90"
        }`}
        style={{
          willChange: "transform, opacity",
          "--header-h": `${headerHeight}px`,
        }}
      >
        <nav
          ref={navRef}
          className={`flex items-center justify-between max-w-7xl mx-auto transition-[padding] duration-300 ${
            isScrolled ? "py-2.5" : "py-4 sm:py-6"
          }`}
          aria-label="Navegación principal"
        >
          <div className="flex items-center w-full">
            {/* Logo - Optimizado para mobile */}
            <div className="flex items-center shrink-0">
              {/* Logo optimizado */}
              <OptimizedImage
                src="/viadcalogo.avif"
                alt="VIADCA by Zafiro Tours"
                width={230}
                height={115}
                sizes="(max-width:640px) 140px, (max-width:1024px) 180px, 230px"
                priority={true}
                placeholder={false}
                lazy={false}
                fadeIn={false}
                className={`w-auto select-none pointer-events-none sm:pointer-events-auto ${
                  isScrolled ? "h-10 sm:h-12" : "h-11 sm:h-12"
                } sm:transition-transform sm:duration-300 sm:hover:scale-105 sm:drop-shadow-sm`}
              />
            </div>
            {/* Links centro */}
            <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1 min-w-0 px-4">
              {[
                { id: "hero", label: "Inicio" },
                { id: "destinos", label: "Destinos" },
                { id: "pasos", label: "Cómo Reservar" },
                { id: "testimonios", label: "Testimonios" },
                { id: "servicios", label: "Servicios" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative transition-all duration-300 font-medium hover:scale-105 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-300 ${
                    activeSection === link.id
                      ? "text-blue-600 after:w-full after:bg-blue-600"
                      : "text-slate-700 hover:text-blue-600 after:w-0 after:bg-blue-600 hover:after:w-full"
                  }`}
                  aria-current={activeSection === link.id ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {/* Usuario derecha */}
            <div className="hidden lg:flex items-center gap-6 pl-4 shrink-0">
              {isAuthenticated() ? (
                <div className="relative user-menu-container">
                  {/* Botón usuario */}
                  <button
                    ref={userBtnRef}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`group flex items-center gap-2.5 rounded-full px-2.5 py-2 transition-all duration-300 border border-transparent hover:border-blue-200/70 hover:bg-white/70 hover:shadow-sm ${
                      isUserMenuOpen
                        ? "ring-2 ring-blue-600/30 bg-white/80 shadow-md"
                        : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600`}
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                    aria-controls="user-menu"
                    aria-label={
                      isUserMenuOpen
                        ? "Cerrar menú de usuario"
                        : "Abrir menú de usuario"
                    }
                    type="button"
                    title="Menú de usuario"
                  >
                    <span
                      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full shadow-sm"
                      aria-hidden="true"
                    >
                      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-500 opacity-90" />
                      <span className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-blue-700">
                        {userInitial}
                      </span>
                    </span>
                    <span className="text-slate-800 font-medium max-w-[12rem] truncate">
                      {displayName}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                        isUserMenuOpen
                          ? "rotate-180"
                          : "group-hover:translate-y-0.5"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div
                      ref={dropdownRef}
                      className="fixed w-72 sm:w-80 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl ring-1 ring-slate-900/5 will-change-transform will-change-opacity transition-opacity duration-150 ease-out z-[10000]"
                      id="user-menu"
                      role="menu"
                      aria-label="Menú de usuario"
                      style={{ opacity: 0 }}
                    >
                      <div
                        className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"
                        aria-hidden="true"
                      />
                      <div className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="relative inline-flex items-center justify-center w-11 h-11 rounded-full shadow-sm"
                            aria-hidden="true"
                          >
                            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-500 opacity-90" />
                            <span className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-base font-bold text-blue-700">
                              {userInitial}
                            </span>
                          </span>
                          <div className="min-w-0">
                            <p className="text-slate-900 font-semibold leading-tight truncate">
                              {displayName}
                            </p>
                            <p className="text-slate-600 text-sm truncate">
                              {displayEmail || "Sin email"}
                            </p>
                          </div>
                          {isAdmin() && (
                            <span
                              className="ml-auto text-[11px] px-2 py-1 rounded-full bg-blue-600 text-white/95 tracking-wide font-semibold"
                              aria-label="Rol administrador"
                            >
                              ADMIN
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="px-2">
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            onClick={closeUserMenu}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 transition-all"
                            role="menuitem"
                          >
                            <svg
                              className="w-5 h-5 text-blue-600 group-hover:rotate-6 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                            </svg>
                            <span>Dashboard</span>
                          </Link>
                        )}
                        <Link
                          to="/mis-paquetes"
                          onClick={closeUserMenu}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/60 transition-all"
                          role="menuitem"
                        >
                          <svg
                            className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <span className="font-medium">Mis Paquetes</span>
                        </Link>
                        {isOnMyPackagesPage && (
                          <Link
                            to="/"
                            onClick={closeUserMenu}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-green-700 hover:bg-green-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/60 transition-all"
                            role="menuitem"
                          >
                            <svg
                              className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            <span className="font-medium">Volver a Inicio</span>
                          </Link>
                        )}
                        <Link
                          to="/perfil"
                          state={{
                            from: `${window.location.pathname}${window.location.search}${window.location.hash}`,
                          }}
                          onClick={closeUserMenu}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 transition-all"
                          role="menuitem"
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="font-medium">Mi Perfil</span>
                        </Link>
                      </div>
                      <div className="px-2">
                        <hr className="border-blue-100/70" />
                      </div>
                      <div className="px-2 pb-2">
                        <button
                          onClick={handleLogout}
                          className="group w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/60 transition-all"
                          role="menuitem"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/iniciar-sesion"
                    className="relative text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="group hidden lg:inline-flex relative items-center justify-center px-6 py-3 rounded-xl font-medium text-slate-700 border border-blue-600/70 bg-white transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 overflow-hidden shadow-[0_2px_6px_-1px_rgba(37,99,235,0.15)] hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.45)]"
                  >
                    <span className="relative z-10">Registrarse</span>
                  </Link>
                  <Link
                    to="/registro"
                    className="lg:hidden text-slate-700 px-6 py-3 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
            {/* Botón móvil - Mejorado */}
            <div className="lg:hidden ml-auto">
              <button
                id="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-300 ${
                  isScrolled
                    ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    : "text-slate-700 hover:text-blue-600 hover:bg-white/20"
                } ${isMobileMenuOpen ? "bg-white/90 text-slate-900 shadow-sm" : ""}`}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                type="button"
              >
                <div className="relative w-7 h-7" aria-hidden="true">
                  <span
                    className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-transform duration-300 ease-out origin-center ${
                      isMobileMenuOpen
                        ? "-translate-x-1/2 -translate-y-0 rotate-45"
                        : "-translate-x-1/2 -translate-y-[8px]"
                    }`}
                    style={{ willChange: "transform" }}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-all duration-300 ease-out origin-center ${
                      isMobileMenuOpen
                        ? "-translate-x-1/2 -translate-y-0 opacity-0 scale-x-0"
                        : "-translate-x-1/2 -translate-y-0 opacity-100 scale-x-100"
                    }`}
                    style={{ willChange: "transform, opacity" }}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-transform duration-300 ease-out origin-center ${
                      isMobileMenuOpen
                        ? "-translate-x-1/2 -translate-y-0 -rotate-45"
                        : "-translate-x-1/2 translate-y-[8px]"
                    }`}
                    style={{ willChange: "transform" }}
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu - Mejorado con animaciones */}
        <div
          id="mobile-menu"
          role="region"
          aria-labelledby="mobile-menu-button"
          inert={!isMobileMenuOpen}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`backdrop-blur-md border-t bg-white/98 border-blue-100/50 transition-all duration-300`}
          >
            <div className="px-4 py-6 space-y-2">
              {/* Enlaces de navegación mejorados para mobile */}
              <div className="space-y-1">
                {[
                  {
                    id: "hero",
                    label: "Inicio",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "destinos",
                    label: "Destinos",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "pasos",
                    label: "Cómo Reservar",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "testimonios",
                    label: "Testimonios",
                    icon: (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "servicios",
                    label: "Servicios",
                    icon: <FiGrid className="w-5 h-5" aria-hidden="true" />,
                  },
                ].map((link, index) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`flex items-center gap-3 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02] ${
                      activeSection === link.id
                        ? "text-blue-600 bg-blue-50 shadow-md border border-blue-200"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 hover:shadow-sm"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen
                        ? "slideInFromLeft 0.3s ease-out forwards"
                        : "none",
                    }}
                    aria-current={
                      activeSection === link.id ? "true" : undefined
                    }
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                  >
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                    {activeSection === link.id && (
                      <div
                        className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                        aria-hidden="true"
                      ></div>
                    )}
                  </a>
                ))}
              </div>

              {/* Sección de usuario mejorada */}
              <div
                className={`pt-6 space-y-3 border-t ${
                  isScrolled ? "border-blue-100/50" : "border-white/30"
                }`}
              >
                {isAuthenticated() ? (
                  <div>
                    <div
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm"
                      aria-label="Información rápida de usuario"
                      role="group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                          aria-hidden="true"
                        >
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold text-lg truncate">
                            {displayName}
                          </p>
                          <p className="text-slate-600 text-sm truncate">
                            {displayEmail || "Sin email"}
                          </p>
                        </div>
                        <div
                          className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                          aria-hidden="true"
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <Link
                        to="/mis-paquetes"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span className="font-medium">Mis Paquetes</span>
                      </Link>
                      {isOnMyPackagesPage && (
                        <Link
                          to="/"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <span className="font-medium">Volver a Inicio</span>
                        </Link>
                      )}
                      <Link
                        to="/perfil"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">Mi Perfil</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium transform hover:scale-[1.02]"
                        type="button"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Usuario no autenticado en móvil - Rediseñado
                  <div className="space-y-3">
                    <Link
                      to="/iniciar-sesion"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 py-3 px-4 rounded-xl font-medium border border-slate-200 hover:border-blue-300 transform hover:scale-[1.02]"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Iniciar sesión</span>
                    </Link>
                    <Link
                      to="/registro"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-[1.02]"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
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
        <main
          id="main-content"
          role="main"
          aria-label="Contenido principal"
          className="min-h-screen bg-white overflow-x-hidden"
          style={{ paddingTop: headerHeight }}
        >
          {/* Contenido principal */}
          <Hero />

          {/* Reordenado según solicitud: Destinos, Pasos, Testimonios, Servicios, Logos, Footer */}
          <Destinations />
          <Steps />

          <Testimonials />
          <Services />
          <Logos logos={logos} />

          <Footer
            contactInfo={contactInfo}
            contactLoading={contactLoading}
            currentYear={currentYear}
          />
        </main>
      </PageTransition>
    </>
  );
};

export default Home;
