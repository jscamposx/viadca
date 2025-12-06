import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import {
  AnimatedSection,
  useSectionReveal,
} from "../../../hooks/scrollAnimations"; // actualizado
import {
  FiMapPin,
  FiSend,
  FiHome,
  FiGlobe,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiPlus,
  FiPackage,
  FiTruck,
  FiLayers,
  FiClock,
} from "react-icons/fi";
import { FaShip, FaRoute } from "react-icons/fa";
import OptimizedImage from "../../../components/ui/OptimizedImage.jsx";

// Helpers y tarjeta memoizados a nivel de módulo para evitar recreaciones por render
const getBadgeConfig = (rawType) => {
  const key = typeof rawType === "string" ? rawType.trim().toLowerCase() : null;
  const base = {
    label: rawType || "Activo",
    className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    icon: <FiCheckCircle className="w-3 h-3" aria-hidden="true" />,
  };
  const map = {
    circuito: {
      label: "Circuito",
      className: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
      icon: <FaRoute className="w-3 h-3" aria-hidden="true" />,
    },
    paquete: {
      label: "Paquete",
      className: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
      icon: <FiPackage className="w-3 h-3" aria-hidden="true" />,
    },
    hotel: {
      label: "Hotel",
      className: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
      icon: <FiHome className="w-3 h-3" aria-hidden="true" />,
    },
    vuelo: {
      label: "Vuelo",
      className: "bg-gradient-to-r from-sky-500 to-cyan-600 text-white",
      icon: <FiSend className="w-3 h-3" aria-hidden="true" />,
    },
    traslado: {
      label: "Traslado",
      className: "bg-gradient-to-r from-teal-500 to-green-600 text-white",
      icon: <FiTruck className="w-3 h-3" aria-hidden="true" />,
    },
    excursion: {
      label: "Excursión",
      className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
      icon: <FiMapPin className="w-3 h-3" aria-hidden="true" />,
    },
    combinado: {
      label: "Combinado",
      className: "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
      icon: <FiLayers className="w-3 h-3" aria-hidden="true" />,
    },
    crucero: {
      label: "Crucero",
      className: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white",
      icon: <FaShip className="w-3 h-3" aria-hidden="true" />,
    },
  };
  if (!key) return base;
  if (map[key]) return map[key];
  return {
    label: rawType,
    className: "bg-gradient-to-r from-slate-600 to-gray-700 text-white",
    icon: <FiGlobe className="w-3 h-3" aria-hidden="true" />,
  };
};

function areDestinationPropsEqual(prevProps, nextProps) {
  const a = prevProps.p || {};
  const b = nextProps.p || {};
  const getType = (obj) =>
    Array.isArray(obj?.mayoristas_tipos) && obj.mayoristas_tipos.length > 0
      ? obj.mayoristas_tipos[0]
      : obj?.tipo_producto || obj?.tipo;

  return (
    a?.primera_imagen === b?.primera_imagen &&
    a?.moneda === b?.moneda &&
    a?.precio_total === b?.precio_total &&
    a?.duracion_dias === b?.duracion_dias &&
    a?.destinos_nombres === b?.destinos_nombres &&
    a?.codigoUrl === b?.codigoUrl &&
    a?.titulo === b?.titulo &&
    getType(a) === getType(b)
  );
}

const DestinationCard = React.memo(function DestinationCard({
  p,
  compact = false,
}) {
  const img =
    p?.primera_imagen ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";
  const moneda = sanitizeMoneda(p?.moneda);
  const precio = formatPrecio(p?.precio_total, moneda);
  const personasValue = parseInt(p?.personas, 10);
  const personasValidas = !Number.isNaN(personasValue) && personasValue > 0;
  const precioPorPersona =
    personasValidas && p?.precio_total
      ? formatPrecio(
        (parseFloat(p?.precio_total) || 0) / personasValue,
        moneda,
      )
      : null;
  const duracion = p?.duracion_dias ? `${p.duracion_dias} días` : "";
  const firstDest =
    Array.isArray(p?.destinos) && p.destinos.length > 0 ? p.destinos[0] : null;
  const computeDestino = (dest) => {
    if (!dest) return "";
    const estado = (dest.estado || "").trim();
    const ciudad = (dest.ciudad || dest.destino || "").trim();
    const pais = (dest.pais || "").trim();
    if (estado && ciudad && estado.toLowerCase() !== ciudad.toLowerCase())
      return `${estado}, ${ciudad}`;
    if (estado) return estado;
    if (ciudad) return ciudad;
    if (pais) return pais;
    return "";
  };
  const destinoPrincipal =
    computeDestino(firstDest) || p?.destino || p?.destinos_nombres || "Destino";
  const url = `/paquetes/${p?.codigoUrl}`;
  const rawType =
    Array.isArray(p?.mayoristas_tipos) && p.mayoristas_tipos.length > 0
      ? p.mayoristas_tipos[0]
      : p?.tipo_producto || p?.tipo;
  const badge = getBadgeConfig(rawType);
  // Ajustes condicionales si compact (mobile horizontal)
  const imgHeight = compact ? "h-40" : "h-48 sm:h-52 md:h-56 lg:h-60";
  return (
    <article
      className={`bg-white rounded-xl shadow-md ${compact ? "min-w-[250px] w-[250px] snap-start" : "shadow-lg"} hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-slate-100 group h-full flex flex-col transform-gpu`}
    >
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={img}
          alt={p?.titulo || destinoPrincipal}
          className={`w-full ${imgHeight} object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 80vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
          aria-hidden="true"
        ></div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {badge ? (
            <span
              className={`${badge.className} px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20`}
            >
              {badge.icon}
              {badge.label}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20">
              <FiCheckCircle className="w-3 h-3" aria-hidden="true" />
              Activo
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 shadow border border-white/30">
            <FiMapPin
              className="w-3.5 h-3.5 text-blue-600"
              aria-hidden="true"
            />
            {destinoPrincipal}
          </span>
        </div>
      </div>
      <div
        className={`p-4 ${compact ? "flex-1 flex flex-col" : "lg:p-5 flex-1 flex flex-col"}`}
      >
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 flex-1 min-h-[2.2rem]">
            {p?.titulo || "Paquete"}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wide">
              Desde
            </span>
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className="uppercase text-[10px] font-semibold tracking-wide text-slate-500">
                {moneda}
              </span>
              <div className="font-bold text-base text-blue-700 leading-tight">
                {precio || "—"}
              </div>
            </div>
          </div>
        </div>
        {!compact && (
          <div className="flex items-center text-slate-600 mb-3 text-xs sm:text-sm">
            <FiClock
              className="w-4 h-4 mr-1.5 text-slate-400 shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{duracion}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500 flex items-center max-w-[120px]">
            <FiMapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
            <span className="truncate">{destinoPrincipal}</span>
          </div>
          <Link
            to={url}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded flex items-center gap-1 group-hover:gap-1.5 transition-all"
            aria-label={`Ver detalles de ${p?.titulo || "paquete"}`}
          >
            Ver más
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}, areDestinationPropsEqual);

// Componente principal
const Destinations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Revelar todas las animaciones cuando la sección entra al viewport
  const [sectionRef, sectionVisible] = useSectionReveal({ threshold: 0.15 });

  // Limitar la cantidad de destinos visibles en la sección
  const MAX_VISIBLE = 3; // antes 8, ahora se muestran máximo 3 en Home
  const displayItems = items.slice(0, MAX_VISIBLE);
  const hasMore = items.length > MAX_VISIBLE;

  // Función para cargar datos reutilizable
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get("/paquetes/listado");
      const list = Array.isArray(data) ? data : [];
      const activos = list.filter((p) => p?.activo !== false);
      // Normalizar destinos legacy -> new y priorizar favoritos primero (estable)
      const normalized = activos.map((p, idx) => ({
        ...p,
        destinos: Array.isArray(p.destinos) ? p.destinos : [],
        __idx: idx,
      }));
      normalized.sort((a, b) => {
        if (!!b.favorito === !!a.favorito) return a.__idx - b.__idx;
        return b.favorito ? 1 : -1;
      });
      setItems(normalized.map(({ __idx, ...rest }) => rest));
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        "No se pudieron cargar los destinos. Intenta más tarde.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Componente de skeleton para reutilizar
  const DestinationCardSkeleton = ({ compact = false }) => (
    <article
      className={`relative overflow-hidden bg-white rounded-xl border border-slate-100 ${compact ? "" : "shadow-md"} motion-safe:animate-pulse h-full flex flex-col ${compact ? "min-w-[250px] w-[250px] snap-start" : ""} skeleton-shimmer`}
      aria-hidden="true"
    >
      <div
        className={`w-full ${compact ? "h-40" : "h-48 sm:h-52 md:h-56 lg:h-60"} bg-slate-200`}
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-5 w-14 bg-slate-200 rounded" />
        </div>
        {!compact && <div className="h-3 w-20 bg-slate-200 rounded mb-3" />}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-5 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    </article>
  );

  // Tarjeta especial para "Ver más destinos"
  const MoreDestinationsCard = ({ total, compact = false }) => (
    <Link
      to="/paquetes"
      aria-label="Ver todos los destinos"
      className={`relative ${compact ? "min-w-[250px] w-[250px] snap-start flex" : "hidden lg:flex"} bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-200/60 hover:border-blue-400/70 transition-all duration-500 group flex-col items-center justify-center min-h-full p-6 lg:p-8 text-center overflow-hidden shadow-[0_4px_18px_-4px_rgba(37,99,235,0.15)] hover:shadow-[0_10px_32px_-6px_rgba(37,99,235,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/40`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 opacity-80 group-hover:opacity-90 transition-opacity"></div>
      <div className="relative bg-gradient-to-br from-blue-100/70 to-indigo-100/70 p-4 lg:p-5 rounded-full mb-4 lg:mb-6 ring-1 ring-blue-200/60 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-500">
        <FiPlus className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600 group-hover:scale-110 group-hover:text-indigo-600 transition-transform duration-500" />
      </div>
      <h3 className="relative font-bold text-base lg:text-xl text-slate-800 mb-2 lg:mb-3 tracking-tight">
        Más destinos
      </h3>
      <p className="relative text-slate-600 text-xs lg:text-sm leading-relaxed mb-4 lg:mb-6 max-w-[200px] lg:max-w-[240px]">
        Descubre experiencias únicas ahora.
      </p>
      <span className="relative inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs lg:text-sm tracking-wide shadow hover:shadow-lg transition-all group-hover:from-blue-500 group-hover:to-indigo-500">
        Ver todos
        <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );

  return (
    <section
      ref={sectionRef}
      id="destinos"
      className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Título sección */}
        <AnimatedSection
          animation="fadeUpPremium"
          className="text-center mb-10 sm:mb-14 lg:mb-16"
          forceVisible={sectionVisible}
        >
          <p className="text-slate-600 font-semibold text-sm sm:text-base lg:text-lg uppercase tracking-wide mb-2 lg:mb-4">
            Destinos favoritos
          </p>
          <h2 className="font-volkhov font-bold text-2xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight">
            Explora nuestros destinos más populares
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 lg:mt-4 max-w-2xl mx-auto">
            Descubre lugares increíbles con nuestros paquetes todo incluido
          </p>
        </AnimatedSection>

        {error && (
          <div
            role="alert"
            className="mb-8 sm:mb-10 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-3">
              <FiAlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        )}

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {loading &&
            Array.from({ length: MAX_VISIBLE }).map((_, i) => (
              <DestinationCardSkeleton key={`skeleton-${i}`} />
            ))}
          {!loading &&
            displayItems.map((p, index) => (
              <AnimatedSection
                key={p.codigoUrl || p.titulo || index}
                animation="staggeredReveal"
                index={index}
                stagger={100}
                className="h-full will-change-transform"
                forceVisible={sectionVisible}
              >
                <DestinationCard p={p} />
              </AnimatedSection>
            ))}
          {!loading && hasMore && (
            <AnimatedSection
              animation="staggeredReveal"
              index={displayItems.length}
              stagger={100}
              className="h-full will-change-transform"
              forceVisible={sectionVisible}
            >
              <MoreDestinationsCard total={items.length} />
            </AnimatedSection>
          )}
        </div>

        {/* Mobile listado vertical ( <640px ) */}
        <div className="sm:hidden mt-2">
          <h3 className="text-slate-800 font-semibold text-lg mb-5">
            Top destinos
          </h3>
          <div className="space-y-5">
            {loading &&
              Array.from({ length: MAX_VISIBLE }).map((_, i) => (
                <DestinationCardSkeleton key={`mob-skeleton-${i}`} />
              ))}
            {!loading &&
              displayItems.map((p, i) => (
                <AnimatedSection
                  key={p.codigoUrl || p.titulo || i}
                  animation="fadeUpPremium"
                  delay={100 + i * 100}
                  forceVisible={sectionVisible}
                  className="will-change-transform"
                >
                  <DestinationCard p={p} />
                </AnimatedSection>
              ))}
          </div>
          {!loading && hasMore && (
            <div className="mt-8 text-center">
              <Link
                to="/paquetes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/40"
                aria-label="Ver todos los destinos disponibles"
              >
                Ver todos los destinos <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mensaje cuando no hay destinos */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16">
            <FiGlobe className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4 sm:mb-5" />
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-600 mb-2 sm:mb-3">
              No hay destinos disponibles
            </h3>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              Estamos trabajando en agregar nuevos destinos increíbles. ¡Vuelve
              pronto!
            </p>
          </div>
        )}

        {/* Botón ver más móviles (ahora sólo tablets >=640, se mantiene) */}
        <div className="hidden sm:block lg:hidden">
          {/* ...existing code... */}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
