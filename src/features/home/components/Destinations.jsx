import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
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
} from "react-icons/fi";
import { FaShip, FaRoute } from "react-icons/fa";

// Helpers y tarjeta memoizados a nivel de módulo para evitar recreaciones por render
const getBadgeConfig = (rawType) => {
  const key = typeof rawType === "string" ? rawType.trim().toLowerCase() : null;
  const base = {
    label: rawType || "Activo",
    className: "bg-green-700 text-white",
    icon: <FiCheckCircle className="w-3 h-3" aria-hidden="true" />,
  };
  const map = {
    circuito: {
      label: "Circuito",
      className: "bg-amber-600 text-white",
      icon: <FaRoute className="w-3 h-3" aria-hidden="true" />,
    },
    paquete: {
      label: "Paquete",
      className: "bg-blue-600 text-white",
      icon: <FiPackage className="w-3 h-3" aria-hidden="true" />,
    },
    hotel: {
      label: "Hotel",
      className: "bg-rose-600 text-white",
      icon: <FiHome className="w-3 h-3" aria-hidden="true" />,
    },
    vuelo: {
      label: "Vuelo",
      className: "bg-sky-600 text-white",
      icon: <FiSend className="w-3 h-3" aria-hidden="true" />,
    },
    traslado: {
      label: "Traslado",
      className: "bg-teal-600 text-white",
      icon: <FiTruck className="w-3 h-3" aria-hidden="true" />,
    },
    excursion: {
      label: "Excursión",
      className: "bg-emerald-600 text-white",
      icon: <FiMapPin className="w-3 h-3" aria-hidden="true" />,
    },
    combinado: {
      label: "Combinado",
      className: "bg-purple-600 text-white",
      icon: <FiLayers className="w-3 h-3" aria-hidden="true" />,
    },
    crucero: {
      label: "Crucero",
      className: "bg-indigo-600 text-white",
      icon: <FaShip className="w-3 h-3" aria-hidden="true" />,
    },
  };
  if (!key) return base;
  if (map[key]) return map[key];
  return {
    label: rawType,
    className: "bg-slate-700 text-white",
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
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-blue-100 hover:border-blue-300 group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={p?.titulo || destinoTxt}
          className="w-full h-44 sm:h-52 md:h-56 lg:h-60 xl:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        ></div>
        <div className="absolute top-4 right-4">
          {badge ? (
            <span className={`${badge.className} px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1`}>
              {badge.icon}
              {badge.label}
            </span>
          ) : (
            <span className="bg-green-700 text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
              <FiCheckCircle className="w-3 h-3" aria-hidden="true" />
              Activo
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
            <FiMapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
            {destinoTxt}
          </span>
        </div>
      </div>
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        {/* Cabecera responsiva para evitar choques entre título y precio */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start gap-3 mb-3">
          <h3 className="font-semibold text-lg lg:text-xl text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 xl:line-clamp-3 min-h-[2.75rem] sm:min-h-[3.25rem] xl:min-h-[4.5rem]">
            {p?.titulo || "Paquete"}
          </h3>
          <div className="sm:text-right sm:min-w-[120px] shrink-0">
            <span className="text-xs sm:text-sm text-slate-500 block">Desde</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5 justify-start sm:justify-end flex-wrap">
              <span className="uppercase text-[11px] sm:text-xs font-semibold tracking-wide text-slate-500">{moneda}</span>
              <div className="font-bold text-lg sm:text-xl lg:text-2xl text-green-700 leading-tight">
                {precio || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Línea de detalle: duración o destino, con altura mínima para estabilidad */}
        <div className="flex items-center text-slate-600 mb-4 min-h-[1.25rem]">
          <FiMapPin className="w-4 h-4 mr-2 text-blue-500 shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm truncate">{duracion || destinoTxt}</span>
        </div>

        {/* Pie de tarjeta responsivo */}
        <div className="mt-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500 gap-y-2 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1">
              <FiSend className="w-3 h-3" aria-hidden="true" />
              Vuelos
            </span>
            <span className="inline-flex items-center gap-1">
              <FiHome className="w-3 h-3" aria-hidden="true" />
              Hotel 4★
            </span>
          </div>
          <Link
            to={url}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded transition-colors md:ml-2 shrink-0 whitespace-nowrap"
            aria-label={`Ver detalles de ${p?.titulo || "paquete"}`}
          >
            Ver detalles →
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
  const MAX_VISIBLE = 3;
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
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 animate-pulse"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 sm:h-56 lg:h-64 bg-slate-200" />
      </div>
      <div className="p-5 lg:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="h-6 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </article>
  );

  // Tarjeta especial para "Ver más destinos" - Versión transparente
  const MoreDestinationsCard = () => (
    <Link
      to="/paquetes"
      className="relative bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300 hover:bg-white/70 group flex flex-col items-center justify-center min-h-[340px] sm:min-h-[360px] lg:min-h-[380px] p-6 text-center"
    >
      {/* Efecto de borde en hover */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 group-hover:animate-pulse transition-all duration-300"
        aria-hidden="true"
      ></div>

      {/* Contenido de la tarjeta */}
      <div className="bg-blue-100/50 p-4 rounded-full mb-6 group-hover:bg-blue-200/70 transition-colors duration-300">
        <FiPlus className="w-10 h-10 text-blue-600/80 group-hover:text-blue-700" />
      </div>
      <h3 className="font-bold text-xl text-slate-700 mb-3">
        Ver más destinos
      </h3>
      <p className="text-slate-600/80 mb-6 max-w-[200px]">
        Descubre todos nuestros destinos disponibles
      </p>
    </Link>
  );

  return (
    <section
      id="destinos"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
            Destinos favoritos
          </p>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight">
            Explora nuestros destinos más populares
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Descubre lugares increíbles con nuestros paquetes todo incluido
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col items-center"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {loading &&
            [0, 1, 2, 3].map((i) =>
              i < 3 ? (
                <DestinationCardSkeleton key={`skeleton-${i}`} />
              ) : (
                <div key={`skeleton-3`} className="hidden lg:block">
                  <div className="bg-white/50 rounded-2xl border-2 border-dashed border-blue-200 h-full min-h-[380px] animate-pulse flex flex-col items-center justify-center p-6">
                    <div className="h-16 w-16 bg-blue-100/50 rounded-full mb-6"></div>
                    <div className="h-6 w-40 bg-blue-100/50 rounded mb-3"></div>
                    <div className="h-4 w-32 bg-blue-100/50 rounded mb-6"></div>
                    <div className="h-12 w-36 bg-blue-100/50 rounded"></div>
                  </div>
                </div>
              ),
            )}

          {!loading &&
            displayItems.map((p) => (
              <DestinationCard key={p.codigoUrl || p.titulo} p={p} />
            ))}

          {!loading && hasMore && <MoreDestinationsCard />}
        </div>

        {/* Mensaje cuando no hay destinos */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-12">
            <FiGlobe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No hay destinos disponibles
            </h3>
            <p className="text-slate-500">
              Pronto agregaremos nuevos destinos para ti.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
