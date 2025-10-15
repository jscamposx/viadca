import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePackage } from "../hooks/usePackage";
import {
  ImageCarousel,
  Itinerary,
  PackageInfo,
  Requirements,
  RouteMap,
  HotelInfo,
} from "../components";
import { RecommendedPackages } from "../components";
import WeatherForecast from "../components/WeatherForecast";
import PackageSkeleton from "../components/PackageSkeleton";
import { useContactActions } from "../../../hooks/useContactActions";
import { useContactInfo } from "../../../hooks/useContactInfo";
import PageTransition from "../../../components/ui/PageTransition";
import LightboxModal from "../../../components/ui/LightboxModal";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import Footer from "../../home/components/Footer";
import TrustBar from "../../../components/ui/TrustBar";
import ExpandableContent from "../../../components/ui/ExpandableContent.jsx";
import {
  FiMapPin,
  FiCalendar,
  FiSun,
  FiCheckSquare,
  FiHeart,
  FiShare2,
  FiHome,
  FiStar,
  FiX,
  FiInfo,
  FiDollarSign,
  FiArrowLeft,
  FiPhone,
  FiClock,
  FiUsers,
  FiShield,
  FiAward,
  FiAlertCircle,
} from "react-icons/fi";
import { FaHandPointer, FaWhatsapp } from "react-icons/fa";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import { useSEO } from "../../../hooks/useSEO";
import {
  generateSEOTitle,
  generateSEODescription,
  generatePackageKeywords,
  generatePackageJsonLd,
  generatePackageOG,
  generatePackageTwitter,
  generateOGExtras,
} from "../../../utils/seoUtils";

// LoadingSpinner removido: el skeleton es el \"único\" loading visual

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-red-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-white/20 relative z-10">
        <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Ups! Algo salió mal
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed text-base">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-white/20 relative z-10">
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Paquete no encontrado
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed text-base">
          Lo sentimos, no pudimos encontrar el paquete que buscas. Puede que
          haya sido movido o ya no esté disponible.
        </p>

        <button
          onClick={() => window.history.back()}
          className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Explorar otros paquetes
        </button>
      </div>
    </div>
  );
}

function InactivePackageMessage() {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-50 p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-white/30 relative z-10">
        <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiInfo
            className="h-10 w-10 text-amber-600 relative z-10"
            aria-hidden="true"
          />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Paquete no disponible públicamente
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed text-base">
          Este paquete fue desactivado por el administrador y no está visible en
          la vista pública.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          aria-label="Volver al inicio"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default", icon: Icon }) {
  const variants = {
    default: "bg-gray-100/80 text-gray-700 border-gray-200/50",
    success: "bg-emerald-100/80 text-emerald-700 border-emerald-200/50",
    warning: "bg-amber-100/80 text-amber-700 border-amber-200/50",
    info: "bg-blue-100/80 text-blue-700 border-blue-200/50",
    gradient:
      // Fondo blanco para máxima legibilidad sobre el hero
      "bg-white/90 text-slate-800 border-gray-200/60 shadow-md",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-md ${variants[variant]}`}
    >
      {Icon && (
        <Icon aria-hidden="true" className="w-4 h-4 mr-2 flex-shrink-0" />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

function PackageViewPage() {
  const { url } = useParams();
  const { paquete, loading, error } = usePackage(url);
  const [isLiked, setIsLiked] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // Estados legacy eliminados en favor de ExpandableContent
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [adultWarningAccepted, setAdultWarningAccepted] = useState(false);
  const { openWhatsApp, getPhoneHref, onPhoneClick, ToastPortal, showToast } =
    useContactActions();
  const { contactInfo, loading: contactLoading } = useContactInfo();

  // Preparar config SEO SIEMPRE antes de returns condicionales
  let seoConfig;
  if (paquete) {
    seoConfig = {
      title: generateSEOTitle(paquete),
      description: generateSEODescription(paquete),
      keywords: generatePackageKeywords(paquete),
      canonical: `https://www.viadca.app/paquetes/${url}`,
      siteName: "Viadca Viajes",
      robots: "index,follow",
      googlebot:
        "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
      themeColor: "#2563eb",
      locale: "es_MX",
      addHreflangEsMx: true,
      og: generatePackageOG(paquete, url),
      ogExtra: generateOGExtras(paquete, url),
      twitter: generatePackageTwitter(paquete),
      jsonLd: generatePackageJsonLd(paquete, url),
    };
  } else if (loading) {
    seoConfig = { title: "Cargando paquete | Viadca Viajes", noindex: true };
  } else if (error) {
    seoConfig = {
      title: "Error al cargar paquete | Viadca Viajes",
      noindex: true,
    };
  } else {
    seoConfig = {
      title: "Paquete no encontrado | Viadca Viajes",
      noindex: true,
    };
  }
  useSEO(seoConfig);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar pantallas pequeñas para ajustar parallax y otros detalles de UX
  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mostrar advertencia de contenido adulto
  useEffect(() => {
    if (paquete && paquete.aptoParaMenores === false && !adultWarningAccepted) {
      console.log("🔞 Mostrando modal de advertencia - aptoParaMenores:", paquete.aptoParaMenores);
      setShowAdultWarning(true);
      // Scroll to top cuando se muestra el modal
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
    } else {
      console.log("✅ No mostrar modal - aptoParaMenores:", paquete?.aptoParaMenores, "accepted:", adultWarningAccepted);
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [paquete, adultWarningAccepted]);

  const isMobile = () => {
    if (navigator.userAgentData?.mobile) {
      return true;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  const handleShare = async () => {
    if (!paquete) return;

    const shareData = {
      title: paquete.titulo,
      text: `¡Echa un vistazo a este increíble paquete de viaje: ${paquete.titulo}!`,
      url: window.location.href,
    };

    if (isMobile() && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          // Silenciado: error al usar la API de compartir
        }
      }
    } else {
      // Desktop: copiar al portapapeles y mostrar toast
      const urlText = window.location.href;
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(urlText);
          copied = true;
        } else {
          throw new Error("Clipboard API no disponible");
        }
      } catch (err) {
        // Fallback con input temporal
        try {
          const tmp = document.createElement("input");
          tmp.value = urlText;
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
          copied = true;
        } catch (e) {
          // Silenciado: error al copiar enlace en fallback
        }
      }

      showToast(
        copied
          ? "Enlace copiado al portapapeles"
          : "No se pudo copiar el enlace. Intenta manualmente.",
      );
    }
  };

  // Navegación consistente para volver o enviar al Home cuando no hay historial válido
  const handleNavigateBack = () => {
    const hasHistory = window.history.length > 1;
    if (hasHistory) {
      const prev = document.referrer;
      if (prev) {
        try {
          const prevUrl = new URL(prev, window.location.origin);
          const sameOrigin = prevUrl.origin === window.location.origin;
          const samePath = sameOrigin && prevUrl.pathname === window.location.pathname;
          if (samePath) {
            window.location.assign("/");
            return;
          }
          window.history.back();
          return;
        } catch (err) {
          window.history.back();
          return;
        }
      }
      window.location.assign("/");
      return;
    }
    window.location.assign("/");
  };

  const handleAdultModalBack = () => {
    setShowAdultWarning(false);
    setAdultWarningAccepted(false);
    document.body.style.overflow = "unset";
    handleNavigateBack();
  };

  if (loading)
    return (
      <>
        <ToastPortal />
        <PackageSkeleton />
      </>
    );
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  if (!paquete) return <NotFoundMessage />;
  if (paquete.activo === false) return <InactivePackageMessage />;

  // Moneda y precios SOLO después de asegurar paquete
  const moneda = sanitizeMoneda(paquete?.moneda);
  const precioTotalFormatted = formatPrecio(paquete?.precio_total, moneda);
  const precioOriginalFormatted = formatPrecio(
    (parseFloat(paquete?.precio_total) || 0) +
      (parseFloat(paquete?.descuento) || 0),
    moneda,
  );
  const personasValue = parseInt(paquete?.personas, 10);
  const personasValidas = !isNaN(personasValue) && personasValue > 0;
  const precioPorPersonaFormatted =
    personasValidas && paquete?.precio_total
      ? formatPrecio(
          (parseFloat(paquete?.precio_total) || 0) / personasValue,
          moneda,
        )
      : null;

  // Desglose opcional: vuelo / hospedaje (nuevos campos del backend)
  const hasPrecioVuelo =
    paquete?.precio_vuelo != null && parseFloat(paquete.precio_vuelo) > 0;
  const hasPrecioHospedaje =
    paquete?.precio_hospedaje != null &&
    parseFloat(paquete.precio_hospedaje) > 0;
  const precioVueloFormatted = hasPrecioVuelo
    ? formatPrecio(paquete.precio_vuelo, moneda)
    : null;
  const precioHospedajeFormatted = hasPrecioHospedaje
    ? formatPrecio(paquete.precio_hospedaje, moneda)
    : null;

  // Preparar textos y detección de “contenido largo” para acordeones en móvil
  const incluyeText = (paquete?.incluye || "").toString().trim();
  const noIncluyeText = (paquete?.no_incluye || "").toString().trim();
  const isLongText = (t) => t.length > 240 || t.split(/\r?\n/).length > 4;
  const incluyeHasMore = isLongText(incluyeText);
  const noIncluyeHasMore = isLongText(noIncluyeText);

  console.log("🎯 PackageViewPage - showAdultWarning:", showAdultWarning, "aptoParaMenores:", paquete?.aptoParaMenores);

  return (
    <>
      {/* Modal de advertencia de contenido adulto - fuera de PageTransition */}
      {showAdultWarning && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 999999, margin: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdultWarning(false);
              setAdultWarningAccepted(true);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border-4 border-amber-500 max-w-md w-full"
            style={{ zIndex: 1000000, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 rounded-full bg-amber-100">
                  <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Contenido para adultos
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAdultWarning(false);
                  setAdultWarningAccepted(true);
                }}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Cerrar"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="text-5xl sm:text-6xl">🔞</div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center mb-3">
                Este paquete incluye actividades{" "}
                <span className="font-semibold text-amber-600">
                  exclusivas para mayores de 18 años
                </span>
                .
              </p>
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Al continuar, confirmas que cumples con el requisito de edad.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleAdultModalBack}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
              >
                Regresar
              </button>
              <button
                onClick={() => {
                  setShowAdultWarning(false);
                  setAdultWarningAccepted(true);
                }}
                className="px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
              >
                Tengo +18 años, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <PageTransition className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        {/* Toast global para acciones de contacto */}
        <ToastPortal />

        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrollY > 100
              ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
            <button
              onClick={handleNavigateBack}
              className={`group flex items-center gap-3 px-4 py-2 rounded-xl min-h-[44px] transition-all duration-300 ${
                scrollY > 100
                  ? "bg-gray-100/80 hover:bg-gray-200/80 text-gray-700"
                  : "bg-white/90 hover:bg-white text-gray-700 shadow-lg"
              }`}
              aria-label="Volver a la página anterior"
            >
              <FiArrowLeft
                className="w-5 h-5 md:group-hover:-translate-x-1 transition-transform duration-300"
                aria-hidden="true"
              />
              <span className="font-medium hidden sm:block">Volver</span>
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 min-h-[44px] ${
                  scrollY > 100
                    ? "bg-gray-100/80 text-gray-700"
                    : "bg-white/90 text-gray-700 shadow-lg"
                } hover:scale-105 hover:shadow-md`}
                aria-label="Destino del paquete"
              >
                <FiMapPin
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500"
                />
                <span className="truncate max-w-[10rem] sm:max-w-[16rem]">
                  {paquete.destinos && paquete.destinos.length > 0
                    ? paquete.destinos.length === 1
                      ? paquete.destinos[0].ciudad ||
                        paquete.destinos[0].destino
                      : `${paquete.destinos.length} destinos`
                    : "Destino"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`group p-3 rounded-xl transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    isLiked
                      ? "bg-red-100/80 text-red-500 scale-110"
                      : scrollY > 100
                        ? "bg-gray-100/80 hover:bg-red-100/80 hover:text-red-500 text-gray-500"
                        : "bg-white/90 hover:bg-red-100/80 hover:text-red-500 text-gray-500 shadow-lg"
                  }`}
                  aria-label={
                    isLiked ? "Quitar de favoritos" : "Agregar a favoritos"
                  }
                  aria-pressed={isLiked}
                >
                  <FiHeart
                    className={`w-5 h-5 transition-all duration-300 ${
                      isLiked
                        ? "fill-current scale-110"
                        : "md:group-hover:scale-110"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <button
                  onClick={handleShare}
                  className={`group p-3 rounded-xl transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    scrollY > 100
                      ? "bg-gray-100/80 hover:bg-blue-100/80 hover:text-blue-500 text-gray-500"
                      : "bg-white/90 hover:bg-blue-100/80 hover:text-blue-500 text-gray-500 shadow-lg"
                  }`}
                  aria-label="Compartir paquete"
                >
                  <FiShare2
                    className="w-5 h-5 md:group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        <main className="relative">
          <div
          className="relative min-h-[70svh] sm:min-h-[80svh] md:min-h-[100svh] h-[100dvh] flex items-center justify-center overflow-hidden"
          style={
            !isSmallScreen
              ? { transform: `translateY(${scrollY * 0.2}px)` }
              : undefined
          }
        >
          <div className="absolute inset-0">
            <ImageCarousel
              imagenes={paquete.imagenes}
              emptyStateTitle="Sin fotos del paquete"
              emptyStateDescription="Las imágenes de este paquete turístico se cargarán próximamente"
              enableSnap={true}
              disableMobileSwipe={true}
              showLoadingOverlay={false}
              onRequestFullscreen={(urls, index) => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              onSlideChange={(i) => setLightboxIndex(i)}
            />
            {/* Overlays no bloquean clics */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
          </div>

          <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
            <div className="space-y-6 sm:space-y-7">
              <h1 className="font-volkhov tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                <span className="text-white [text-wrap:balance]">
                  {paquete.titulo}
                </span>
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed font-medium backdrop-blur-sm/30">
                Descubre una experiencia única que combina aventura, cultura y momentos inolvidables
              </p>

              <div className="pt-4 md:pt-6 flex justify-center">
                <button
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/60 text-white font-semibold py-4 px-9 rounded-2xl shadow-[0_8px_30px_-6px_rgba(37,99,235,0.55)] hover:shadow-[0_10px_38px_-4px_rgba(99,102,241,0.65)] transition-all duration-300 text-lg tracking-wide active:scale-[0.97]"
                  aria-label="Reservar aventura para este paquete turístico"
                  onClick={() => {
                    const codigo = paquete.codigo || url;
                    const currentUrl = window.location.href;
                    const msg = `Hola, me interesa el viaje "${paquete.titulo}" (código ${codigo}).\n¿Podrían compartir más detalles sobre itinerario, disponibilidad y lo que incluye?\nURL: ${currentUrl}\nGracias.`;
                    openWhatsApp(msg);
                  }}
                >
                  <span className="flex items-center gap-3 relative z-10">
                    <span className="inline-flex items-center gap-2">
                      <FiCalendar className="w-5 h-5 md:group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                      Reservar Aventura
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="absolute left-1/2 transform -translate-x-1/2 text-white block pointer-events-none"
            style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            {/* Desktop: mantiene el bounce */}
            <div className="hidden sm:flex flex-col items-center gap-2 animate-bounce">
              <span className="text-sm font-medium">Descubre más</span>
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>

            {/* Mobile: mano indicando deslizamiento hacia abajo */}
            <div className="sm:hidden flex flex-col items-center gap-1">
              <span className="text-xs font-medium">Desliza hacia abajo</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm animate-swipe-down">
                <FaHandPointer className="w-4 h-4 text-white rotate-180" />
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Global para imágenes del paquete */}
        <LightboxModal
          images={(paquete.imagenes || []).map((img) => {
            // Resolver al máximo posible usando lógica del carrusel
            const u = img?.contenido?.startsWith("data:")
              ? img.contenido
              : img?.url?.startsWith("http") || img?.url?.startsWith("data:")
                ? img.url
                : img?.contenido?.startsWith("http") ||
                    img?.contenido?.includes("://")
                  ? img.contenido
                  : img?.contenido &&
                      !img?.contenido?.includes("://") &&
                      !img?.contenido?.startsWith("http")
                    ? `data:image/jpeg;base64,${img.contenido}`
                    : img?.ruta
                      ? `${import.meta.env.VITE_API_BASE_URL}${img.ruta}`
                      : img?.nombre
                        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/images/${img.nombre.startsWith("/") ? img.nombre.slice(1) : img.nombre}`
                        : img?.url
                          ? `${import.meta.env.VITE_API_BASE_URL}${img.url}`
                          : "";
            return u;
          })}
          startIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
        />

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              <AnimatedSection animation="fadeInUp" stagger={100}>
                <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-7 border border-gray-100/70 transition-all duration-300 focus-within:shadow-2xl hover:shadow-2xl hover:border-gray-200/80">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <FiInfo className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-volkhov text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        Información del Paquete
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Todo lo que necesitas saber sobre tu aventura
                      </p>
                    </div>
                  </div>
                  <PackageInfo paquete={paquete} />
                </section>
              </AnimatedSection>

              {paquete.destinos &&
                paquete.destinos.length > 0 &&
                paquete.destinos[0]?.destino_lat &&
                paquete.destinos[0]?.destino_lng && (
                  <AnimatedSection animation="fadeInUp" delay={150}>
                    <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-7 border border-gray-100/70 transition-all duration-300 hover:shadow-2xl hover:border-gray-200/80">
                      <div className="flex items-start gap-5 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                          <FiSun className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="font-volkhov text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                            Pronóstico del Clima
                          </h2>
                          <p className="text-gray-600 text-sm sm:text-base">
                            El tiempo en{" "}
                            {paquete.destinos[0].ciudad ||
                              paquete.destinos[0].destino}
                          </p>
                        </div>
                      </div>

                      <WeatherForecast
                        lat={paquete.destinos[0].destino_lat}
                        lon={paquete.destinos[0].destino_lng}
                        cityName={
                          paquete.destinos[0].ciudad ||
                          paquete.destinos[0].destino
                        }
                      />
                    </section>
                  </AnimatedSection>
                )}

              <AnimatedSection animation="fadeInUp" delay={200}>
                <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-7 border border-gray-100/70 transition-all duration-300 hover:shadow-2xl hover:border-gray-200/80">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                      <FiMapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-volkhov text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        Ruta del Viaje
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Explora todos los destinos de tu aventura
                      </p>
                      {paquete?.destinos && paquete.destinos.length > 1 && (
                        <div className="mt-3 px-3 py-2 rounded-lg border border-purple-100 bg-purple-50/70">
                          <span className="text-sm font-medium text-purple-700">
                            Ruta:{" "}
                            {paquete.destinos
                              .map((d) => d.ciudad || d.destino)
                              .join(" → ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-gray-100 shadow-lg">
                    <RouteMap paquete={paquete} />
                  </div>
                </section>
              </AnimatedSection>

              {paquete.itinerarios && paquete.itinerarios.length > 0 && (
                <AnimatedSection animation="fadeInUp" delay={250}>
                  <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-7 border border-gray-100/70 transition-all duration-300 hover:shadow-2xl hover:border-gray-200/80">
                    <div className="flex items-start gap-5 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <FiCalendar className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-volkhov text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                          Itinerario Detallado
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Tu aventura día a día, planificada con precisión
                        </p>
                      </div>
                    </div>

                    <Itinerary itinerario={paquete.itinerarios} />
                  </section>
                </AnimatedSection>
              )}

              {paquete.hotel && (
                <AnimatedSection animation="fadeInUp" delay={300}>
                  <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-7 border border-gray-100/70 transition-all duration-300 hover:shadow-2xl hover:border-gray-200/80">
                    <div className="flex items-start gap-5 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                        <FiHome className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-volkhov text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                          Tu Alojamiento
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Comodidad y estilo durante tu estadía
                        </p>
                      </div>
                    </div>

                    {/* Ajuste visual: eliminar borde/sombra/redondeado para integrar con la card principal */}
                    <div className="h-[26rem] sm:h-[28rem] md:h-[30rem] lg:h-[34rem] xl:h-[40rem] overflow-hidden">
                      <HotelInfo hotel={paquete.hotel} />
                    </div>
                  </section>
                </AnimatedSection>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {paquete.notas && (
                  <AnimatedSection animation="fadeInUp" delay={100}>
                    <section className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-transform duration-300">
                          <FiInfo className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-volkhov text-xl sm:text-2xl font-bold text-gray-900">
                            Notas Importantes
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Información adicional
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl p-0 backdrop-blur-sm flex-1">
                        <ExpandableContent
                          collapsedHeight={192}
                          className="p-4"
                        >
                          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                            {paquete.notas}
                          </p>
                        </ExpandableContent>
                      </div>
                    </section>
                  </AnimatedSection>
                )}

                {paquete.requisitos && (
                  <AnimatedSection animation="fadeInUp" delay={150}>
                    <section className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-transform duration-300">
                          <FiCheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-volkhov text-xl sm:text-2xl font-bold text-gray-900">
                            Requisitos
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Lo que necesitas
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-4 backdrop-blur-sm">
                        <Requirements requisitos={paquete.requisitos} />
                      </div>
                    </section>
                  </AnimatedSection>
                )}

                {paquete.incluye && (
                  <AnimatedSection animation="fadeInUp" delay={200}>
                    <section className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-4 mb-6">
                        <div>
                          <h3 className="font-volkhov text-xl sm:text-2xl font-bold text-gray-900">
                            ¿Qué Incluye?
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Servicios contemplados
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-xl p-0 backdrop-blur-sm flex-1">
                        <ExpandableContent
                          collapsedHeight={192}
                          className="p-4"
                        >
                          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                            {incluyeText}
                          </p>
                        </ExpandableContent>
                      </div>
                    </section>
                  </AnimatedSection>
                )}

                {paquete.no_incluye && (
                  <AnimatedSection animation="fadeInUp" delay={250}>
                    <section className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-transform duration-300">
                          <FiX className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-volkhov text-xl sm:text-2xl font-bold text-gray-900">
                            No Incluye
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Gastos adicionales
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 rounded-xl p-0 backdrop-blur-sm flex-1">
                        <ExpandableContent
                          collapsedHeight={192}
                          className="p-4"
                        >
                          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                            {noIncluyeText}
                          </p>
                        </ExpandableContent>
                      </div>
                    </section>
                  </AnimatedSection>
                )}
              </div>
            </div>

            <aside className="xl:col-span-1">
              <div className="sticky top-24 space-y-6 lg:space-y-7">
                <AnimatedSection animation="fadeInUp" delay={150}>
                  <div className="relative group rounded-2xl p-[2px] bg-gradient-to-br from-blue-200 via-purple-200 to-emerald-200 shadow-[0_8px_28px_-6px_rgba(59,130,246,0.25)] hover:shadow-[0_10px_36px_-4px_rgba(99,102,241,0.32)] transition-all duration-500">
                    <div className="bg-white/95 backdrop-blur rounded-2xl h-full w-full p-5 lg:p-6 xl:p-7 border border-white/40">
                      <div className="text-center space-y-4 mb-6 max-w-full overflow-x-hidden">
                      {paquete.descuento &&
                      parseFloat(paquete.descuento) > 0 ? (
                        <>
                          <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2 max-w-full animate-[fadeIn_0.6s_ease]">
                            <span className="text-base sm:text-lg font-medium text-gray-400/80 line-through leading-snug tracking-wide">
                              {precioOriginalFormatted}
                            </span>
                            {precioOriginalFormatted && (
                              <span className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider">
                                ({moneda})
                              </span>
                            )}
                          </div>

                          <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 max-w-full px-2">
                            <span className="inline-block text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.75rem] font-extrabold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent leading-none drop-shadow-[0_3px_8px_rgba(16,185,129,0.35)]" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                              {precioTotalFormatted}
                            </span>
                            {precioTotalFormatted && (
                              <span className="text-sm text-emerald-700 font-semibold tracking-wide">
                                {moneda}
                              </span>
                            )}
                          </div>
                          <span className="block text-gray-500 text-sm">
                            {personasValidas && precioPorPersonaFormatted
                              ? `${precioPorPersonaFormatted} por persona (para ${personasValue} ${personasValue > 1 ? "viajeros" : "viajero"})`
                              : "Precio total del paquete"}
                          </span>
                          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white rounded-full text-[11px] font-semibold shadow-md tracking-wide">
                            <FiAward className="w-4 h-4 mr-1.5 animate-pulse" />
                            Ahorras {formatPrecio(paquete.descuento, moneda)} <span className="ml-1">({moneda})</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 max-w-full px-2">
                            <span className="inline-block text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.75rem] font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent leading-none drop-shadow-[0_3px_8px_rgba(79,70,229,0.35)]" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                              {precioTotalFormatted}
                            </span>
                            {precioTotalFormatted && (
                              <span className="text-sm text-blue-700 font-semibold tracking-wide">
                                {moneda}
                              </span>
                            )}
                          </div>
                          <span className="block text-gray-500 text-sm">
                            {personasValidas && precioPorPersonaFormatted
                              ? `${precioPorPersonaFormatted} por persona (para ${personasValue} ${personasValue > 1 ? "viajeros" : "viajero"})`
                              : "Precio total del paquete"}
                          </span>
                        </>
                      )}
                      <p className="text-gray-500/90 text-[11px] font-medium mx-auto max-w-[22rem] px-3 leading-relaxed">
                        Tarifas sujetas a cambios por disponibilidad y temporada
                      </p>
                    </div>

                    {paquete.anticipo && parseFloat(paquete.anticipo) > 0 && (
                      <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-100/80 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-sky-50/90 p-3.5 flex-wrap shadow-inner">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shrink-0 ring-4 ring-white/40">
                          <FiDollarSign className="w-7 h-7 drop-shadow" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-tight">
                            <h3 className="font-bold text-blue-900 text-[13px] tracking-wide">
                              Anticipo requerido
                            </h3>
                            <span className="text-sm font-semibold text-blue-700">
                              {formatPrecio(paquete.anticipo, moneda)}
                            </span>
                            <span className="text-[11px] text-blue-700 font-semibold">
                              {moneda}
                            </span>
                          </div>
                          <p className="text-blue-600 text-[11px] font-medium mt-0.5">
                            Asegura tu lugar hoy
                          </p>
                        </div>
                      </div>
                    )}

                    {(hasPrecioVuelo || hasPrecioHospedaje) && (
                      <div className="mb-6 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50/70 via-white/40 to-gray-100/60 p-4 shadow-inner">
                        <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                          <FiDollarSign className="w-4 h-4 text-gray-500" />
                          Desglose de precios
                        </h4>
                        <ul className="space-y-1.5 text-[13px] text-gray-600">
                          {hasPrecioVuelo && (
                            <li className="flex justify-between items-center group/item">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 group-hover/item:scale-110 transition-transform" />
                                Vuelo
                              </span>
                              <span className="font-medium text-gray-900 flex items-baseline gap-1">
                                {precioVueloFormatted}
                                <span className="text-[10px] text-gray-500 font-semibold">
                                  {moneda}
                                </span>
                              </span>
                            </li>
                          )}
                          {hasPrecioHospedaje && (
                            <li className="flex justify-between items-center group/item">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/80 group-hover/item:scale-110 transition-transform" />
                                Hospedaje
                              </span>
                              <span className="font-medium text-gray-900 flex items-baseline gap-1">
                                {precioHospedajeFormatted}
                                <span className="text-[10px] text-gray-500 font-semibold">
                                  {moneda}
                                </span>
                              </span>
                            </li>
                          )}
                          <li className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                            <span className="font-semibold text-gray-800 tracking-wide">Total</span>
                            <span className="font-bold text-blue-600 flex items-baseline gap-1">
                              {precioTotalFormatted}
                              <span className="text-[10px] text-blue-600 font-bold">
                                {moneda}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}

                    <button
                      className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold py-3.5 px-5 rounded-xl shadow-[0_6px_20px_-4px_rgba(79,70,229,0.55)] hover:shadow-[0_10px_28px_-4px_rgba(99,102,241,0.55)] hover:scale-[1.015] transition-all duration-300 mb-5 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/50 active:scale-[0.98]"
                      aria-label="Reservar aventura para este paquete turístico"
                      onClick={() => {
                        const codigo = paquete.codigo || url;
                        const currentUrl = window.location.href;
                        const msg = `Hola, me interesa el viaje "${paquete.titulo}" (código ${codigo}).\n¿Podrían compartir más detalles sobre itinerario, disponibilidad y lo que incluye?\nURL: ${currentUrl}\nGracias.`;
                        openWhatsApp(msg);
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="flex items-center justify-center gap-2 text-base relative z-10">
                        <FiCalendar className="w-5 h-5" aria-hidden="true" />
                        Reservar Aventura
                      </span>
                    </button>

                      <div className="grid grid-cols-2 gap-2">
                      <a
                        href={getPhoneHref()}
                        onClick={onPhoneClick}
                        className="flex items-center justify-center gap-2 h-11 min-h-[44px] bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-all duration-200"
                        aria-label="Llamar para más información"
                      >
                        <FiPhone className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium text-sm">Llamar</span>
                      </a>
                      <button
                        onClick={() => {
                          const codigo = paquete.codigo || url;
                          const currentUrl = window.location.href;
                          const msg = `Hola, me interesa el viaje "${paquete.titulo}" (código ${codigo}).\n¿Podrían compartir más detalles sobre itinerario, disponibilidad y lo que incluye?\nURL: ${currentUrl}\nGracias.`;
                          openWhatsApp(msg);
                        }}
                        className="flex items-center justify-center gap-2 h-11 min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-all duration-200"
                        aria-label="Contactar por WhatsApp"
                      >
                        <FaWhatsapp className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium text-sm">WhatsApp</span>
                      </button>
                      </div>
                    </div>{/* inner white card */}
                  </div>{/* gradient border wrapper */}
                </AnimatedSection>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Divisor suave */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
      </div>

      {/* Espacio para no chocar con CTA móvil fijo */}
      <div className="h-20 sm:hidden" />

      {/* Más paquetes recomendados */}
      <RecommendedPackages currentCodigoUrl={url} currentId={paquete?.id} />

      {/* Trust bar (confianza) */}
      <TrustBar />

      {/* Footer del sitio (mismo del Home) */}
      <Footer
        contactInfo={contactInfo}
        contactLoading={contactLoading}
        currentYear={new Date().getFullYear()}
      />

      {/* CTA pegajosa en móviles eliminada por preferencia de diseño */}
    </PageTransition>
    </>
  );
}

export default PackageViewPage;
