import React from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import { Link } from "react-router-dom";
import { getPaquetesPublic } from "../../../api/packagesService";
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx";
import { getImageUrl } from "../../../utils/imageUtils.js";

const Steps = () => {
  // Eliminado useStaggeredAnimation: usaremos AnimatedSection para cada step
  const steps = [
    {
      title: "Consulta personalizada",
      badge: "Paso 1",
      color: "from-yellow-400 to-orange-500",
      bgBadge: "bg-yellow-100 text-yellow-900",
      iconPath:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      desc: "Agenda una cita con nuestros asesores especializados. Te ayudamos a diseñar el viaje perfecto para ti.",
      extra: (
        <div className="mt-2 flex items-center text-[11px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            30 min promedio
          </span>
          <span className="mx-2">•</span>
          <span>Gratis</span>
        </div>
      ),
    },
    {
      title: "Cotización y reserva",
      badge: "Paso 2",
      color: "from-red-400 to-pink-500",
      bgBadge: "bg-red-100 text-red-900",
      iconPath:
        "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      desc: "Recibe tu cotización detallada y realiza tu reserva con facilidades de pago y seguros incluidos.",
      extra: (
        <div className="mt-2 flex items-center text-[11px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Pago seguro
          </span>
          <span className="mx-2">•</span>
          <span>Meses sin intereses</span>
        </div>
      ),
    },
    {
      title: "¡Disfruta tu experiencia!",
      badge: "Paso 3",
      color: "from-teal-400 to-green-500",
      bgBadge: "bg-green-100 text-green-900",
      iconPath: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
      desc: "Te acompañamos durante todo el proceso. Soporte 24/7 para que vivas una experiencia inolvidable.",
      extra: (
        <div className="mt-2 flex items-center text-[11px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Soporte 24/7
          </span>
          <span className="mx-2">•</span>
          <span>App móvil</span>
        </div>
      ),
    },
  ];

  // Estado paquete destacado
  const [featured, setFeatured] = React.useState(null);
  const [secondFeatured, setSecondFeatured] = React.useState(null);
  const [loadingPkg, setLoadingPkg] = React.useState(true);
  const [errorPkg, setErrorPkg] = React.useState(null);
  const [restoredFromSession, setRestoredFromSession] = React.useState(false);

  // Restaurar de sessionStorage si existe
  React.useEffect(() => {
    try {
      const cached = sessionStorage.getItem("stepsFeaturedPackages");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.featured) setFeatured(parsed.featured);
        if (parsed?.secondFeatured) setSecondFeatured(parsed.secondFeatured);
        setRestoredFromSession(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingPkg(true);
        const { data } = await getPaquetesPublic(1, 12);
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [];
        if (!items.length) {
          if (active) {
            setErrorPkg("Sin paquetes disponibles");
          }
          return; // Usará fallbackCard
        }
        const activos = items.filter((p) => p.activo !== false);
        const pool = activos.length ? activos : items;
        if (!pool.length) {
          if (active) setErrorPkg("Sin paquetes disponibles");
          return;
        }
        const idx1 = Math.floor(Math.random() * pool.length);
        const chosen = pool[idx1];
        let chosen2 = null;
        if (pool.length > 1) {
          // intentar seleccionar diferente
            for (let i = 0; i < 4; i++) {
              const tentative = pool[Math.floor(Math.random() * pool.length)];
              if (tentative !== chosen) {
                chosen2 = tentative; break;
              }
            }
          if (!chosen2) {
            // fallback: siguiente índice circular
            chosen2 = pool[(idx1 + 1) % pool.length];
          }
        }
        if (active && chosen) {
          // Normalización de imagen: replicar prioridad usada en otras vistas (primera_imagen > imagen_principal > imagenDestacada > portada/cover > primera de arreglo imagenes)
          const rawImage =
            chosen.primera_imagen ||
            chosen.imagen_principal ||
            chosen.imagenDestacada ||
            chosen.portada ||
            chosen.cover ||
            chosen.image ||
            (Array.isArray(chosen.imagenes) && chosen.imagenes[0]?.url) ||
            (Array.isArray(chosen.imagenes) && chosen.imagenes[0]?.contenido) ||
            (Array.isArray(chosen.imagenes) && chosen.imagenes[0]) ||
            null;

          const resolvedImage = rawImage ? getImageUrl(rawImage) : "/HomePage/como-reservar-card1.avif";

          const newFeatured = {
            id: chosen.id,
            titulo: chosen.titulo || chosen.title || "Paquete destacado",
            salida: chosen.salida || chosen.fechaInicio || null,
            proveedor: chosen.operador || chosen.proveedor || "VIADCA Tours",
            precio: chosen.precioDesde || chosen.precio || chosen.price || null,
            imagen: resolvedImage,
            url: chosen.codigoUrl || chosen.slug || null,
          };
          setFeatured(newFeatured);
          if (chosen2) {
            const rawImage2 =
              chosen2.primera_imagen ||
              chosen2.imagen_principal ||
              chosen2.imagenDestacada ||
              chosen2.portada ||
              chosen2.cover ||
              chosen2.image ||
              (Array.isArray(chosen2.imagenes) && chosen2.imagenes[0]?.url) ||
              (Array.isArray(chosen2.imagenes) && chosen2.imagenes[0]?.contenido) ||
              (Array.isArray(chosen2.imagenes) && chosen2.imagenes[0]) ||
              null;
            const resolvedImage2 = rawImage2 ? getImageUrl(rawImage2) : "/HomePage/como-reservar-card1.avif";
            const newSecond = {
              id: chosen2.id,
              titulo: chosen2.titulo || chosen2.title || "Próximo viaje",
              salida: chosen2.salida || chosen2.fechaInicio || null,
              proveedor: chosen2.operador || chosen2.proveedor || "VIADCA Tours",
              precio: chosen2.precioDesde || chosen2.precio || chosen2.price || null,
              imagen: resolvedImage2,
              url: chosen2.codigoUrl || chosen2.slug || null,
            };
            setSecondFeatured(newSecond);
            try {
              sessionStorage.setItem(
                "stepsFeaturedPackages",
                JSON.stringify({ featured: newFeatured, secondFeatured: newSecond })
              );
            } catch {}
          } else {
            try {
              sessionStorage.setItem(
                "stepsFeaturedPackages",
                JSON.stringify({ featured: newFeatured })
              );
            } catch {}
          }
        } else if (active && !chosen) {
          setErrorPkg("No se pudo seleccionar paquete");
        }
      } catch (e) {
        if (active) setErrorPkg(e.message || "Error cargando paquete");
      } finally {
        if (active) setLoadingPkg(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (v) => {
    if (v == null) return null;
    try {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(Number(v));
    } catch {
      return `$${v} MXN`;
    }
  };

  const fallbackCard = {
    titulo: "Tour Pirámides de Teotihuacán",
    salida: "Sábados",
    proveedor: "VIADCA Tours",
    precio: 92500,
    imagen: "/HomePage/como-reservar-card1.avif",
    url: null,
  };

  const card = featured || fallbackCard;
  const precioFmt = formatPrice(card.precio);

  return (
    <section
      id="pasos"
      className="py-10 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-white to-blue-50"
      aria-labelledby="pasos-heading"
    >
        <style>{`@keyframes fadeInSecond{0%{opacity:0;transform:translateY(12px) scale(.96)}60%{opacity:1;transform:translateY(0) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="space-y-6 lg:space-y-8 order-1 relative">
            <div className="absolute inset-0 -z-10 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm lg:hidden" />
            <AnimatedSection
              animation="fadeInLeft"
              className="text-center lg:text-left"
            >
              <p className="text-slate-600 font-semibold text-sm sm:text-base uppercase tracking-wide mb-2 sm:mb-3">
                Proceso simple
              </p>

              <h2
                id="pasos-heading"
                className="font-volkhov font-bold text-2xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight"
              >
                Reserva con VIADCA
                <br />
                en 3 pasos sencillos
              </h2>

              <p className="text-slate-600 text-sm sm:text-base mt-3 lg:hidden">
                Un proceso diseñado para hacer tu experiencia de reserva fácil y
                confiable
              </p>
            </AnimatedSection>
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              {steps.map((s, i) => (
                <AnimatedSection
                  key={s.title}
                  animation="fadeInLeft"
                  delay={200 + i * 180}
                  className="flex items-start space-x-3 sm:space-x-4 lg:space-x-6 group"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${s.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 motion-safe:animate-none`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={s.iconPath}
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className="font-bold text-base sm:text-lg lg:text-xl text-slate-800">
                        {s.title}
                      </h3>
                      <span
                        className={`${s.bgBadge} px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                      {s.desc}
                    </p>
                    {s.extra}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right card */}
          <AnimatedSection
            animation="fadeInRight"
            delay={400}
            className="relative order-2"
          >
            <div className={`relative bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-blue-100 w-full sm:max-w-lg lg:max-w-md mx-auto hover:shadow-2xl transition-shadow duration-300 group ${card.url ? 'cursor-pointer' : 'cursor-default'}`}>
              <div className="relative overflow-hidden rounded-2xl mb-4 sm:mb-6">
                {card.url && (
                  <Link
                    to={`/paquetes/${card.url}`}
                    aria-label={`Ver detalle del paquete ${card.titulo}`}
                    className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 group"
                    tabIndex={0}
                    title="Ver detalles"
                  />
                )}
                {card.imagen ? (
                  <OptimizedImage
                    src={card.imagen}
                    alt={`Imagen paquete destacado: ${card.titulo}`}
                    width={800}
                    height={600}
                    responsive
                    sizes="(max-width:640px) 100vw, 400px"
                    className="w-full h-48 sm:h-64 object-cover"
                    lazy={!featured}
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-slate-100 animate-pulse" />
                )}
                {restoredFromSession && loadingPkg && !errorPkg && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" aria-label="Actualizando paquete" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-green-700 text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {featured ? "Destacado" : errorPkg ? "Fallback" : "Ejemplo"}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-slate-800 mb-2 sm:mb-4 line-clamp-2">
                {card.titulo}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {card.salida ? `Salidas: ${card.salida}` : "Salidas flexibles"}
                </span>
                <span className="hidden sm:block" aria-hidden="true">
                  |
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  por {card.proveedor}
                </span>
              </div>

              {/* Iconos de servicios incluidos */}
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4 sm:mb-6">
                {["Transporte", "Comidas", "Guía"].map((label) => (
                  <div key={label} className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                        />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-600 mt-1">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pie de card responsivo */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-slate-600">Cupo disponible</span>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] sm:text-xs text-slate-500">
                    Desde
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {precioFmt || (loadingPkg ? "..." : "Cotiza")}
                  </div>
                </div>
              </div>
            </div>
            <div className={`hidden lg:block absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-xl border border-blue-100 w-80 transition-opacity duration-700 ${secondFeatured ? 'opacity-0 animate-[fadeInSecond_0.9s_ease_forwards_0.15s]' : 'opacity-100'} ${secondFeatured?.url ? 'cursor-pointer' : ''}`}
              style={{ viewTransitionName: secondFeatured ? 'second-package' : undefined }}
            >
              {(() => {
                const small = secondFeatured || featured || fallbackCard;
                const loadingSecond = loadingPkg && !secondFeatured && !featured;
                return (
                  <>
                    {small.url && (
                      <Link
                        to={`/paquetes/${small.url}`}
                        aria-label={`Ir al paquete ${small.titulo}`}
                        className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                        tabIndex={0}
                        title="Ver detalles"
                      />
                    )}
                    <div className="flex items-center space-x-4 mb-4">
                      {small.imagen ? (
                        <img
                          src={small.imagen}
                          alt={small.titulo}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                      )}
                      <div>
                        <p className="text-slate-600 text-sm">Próximo viaje</p>
                        <h4 className="font-semibold text-slate-800">
                          {small.titulo.length > 40
                            ? small.titulo.slice(0, 37) + "..."
                            : small.titulo}
                        </h4>
                        <p className="text-slate-600 text-sm">
                          {loadingSecond
                            ? "Cargando..."
                            : errorPkg && !featured && !secondFeatured
                              ? "Ejemplo genérico"
                              : small.salida || "Fechas variables"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-full bg-gray-200 rounded-full h-2"
                      aria-hidden="true"
                    >
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                        style={{ width: secondFeatured ? "70%" : featured ? "80%" : "50%" }}
                      ></div>
                      {restoredFromSession && loadingPkg && !secondFeatured && (
                        <div className="absolute -top-6 right-0 text-[10px] text-blue-600 font-medium">Actualizando…</div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
            {/* Bloque miniatura + precio para mobile */}
            {(card.imagen || precioFmt) && (
              <div className={`lg:hidden mt-5 flex items-center gap-4 bg-white rounded-2xl p-3 shadow-sm border border-blue-100 relative ${card.url ? 'cursor-pointer' : ''}`}>
                {card.url && (
                  <Link
                    to={`/paquetes/${card.url}`}
                    aria-label={`Ver paquete ${card.titulo}`}
                    className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    tabIndex={0}
                    title="Ver detalles"
                  />
                )}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {card.imagen ? (
                    <img
                      src={card.imagen}
                      alt={`Miniatura paquete: ${card.titulo}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Desde
                  </p>
                  <p className="text-xl font-bold text-green-600 leading-none">
                    {precioFmt || (loadingPkg ? "..." : "Cotiza")}
                  </p>
                  {card.salida && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {card.salida}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="lg:hidden mt-5 grid grid-cols-3 gap-3">
              {[
                ["24/7", "Soporte", "blue"],
                ["15+", "Años", "green"],
                ["100%", "Seguro", "orange"],
              ].map(([v, l, c]) => (
                <div
                  key={l}
                  className="bg-white rounded-xl p-2.5 shadow-sm border border-blue-100 text-center"
                >
                  <div className={`text-sm font-bold text-${c}-600`}>{v}</div>
                  <div className="text-[10px] text-slate-600">{l}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Steps;
