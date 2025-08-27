import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
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

const DestinationCard = React.memo(function DestinationCard({ p }) {
  const img =
    p?.primera_imagen ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";
  const moneda = sanitizeMoneda(p?.moneda);
  const precio = formatPrecio(p?.precio_total, moneda);
  const duracion = p?.duracion_dias ? `${p.duracion_dias} días` : "";
  const destinoTxt = p?.destinos_nombres || "Destino";
  const url = `/paquetes/${p?.codigoUrl}`;

  // determinar tipo de producto desde varios posibles campos
  const rawType =
    Array.isArray(p?.mayoristas_tipos) && p.mayoristas_tipos.length > 0
      ? p.mayoristas_tipos[0]
      : p?.tipo_producto || p?.tipo;
  const badge = getBadgeConfig(rawType);

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100 group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={p?.titulo || destinoTxt}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        ></div>
        <div className="absolute top-3 right-3">
          {badge ? (
            <span className={`${badge.className} px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md`}>
              {badge.icon}
              {badge.label}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <FiCheckCircle className="w-3 h-3" aria-hidden="true" />
              Activo
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm">
            <FiMapPin className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            {destinoTxt}
          </span>
        </div>
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        {/* Cabecera responsiva para evitar choques entre título y precio */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-bold text-base lg:text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 flex-1 min-h-[2.5rem]">
            {p?.titulo || "Paquete"}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 block">Desde</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">{moneda}</span>
              <div className="font-bold text-lg text-blue-700 leading-tight">
                {precio || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Línea de detalle: duración o destino */}
        <div className="flex items-center text-slate-600 mb-4 text-sm">
          <FiClock className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{duracion}</span>
        </div>

        {/* Pie de tarjeta responsivo */}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center">
            <FiMapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
            <span className="truncate max-w-[120px]">{destinoTxt}</span>
          </div>
          <Link
            to={url}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded  flex items-center gap-1 group-hover:gap-1.5 transition-all"
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

  // Limitar la cantidad de destinos visibles en la sección
  const MAX_VISIBLE = 8;
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
      setItems(activos);
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
  const DestinationCardSkeleton = () => (
    <article
      className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 animate-pulse h-full flex flex-col"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 sm:h-52 md:h-56 lg:h-60 bg-slate-200" />
      </div>
      <div className="p-4 lg:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    </article>
  );

  // Tarjeta especial para "Ver más destinos"
  const MoreDestinationsCard = () => (
    <Link
      to="/paquetes"
      className="relative bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300 hover:bg-blue-50 group flex flex-col items-center justify-center min-h-full p-6 text-center"
    >
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full mb-5 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
        <FiPlus className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
      </div>
      <h3 className="font-bold text-lg text-slate-700 mb-2">
        Explorar más destinos
      </h3>
      <p className="text-slate-600 text-sm mb-5 max-w-[180px]">
        Descubre todos nuestros destinos disponibles alrededor del mundo
      </p>
      <span className="inline-flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
        Ver todos
        <FiArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );

  return (
    <section
      id="destinos"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Título de la sección - Manteniendo el estilo original pero mejorado */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-14 lg:mb-16">
          <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
            Destinos favoritos
          </p>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight">
            Explora nuestros destinos más populares
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Descubre lugares increíbles con nuestros paquetes todo incluido
          </p>
        </AnimatedSection>

        {error && (
          <div
            role="alert"
            className="mb-10 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col items-center"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <DestinationCardSkeleton key={`skeleton-${i}`} />
            ))}

          {!loading &&
            displayItems.map((p, index) => (
              <AnimatedSection
                key={p.codigoUrl || p.titulo || index}
                animation="fadeInUp"
                delay={index * 120}
                className="h-full"
              >
                <DestinationCard p={p} />
              </AnimatedSection>
            ))}

          {!loading && hasMore && (
            <AnimatedSection
              animation="fadeInUp"
              delay={displayItems.length * 120}
              className="h-full"
            >
              <MoreDestinationsCard />
            </AnimatedSection>
          )}
        </div>

        {/* Mensaje cuando no hay destinos */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-16">
            <FiGlobe className="w-20 h-20 text-slate-300 mx-auto mb-5" />
            <h3 className="text-2xl font-semibold text-slate-600 mb-3">
              No hay destinos disponibles
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Estamos trabajando en agregar nuevos destinos increíbles. ¡Vuelve pronto!
            </p>
          </div>
        )}

        {/* Botón para ver más (solo en móviles) */}
        {!loading && hasMore && (
          <div className="mt-12 text-center lg:hidden">
            <Link
              to="/paquetes"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Ver todos los destinos
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Destinations;