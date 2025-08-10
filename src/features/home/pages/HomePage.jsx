import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiChevronRight,
  FiLock,
  FiGlobe,
  FiStar,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiMail,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiShield,
  FiHeart,
  FiClock,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { useAuth } from "../../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { paquetes, loading } = useAllPackages();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const authed = isAuthenticated?.() || false;
  const admin = isAdmin?.() || false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredPackages = paquetes.filter(p => p.activo).slice(0, 6);

  // Mensaje que puede venir desde login/registro
  const feedbackMsg = location.state?.message;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar moderna */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiGlobe className="text-xl sm:text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Viadca Viajes
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Tu próxima aventura</p>
              </div>
            </div>

            {/* Menu desktop */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#destinos" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Destinos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#paquetes" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Paquetes
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#experiencias" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Experiencias
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all group-hover:w-full"></span>
              </a>
            </nav>

            {/* Botón login / Perfil y menu móvil */}
            <div className="relative flex items-center space-x-4">
              {!authed ? (
                <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:-translate-y-0.5">
                  <FiLock className="w-4 h-4" />
                  Iniciar sesión
                </Link>
              ) : (
                <div className="hidden sm:flex items-center">
                  <button
                    onClick={() => setIsProfileOpen(v => !v)}
                    className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                      {(user?.nombre_completo || user?.usuario || 'U').slice(0,1).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]">
                        {user?.nombre_completo || user?.usuario}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {user?.rol}
                      </div>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="font-semibold text-gray-800 truncate">
                          {user?.nombre_completo || user?.usuario}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{user?.correo}</div>
                        <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          <FiShield className="w-3 h-3" /> {user?.rol}
                        </div>
                      </div>
                      <div className="p-2">
                        {admin && (
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                            <FiLock className="w-4 h-4" /> Ir al Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { setIsProfileOpen(false); logout(); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Menu móvil toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menu móvil */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 py-4">
              <div className="flex flex-col space-y-2">
                <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2">
                  Inicio
                </a>
                <a href="#destinos" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2">
                  Destinos
                </a>
                <a href="#paquetes" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2">
                  Paquetes
                </a>
                <a href="#experiencias" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2">
                  Experiencias
                </a>
                <a href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors font-medium px-4 py-2">
                  Contacto
                </a>
                {!authed ? (
                  <Link to="/login" className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all">
                    <FiLock className="w-4 h-4" />
                    Iniciar sesión
                  </Link>
                ) : (
                  <div className="mx-4 mt-2 border-t border-gray-100 pt-3">
                    {admin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors mb-2">
                        <FiLock className="w-4 h-4" /> Ir al Dashboard
                      </Link>
                    )}
                    <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-all">
                      <FiLogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwSDB2NjBoNjBWMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6IiBpbGw9Im5vbmUiIHN0cm9rZT0iI2YxZjFmMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full opacity-20 animate-pulse delay-150"></div>

        {/* Mensaje de feedback (post-login/registro) */}
        {feedbackMsg && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
            <div className="px-4 py-2 bg-white/90 backdrop-blur border border-green-200 text-green-700 rounded-full shadow">
              {feedbackMsg}
            </div>
          </div>
        )}

        <div className="relative z-10 text-center px-4 py-20 max-w-6xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 mb-8 shadow-lg">
            <FiStar className="mr-2 text-blue-600" />
            <span className="text-blue-600 font-semibold text-sm">
              ✨ Descubre destinos únicos en México
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
            Tu próxima 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              aventura épica
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-600 mt-4">
              comienza aquí
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explora los destinos más espectaculares de México con paquetes personalizados 
            y experiencias que crearán recuerdos para toda la vida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href="#destinos"
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <FiMapPin className="mr-2" />
                Explorar destinos
                <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>

            {/* Se oculta el acceso admin en la UI pública */}
            {/* Antes había un Link a "/admin" aquí, se eliminó para cumplir el requerimiento */}
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FiMapPin, number: "50+", label: "Destinos" },
              { icon: FiUsers, number: "10K+", label: "Viajeros" },
              { icon: FiAward, number: "100%", label: "Satisfacción" },
              { icon: FiShield, number: "24/7", label: "Soporte" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Descubre más</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos expertos en crear experiencias de viaje memorables con un servicio personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiSearch className="text-3xl text-blue-600" />,
                title: "Búsqueda inteligente",
                desc: "Encuentra tu destino ideal con nuestra búsqueda avanzada y recomendaciones personalizadas",
                bg: "from-blue-50 to-blue-100",
              },
              {
                icon: <FiMapPin className="text-3xl text-indigo-600" />,
                title: "Destinos únicos",
                desc: "Accede a lugares exclusivos y experiencias auténticas que no encontrarás en otros lados",
                bg: "from-indigo-50 to-indigo-100",
              },
              {
                icon: <FiCalendar className="text-3xl text-purple-600" />,
                title: "Reservas flexibles",
                desc: "Programa tu viaje con total flexibilidad y modificaciones sin penalizaciones",
                bg: "from-purple-50 to-purple-100",
              },
              {
                icon: <FiShield className="text-3xl text-green-600" />,
                title: "Viaja seguro",
                desc: "Soporte 24/7 y seguro de viaje incluido para que disfrutes sin preocupaciones",
                bg: "from-green-50 to-green-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de destinos destacados */}
      <section id="destinos" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium mb-6">
              <FiMapPin className="mr-2" />
              Destinos populares
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Descubre México como nunca antes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde playas paradisíacas hasta ciudades coloniales, cada destino te espera con experiencias únicas
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((paquete, index) => (
                <div
                  key={paquete.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="relative h-64 overflow-hidden">
                    {paquete.primera_imagen ? (
                      <OptimizedImage
                        src={paquete.primera_imagen}
                        alt={paquete.titulo}
                        width={400}
                        height={256}
                        quality="auto"
                        format="webp"
                        crop="fill"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        lazy={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col items-center justify-center text-gray-500">
                        <FiMapPin className="w-16 h-16 mb-4" />
                        <span className="font-medium">Destino increíble</span>
                      </div>
                    )}
                    
                    {/* Badge de precio */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-2 rounded-xl shadow-lg">
                        {parseFloat(paquete.precio_total).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                          minimumFractionDigits: 0,
                        })}
                      </div>
                    </div>

                    {/* Badge de duración */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-600/90 backdrop-blur-sm text-white font-medium px-3 py-2 rounded-xl shadow-lg flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {paquete.duracion_dias} días
                      </div>
                    </div>

                    {/* Overlay con botón */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        className="bg-white text-gray-900 font-medium px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {paquete.titulo}
                    </h3>
                    
                    {paquete.destinos && paquete.destinos.length > 0 && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <FiMapPin className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm">
                          {paquete.destinos.map(d => d.destino).slice(0, 2).join(" • ")}
                          {paquete.destinos.length > 2 && ` +${paquete.destinos.length - 2} más`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="text-gray-600 text-sm ml-2">4.9</span>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="#paquetes"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
            >
              Ver todos los destinos
              <FiChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Sección de paquetes completos */}
      <section id="paquetes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Todos los paquetes</h2>
              <p className="text-gray-600 mt-2">Explora más opciones para tu siguiente viaje</p>
            </div>
            <a href="#contacto" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:from-blue-700 hover:to-indigo-700 transition-all">
              <FiMail className="w-4 h-4" /> Solicitar asesoría
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paquetes.filter(p => p.activo).slice(0, 9).map((paquete) => (
                <div key={paquete.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
                  <div className="relative h-56">
                    {paquete.primera_imagen ? (
                      <OptimizedImage
                        src={paquete.primera_imagen}
                        alt={paquete.titulo}
                        width={400}
                        height={224}
                        quality="auto"
                        format="webp"
                        crop="fill"
                        className="w-full h-full object-cover"
                        lazy={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center text-gray-500">
                        <FiMapPin className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 text-sm bg-white/90 px-3 py-1 rounded-full shadow font-semibold">
                      {parseFloat(paquete.precio_total).toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{paquete.titulo}</h3>
                    {paquete.destinos && paquete.destinos.length > 0 && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                        <FiMapPin className="inline w-4 h-4 mr-1 text-blue-500" />
                        {paquete.destinos.map(d => d.destino).join(" • ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link to={`/paquetes/${paquete.url}`} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                        Ver más <FiChevronRight className="w-4 h-4" />
                      </Link>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FiClock className="w-4 h-4" /> {paquete.duracion_dias} días
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Números que hablan por nosotros
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de viajeros han confiado en nosotros para crear sus mejores recuerdos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Destinos",
                value: "120+",
                color: "from-blue-600 to-indigo-600",
                icon: FiMapPin,
              },
              {
                title: "Viajeros felices",
                value: "15K+",
                color: "from-indigo-600 to-purple-600",
                icon: FiUsers,
              },
              {
                title: "Años de experiencia",
                value: "10+",
                color: "from-purple-600 to-pink-600",
                icon: FiAward,
              },
              {
                title: "Satisfacción",
                value: "99%",
                color: "from-green-600 to-emerald-600",
                icon: FiTrendingUp,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-4xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de experiencias (testimonios) */}
      <section id="experiencias" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium mb-6">
              Experiencias reales
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Lo que dicen nuestros viajeros
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Historias inspiradoras de quienes ya vivieron la experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "María Gómez",
                role: "Durango, MX",
                text: "El viaje estuvo perfectamente organizado. Cada detalle fue cuidado y el servicio fue excepcional.",
                rating: 5,
              },
              {
                name: "Carlos Hernández",
                role: "CDMX, MX",
                text: "Recomendadísimo. Me ayudaron a personalizar mi itinerario y todo salió increíble.",
                rating: 5,
              },
              {
                name: "Ana López",
                role: "Monterrey, MX",
                text: "La mejor agencia con la que he viajado. Sin duda volveré a reservar con ellos.",
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">“{t.text}”</p>
                <div className="flex items-center text-yellow-500">
                  {[...Array(t.rating)].map((_, k) => (
                    <FiStar key={k} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition">
              <FiPhone className="w-4 h-4" /> Hablemos de tu viaje
            </a>
          </div>
        </div>
      </section>

      {/* Footer moderno */}
      <footer id="contacto" className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter section */}
          <div className="border-b border-gray-700 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para tu próxima aventura?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Suscríbete para recibir ofertas exclusivas y destinos únicos directamente en tu email
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Tu email aquí..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all"
                />
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>

          {/* Main footer content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <FiGlobe className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Viadca Viajes
                    </h2>
                    <p className="text-gray-400 text-sm">Tu próxima aventura</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                  Somos especialistas en crear experiencias de viaje únicas y memorables. 
                  Con más de 10 años de experiencia, hemos ayudado a miles de viajeros a 
                  descubrir los destinos más increíbles de México.
                </p>
                
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <FiFacebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                    <FiInstagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                    <FiTwitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <FiMail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Enlaces rápidos</h3>
                <ul className="space-y-3">
                  <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
                  <li><a href="#destinos" className="text-gray-300 hover:text-white transition-colors">Destinos</a></li>
                  <li><a href="#paquetes" className="text-gray-300 hover:text-white transition-colors">Paquetes</a></li>
                  <li><a href="#experiencias" className="text-gray-300 hover:text-white transition-colors">Experiencias</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Ofertas especiales</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog de viajes</a></li>
                </ul>
              </div>

              {/* Contact info */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Contacto</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <FiPhone className="w-5 h-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">+52 (618) 123-4567</span>
                  </li>
                  <li className="flex items-center">
                    <FiMail className="w-5 h-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">info@viadcaviajes.com</span>
                  </li>
                  <li className="flex items-start">
                    <FiMapPin className="w-5 h-5 mr-3 text-blue-400 mt-1" />
                    <span className="text-gray-300">
                      Av. 20 de Noviembre #123<br />
                      Centro, Durango, México
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FiClock className="w-5 h-5 mr-3 text-blue-400" />
                    <span className="text-gray-300">Lun - Vie: 9:00 - 18:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-gray-700 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2025 Viadca Viajes. Todos los derechos reservados.
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Términos y condiciones
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de privacidad
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de cookies
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Aviso legal
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40"
        >
          <FiChevronRight className="w-6 h-6 rotate-[-90deg]" />
        </button>
      </footer>
    </div>
  );
};

export default Home;
