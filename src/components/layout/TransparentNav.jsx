import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import OptimizedImage from "../ui/OptimizedImage";

/*
 * Navbar reutilizable y transparente pensada para colocar sobre heros con video/imagen.
 * Props:
 *  - solidOnScroll: px de scroll tras los cuales se vuelve sólida
 *  - overlay: si true aplica un degradado inferior sutil
 */
const TransparentNav = ({ solidOnScroll = 80, overlay = true }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const userBtnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > solidOnScroll);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solidOnScroll]);

  useEffect(() => {
    setMenuOpen(false);
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
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-colors duration-500 ${scrolled ? "backdrop-blur-md bg-white/85 shadow-md border-b border-white/40" : "bg-transparent"} ${overlay && !scrolled ? "" : ""}`}
    >
      {overlay && !scrolled && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"
          aria-hidden="true"
        />
      )}
      <nav
        className={`relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 ${scrolled ? "py-2.5" : "py-4"}`}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <OptimizedImage
            src="/viadcalogo.avif"
            alt="VIADCA logo"
            width={160}
            height={64}
            className={`h-10 w-auto transition-all ${scrolled ? "drop-shadow-sm" : "brightness-110 drop-shadow-lg"}`}
            lazy={false}
            placeholder={false}
          />
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link
            to="/"
            className="text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:w-0 hover:after:w-full after:transition-all"
          >
            Inicio
          </Link>
          <Link
            to="/paquetes"
            className="text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:w-0 hover:after:w-full after:transition-all"
          >
            Paquetes
          </Link>
          <Link
            to="/preguntas-frecuentes"
            className="text-white/90 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white after:w-0 hover:after:w-full after:transition-all"
          >
            Ayuda
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated() ? (
            <div className="relative">
              <button
                ref={userBtnRef}
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur px-3 py-1.5 rounded-full text-white text-sm font-medium transition border border-white/30"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </span>
                <span className="max-w-[120px] truncate text-white/90">
                  {displayName}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
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
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2 text-slate-700 backdrop-blur-lg">
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/perfil"
                    state={{
                      from: `${location.pathname}${location.search}${location.hash}`,
                    }}
                    className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-sm"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/iniciar-sesion"
                className="text-white/90 hover:text-white text-sm font-medium"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow hover:shadow-lg transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden relative w-11 h-11 inline-flex items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 backdrop-blur border border-white/20 transition"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`absolute h-0.5 w-6 bg-current rounded transition-transform ${menuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"}`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-current rounded transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-current rounded transition-transform ${menuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"}`}
          ></span>
        </button>
      </nav>
      {/* Mobile panel */}
      <div
        className={`md:hidden transition-[max-height] duration-400 overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-900/60 backdrop-blur ${menuOpen ? "max-h-96 border-t border-white/10" : "max-h-0"}`}
      >
        <div className="px-4 py-4 space-y-2 text-white">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Inicio
          </Link>
          <Link
            to="/paquetes"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Paquetes
          </Link>
          <Link
            to="/preguntas-frecuentes"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Ayuda
          </Link>
          <div className="pt-2 border-t border-white/10" />
          {isAuthenticated() ? (
            <>
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/perfil"
                state={{
                  from: `${location.pathname}${location.search}${location.hash}`,
                }}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
              >
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-600/20 text-sm text-red-300"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/iniciar-sesion"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-center rounded-xl font-medium shadow hover:from-blue-500 hover:to-indigo-500"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TransparentNav;
