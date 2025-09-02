import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import OptimizedImage from "../ui/OptimizedImage";

/*
 * Navbar unificada (para /paquetes y futuras páginas) con el mismo look & feel de la homepage.
 * Características:
 *  - Estilo consistente (altura, logo, avatar, menú usuario) con HomePage
 *  - Cambia de padding / fondo al hacer scroll (>50px)
 *  - Responsive (desktop / mobile)
 *  - Menú móvil animado (simplificado respecto al de HomePage pero coherente)
 *  - Links estándar (Inicio, Paquetes, Ayuda)
 */
const UnifiedNav = ({
  transparentOnTop = false,
  showScrollProgress = false,
  sectionLinks = [],
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const userBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const headerRef = useRef(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const hasSectionNav =
    sectionLinks &&
    sectionLinks.length > 0 &&
    location.pathname.startsWith("/paquetes");
  const [headerHeight, setHeaderHeight] = useState(0);

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

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const displayName = useMemo(() => {
    if (!user) return "Usuario";
    return (
      user.nombre ||
      user.name ||
      user.usuario ||
      user.username ||
      (user.email && user.email.split("@")[0]) ||
      "Usuario"
    );
  }, [user]);
  const displayEmail = user?.email || user?.correo || null;
  const userInitial = displayName.charAt(0).toUpperCase();

  // Cerrar menú usuario clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (
        userMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !userBtnRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/paquetes", label: "Paquetes" },
    { to: "/preguntas-frecuentes", label: "Ayuda" },
  ];

  const headerBgClass = isScrolled
    ? "bg-white/95 shadow-md border-b border-blue-200/60 lg:backdrop-blur-lg"
    : transparentOnTop
      ? "bg-transparent"
      : "bg-white/80 lg:bg-gradient-to-br lg:from-blue-50/90 lg:to-orange-50/90";

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight || 0);
    }
  }, [isScrolled, hasSectionNav, sectionLinks.length]);

  // Scroll spy para secciones
  useEffect(() => {
    if (!hasSectionNav) return;
    const ids = sectionLinks.map((s) => s.id);
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - (headerHeight + 16) <= 0) {
          current = id;
        } else {
          break;
        }
      }
      setActiveSectionId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasSectionNav, sectionLinks, headerHeight]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y =
      window.scrollY + el.getBoundingClientRect().top - (headerHeight + 12);
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: "smooth" });
  };

  return (
    <>
      {showScrollProgress && (
        <div
          className="fixed top-0 left-0 right-0 h-0.5 z-[10000]"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[9999] px-3 sm:px-6 lg:px-8 transition-colors duration-500 ${headerBgClass}`}
      >
        {transparentOnTop && !isScrolled && (
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-transparent"
            aria-hidden="true"
          />
        )}
        <nav
          className={`max-w-7xl mx-auto flex items-center justify-between transition-[padding] duration-300 ${isScrolled ? "py-2.5" : "py-4 sm:py-6"}`}
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 focus:outline-none"
          >
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
              className={`w-auto select-none ${isScrolled ? "h-10 sm:h-12" : "h-11 sm:h-12"} sm:transition-transform sm:duration-300 sm:hover:scale-105`}
            />
          </Link>

          {/* Links desktop */}
          {/* Reemplazo enlaces para colorear según modo */}
          <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1 min-w-0 px-4">
            {hasSectionNav
              ? sectionLinks.map((l) => {
                  const active = activeSectionId === l.id;
                  const baseInactive =
                    transparentOnTop && !isScrolled
                      ? "text-white/90 hover:text-white after:bg-white"
                      : "text-slate-700 hover:text-blue-600 after:bg-blue-600";
                  const baseActive =
                    transparentOnTop && !isScrolled
                      ? "text-white after:bg-white"
                      : "text-blue-600 after:bg-blue-600";
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => scrollToSection(l.id)}
                      className={`relative transition-all duration-300 font-medium hover:scale-105 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-300 ${active ? `${baseActive} after:w-full` : `${baseInactive} after:w-0 hover:after:w-full`}`}
                    >
                      {l.label}
                    </button>
                  );
                })
              : navLinks.map((l) => {
                  const active = location.pathname === l.to;
                  const baseInactive =
                    transparentOnTop && !isScrolled
                      ? "text-white/90 hover:text-white after:bg-white"
                      : "text-slate-700 hover:text-blue-600 after:bg-blue-600";
                  const baseActive =
                    transparentOnTop && !isScrolled
                      ? "text-white after:bg-white"
                      : "text-blue-600 after:bg-blue-600";
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={`relative transition-all duration-300 font-medium hover:scale-105 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:transition-all after:duration-300 ${active ? `${baseActive} after:w-full` : `${baseInactive} after:w-0 hover:after:w-full`}`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
          </div>

          {/* User area desktop */}
          <div className="hidden lg:flex items-center gap-6 pl-4 shrink-0">
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  ref={userBtnRef}
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className={`group flex items-center gap-2.5 rounded-full px-2.5 py-2 transition-all duration-300 border ${transparentOnTop && !isScrolled ? "border-white/40 hover:border-white/60 hover:bg-white/15 backdrop-blur text-white" : "border-transparent hover:border-blue-200/70 hover:bg-white/70 hover:shadow-sm text-slate-800"} ${userMenuOpen ? (transparentOnTop && !isScrolled ? "ring-2 ring-white/40 bg-white/20" : "ring-2 ring-blue-600/30 bg-white/80 shadow-md") : ""}`}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  type="button"
                >
                  <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full">
                    <span
                      className={`absolute inset-0 rounded-full ${transparentOnTop && !isScrolled ? "bg-white/25" : "bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-500 opacity-90"}`}
                    />
                    <span
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${transparentOnTop && !isScrolled ? "bg-white/90 text-blue-700" : "bg-white text-blue-700"}`}
                    >
                      {userInitial}
                    </span>
                  </span>
                  <span
                    className={`font-medium max-w-[10rem] truncate ${transparentOnTop && !isScrolled ? "text-white" : "text-slate-800"}`}
                  >
                    {displayName}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : "group-hover:translate-y-0.5"} ${transparentOnTop && !isScrolled ? "text-white/70" : "text-slate-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl ring-1 ring-slate-900/5 z-[10000]"
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="relative inline-flex items-center justify-center w-11 h-11 rounded-full">
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
                          <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-blue-600 text-white/95 font-semibold">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-2 space-y-1">
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 transition"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/perfil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 transition"
                      >
                        Mi Perfil
                      </Link>
                    </div>
                    <div className="px-2">
                      <hr className="border-blue-100/70" />
                    </div>
                    <div className="px-2 pb-2">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/iniciar-sesion"
                  className={`relative font-medium after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:transition-all ${transparentOnTop && !isScrolled ? "text-white/90 hover:text-white after:bg-white hover:after:w-full" : "text-slate-700 hover:text-blue-600 after:bg-blue-600 hover:after:w-full"}`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className={`group hidden lg:inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium border transition-all shadow-sm ${transparentOnTop && !isScrolled ? "text-white border-white/40 bg-white/10 hover:bg-white/20 hover:border-white/60" : "text-slate-700 border-blue-600/70 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600"}`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón móvil */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              className={`relative h-10 w-10 flex items-center justify-center rounded-lg transition-colors ${transparentOnTop && !isScrolled ? "text-white hover:text-white hover:bg-white/20 bg-white/10 border border-white/30 backdrop-blur" : isScrolled ? "text-slate-700 hover:text-blue-600 hover:bg-blue-50" : "text-slate-700 hover:text-blue-600 hover:bg-white/30"} ${mobileOpen ? "bg-white/90 shadow-sm text-slate-700" : ""}`}
            >
              <div className="relative w-7 h-7">
                <span
                  className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-transform ${mobileOpen ? "-translate-x-1/2 -translate-y-0 rotate-45" : "-translate-x-1/2 -translate-y-[8px]"}`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-all ${mobileOpen ? "opacity-0 scale-x-0 -translate-x-1/2" : "opacity-100 scale-x-100 -translate-x-1/2 -translate-y-0"}`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 w-6 h-1 bg-current rounded-full transition-transform ${mobileOpen ? "-translate-x-1/2 -translate-y-0 -rotate-45" : "-translate-x-1/2 translate-y-[8px]"}`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Panel móvil */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div
            className={`${transparentOnTop && !isScrolled ? "backdrop-blur-md border-t bg-slate-900/85 border-white/10" : "backdrop-blur-md border-t bg-white/98 border-blue-100/50"}`}
          >
            <div className="px-4 py-6 space-y-5">
              <div className="space-y-2">
                {hasSectionNav
                  ? sectionLinks.map((link) => {
                      const active = activeSectionId === link.id;
                      const variantClasses =
                        transparentOnTop && !isScrolled
                          ? active
                            ? "text-white bg-white/15 border border-white/30"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : active
                            ? "text-blue-600 bg-blue-50 shadow border border-blue-200"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/70";
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            scrollToSection(link.id);
                            setMobileOpen(false);
                          }}
                          className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition ${variantClasses}`}
                        >
                          {link.label}
                        </button>
                      );
                    })
                  : navLinks.map((link) => {
                      const active = location.pathname === link.to;
                      const variantClasses =
                        transparentOnTop && !isScrolled
                          ? active
                            ? "text-white bg-white/15 border border-white/30"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : active
                            ? "text-blue-600 bg-blue-50 shadow border border-blue-200"
                            : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/70";
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition ${variantClasses}`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
              </div>
              <div
                className={`pt-4 ${transparentOnTop && !isScrolled ? "border-t border-white/10" : "border-t border-blue-100/50"}`}
              >
                {isAuthenticated() ? (
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border ${transparentOnTop && !isScrolled ? "bg-white/10 border-white/25 text-white" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${transparentOnTop && !isScrolled ? "bg-white/20 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"}`}
                      >
                        {userInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-semibold truncate ${transparentOnTop && !isScrolled ? "text-white" : "text-slate-800"}`}
                        >
                          {displayName}
                        </p>
                        <p
                          className={`text-sm truncate ${transparentOnTop && !isScrolled ? "text-white/80" : "text-slate-600"}`}
                        >
                          {displayEmail || "Sin email"}
                        </p>
                      </div>
                      {isAdmin() && (
                        <span
                          className={`text-[11px] px-2 py-1 rounded-full font-semibold ${transparentOnTop && !isScrolled ? "bg-white/25 text-white" : "bg-blue-600 text-white/95"}`}
                        >
                          ADMIN
                        </span>
                      )}
                    </div>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium ${transparentOnTop && !isScrolled ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/70"}`}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/perfil"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium ${transparentOnTop && !isScrolled ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-blue-600 hover:bg-blue-50/70"}`}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl font-medium ${transparentOnTop && !isScrolled ? "text-red-300 hover:text-red-200 hover:bg-red-500/20" : "text-red-600 hover:text-red-700 hover:bg-red-50"}`}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/iniciar-sesion"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium border ${transparentOnTop && !isScrolled ? "border-white/30 text-white/90 hover:text-white hover:bg-white/15" : "border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/60"}`}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/registro"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-semibold shadow ${transparentOnTop && !isScrolled ? "bg-gradient-to-r from-white/25 to-white/10 text-white hover:from-white/35 hover:to-white/20" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"}`}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default UnifiedNav;
