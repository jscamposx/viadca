import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import DestinationsHero from "../components/DestinationsHero";
import PackagesSearchBar from "../components/PackagesSearchBar";
import PackagesSection from "../components/PackagesSection";
// import { getPaquetesPublic         <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-x-hidden [contain:paint]"> from '../../../api/packagesService';
import apiClient from "../../../api/axiosConfig";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import PageTransition from "../../../components/ui/PageTransition";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import { Link } from "react-router-dom";
import FiltersPanel from "../components/FiltersPanel";
import CategoryTabs from "../components/CategoryTabs";
// import AlphaIndex from '../components/AlphaIndex'; // Eliminado: ya no agrupamos por letra
import UnifiedNav from "../../../components/layout/UnifiedNav";
import Footer from "../../home/components/Footer";
import { useContactInfo } from "../../../hooks/useContactInfo";
import { useAuth } from "../../../contexts/AuthContext";
import { FiArrowRight, FiClock, FiMapPin } from "react-icons/fi";

const PackageCard = ({ paquete }) => {
  const img =
    paquete?.primera_imagen ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop";
  const moneda = sanitizeMoneda(paquete?.moneda);
  const precio = formatPrecio(paquete?.precio_total, moneda);
  const personasValue = parseInt(paquete?.personas, 10);
  const personasValidas = !isNaN(personasValue) && personasValue > 0;
  const precioPorPersona =
    personasValidas && paquete?.precio_total
      ? formatPrecio(
          (parseFloat(paquete?.precio_total) || 0) / personasValue,
          moneda,
        )
      : null;
  const url = `/paquetes/${paquete?.codigoUrl}`;
  // Nuevo formato Estado, Ciudad
  const firstDest =
    Array.isArray(paquete?.destinos) && paquete.destinos.length > 0
      ? paquete.destinos[0]
      : null;
  const buildDestinoPrincipal = () => {
    let estado = "";
    let ciudad = "";
    let pais = "";
    if (firstDest) {
      estado = (firstDest.estado || "").trim();
      ciudad = (firstDest.ciudad || firstDest.destino || "").trim();
      pais = (firstDest.pais || "").trim();
    } else {
      // Fallback a campos root (compatibilidad versiones anteriores)
      estado = (paquete?.destino_estado || "").trim();
      ciudad = (paquete?.destino_ciudad || paquete?.destino || "").trim();
      pais = (paquete?.destino_pais || "").trim();
    }
    if (estado && ciudad && estado.toLowerCase() !== ciudad.toLowerCase())
      return `${estado}, ${ciudad}`;
    if (estado) return estado;
    if (ciudad) return ciudad;
    if (pais) return pais;
    return paquete?.destino || paquete?.destinos_nombres || "Destino";
  };
  const destinoPrincipal =
    buildDestinoPrincipal() ||
    paquete?.destino ||
    paquete?.destinos_nombres ||
    "Destino";
  const duracion = paquete?.duracion_dias
    ? `${paquete.duracion_dias} días`
    : paquete?.duracion_noches
      ? `${paquete.duracion_noches} noches`
      : paquete?.duracion_texto || paquete?.duracion || "";
  const hasDescuento = paquete?.precio_descuento || paquete?.en_oferta;
  
  // Obtener tipo de paquete
  const tipoPaquete = (
    paquete?.tipo_producto ||
    paquete?.tipo ||
    (paquete.mayoristas_tipos && paquete.mayoristas_tipos[0]) ||
    ""
  ).trim();

  // Configuración de iconos y colores por tipo
  const getTipoConfig = (tipo) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('circuito')) {
      return {
        label: 'Circuito',
        icon: '<path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>',
        gradient: 'from-emerald-500 to-teal-600'
      };
    } else if (tipoLower.includes('paquete')) {
      return {
        label: 'Paquete',
        icon: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
        gradient: 'from-blue-500 to-indigo-600'
      };
    } else if (tipoLower.includes('hotel')) {
      return {
        label: 'Hotel',
        icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        gradient: 'from-pink-500 to-rose-600'
      };
    } else if (tipoLower.includes('vuelo')) {
      return {
        label: 'Vuelo',
        icon: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>',
        gradient: 'from-sky-500 to-blue-600'
      };
    } else if (tipoLower.includes('crucero')) {
      return {
        label: 'Crucero',
        icon: '<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"></path><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"></path><path d="M12 10v4"></path><path d="M12 2v3"></path>',
        gradient: 'from-cyan-500 to-blue-600'
      };
    } else if (tipoLower.includes('combinado')) {
      return {
        label: 'Combinado',
        icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
        gradient: 'from-purple-500 to-violet-600'
      };
    } else if (tipoLower.includes('excursión') || tipoLower.includes('excursion')) {
      return {
        label: 'Excursión',
        icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
        gradient: 'from-amber-500 to-orange-600'
      };
    } else if (tipoLower.includes('traslado')) {
      return {
        label: 'Traslado',
        icon: '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
        gradient: 'from-slate-500 to-gray-600'
      };
    } else {
      return {
        label: tipo || 'Paquete',
        icon: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
        gradient: 'from-blue-500 to-indigo-600'
      };
    }
  };

  const tipoConfig = getTipoConfig(tipoPaquete);

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-slate-100 package-card h-full flex flex-col transform-gpu">
      <div className="relative overflow-hidden package-card-image-wrapper">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || destinoPrincipal || "Paquete"}
          className="package-card-image w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 80vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        <div
          className="package-card-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-all duration-500"
          aria-hidden="true"
        />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
          {hasDescuento && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20 animate-pulse">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              OFERTA
            </span>
          )}
          {tipoPaquete && (
            <span
              className={`bg-gradient-to-r ${tipoConfig.gradient} text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: tipoConfig.icon }}
              />
              {tipoConfig.label}
            </span>
          )}
        </div>
        <div className="package-card-location absolute bottom-3 left-3 opacity-0 transition-all duration-500 transform translate-y-2 z-20">
          <span className="bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/40">
            <FiMapPin className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            {destinoPrincipal}
          </span>
        </div>
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="package-card-title font-bold text-sm sm:text-base lg:text-lg text-slate-800 transition-colors leading-snug line-clamp-2 flex-1 min-h-[2.2rem]">
            {paquete?.titulo || "Paquete"}
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
        {duracion && (
          <div className="flex items-center text-slate-600 mb-3 text-xs sm:text-sm">
            <FiClock className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{duracion}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500 flex items-center max-w-[140px]">
            <FiMapPin className="w-3.5 h-3.5 mr-1 text-blue-500" aria-hidden="true" />
            <span className="truncate">{destinoPrincipal}</span>
          </div>
          <Link
            to={url}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded flex items-center gap-1 group-hover:gap-1.5 transition-all"
            aria-label={`Ver detalles de ${paquete?.titulo || "paquete"}`}
          >
            Ver más
            <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const DestinationsPage = () => {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeCategory, setActiveCategory] = useState("todos");
  const hasFetched = useRef(false); // evita doble carga StrictMode

  const categories = useMemo(
    () => [
      { label: "Todos", value: "todos" },
      { label: "Ofertas", value: "ofertas" },
      { label: "Populares", value: "populares" },
      { label: "Larga duración", value: "larga" },
      { label: "Cortos", value: "cortos" },
    ],
    [],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // SIEMPRE usar /paquetes/listado (solo públicos, no requiere login)
      const { data: resp } = await apiClient.get("/paquetes/listado");
      
      const items = Array.isArray(resp?.data)
        ? resp.data
        : Array.isArray(resp)
          ? resp
          : [];
      setData(items);
    } catch (e) {
      setError(e?.response?.data?.message || "Error cargando paquetes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadData();
  }, []); // Solo cargar una vez al montar

  // Filtrado base (ahora todo en cliente, incluye búsqueda local)
  const filteredData = useMemo(() => {
    let base = [...data];
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter((p) => {
        const titulo = (p?.titulo || "").toLowerCase();
        const legacy = (p?.destino || p?.destinos_nombres || "").toLowerCase();
        const destinosTxt = Array.isArray(p?.destinos)
          ? p.destinos
              .map((d) =>
                `${d.estado || ""} ${d.ciudad || d.destino || ""} ${d.pais || ""}`.toLowerCase(),
              )
              .join(" ")
          : "";
        return (
          titulo.includes(q) || legacy.includes(q) || destinosTxt.includes(q)
        );
      });
    }
    if (filters.minPrecio)
      base = base.filter(
        (p) => Number(p.precio_total) >= Number(filters.minPrecio),
      );
    if (filters.maxPrecio)
      base = base.filter(
        (p) => Number(p.precio_total) <= Number(filters.maxPrecio),
      );
    if (filters.minDuracion)
      base = base.filter(
        (p) => Number(p.duracion_dias || 0) >= Number(filters.minDuracion),
      );
    if (filters.maxDuracion)
      base = base.filter(
        (p) => Number(p.duracion_dias || 0) <= Number(filters.maxDuracion),
      );
    if (filters.tipos?.length) {
      base = base.filter((p) => {
        const tipo = (
          p?.tipo_producto ||
          p?.tipo ||
          (p.mayoristas_tipos && p.mayoristas_tipos[0]) ||
          ""
        ).toLowerCase();
        return filters.tipos.some((t) => tipo.includes(t.toLowerCase()));
      });
    }
    if (filters.continentes?.length) {
      base = base.filter((p) => filters.continentes.includes(p?.continente));
    }
    switch (activeCategory) {
      case "larga":
        base = base.filter((p) => (p.duracion_dias || 0) >= 10);
        break;
      case "cortos":
        base = base.filter(
          (p) => (p.duracion_dias || 0) > 0 && (p.duracion_dias || 0) <= 5,
        );
        break;
      case "populares":
        base = base
          .slice()
          .sort((a, b) => (b?.reservas || 0) - (a?.reservas || 0));
        break;
      case "ofertas":
        base = base.filter((p) => p?.precio_descuento || p?.en_oferta);
        break;
      default:
        break;
    }
    return base;
  }, [data, filters, activeCategory, search]);

  // Helper para extraer país robustamente
  const getCountry = (p) => {
    const tryStr = (val) => (val && typeof val === "string" ? val.trim() : "");
    const d0 = p?.destinos?.[0] || {};
    const explicit = tryStr(d0.pais || p?.destino_pais);
    if (explicit) return explicit;
    // Buscar en otros destinos
    const other = (p?.destinos || []).map((d) => tryStr(d.pais)).find(Boolean);
    if (other) return other;
    // Intentar parsear destinos_nombres -> tomar última parte si contiene coma
    const nombres = tryStr(p?.destinos_nombres);
    if (nombres.includes(",")) {
      const parts = nombres
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length) return parts[parts.length - 1];
    }
    return "Otros";
  };

  // Construir secciones: Favoritos, Descuentos, Internacionales, México, Todos
  const sections = useMemo(() => {
    const favoritos = filteredData.filter((p) => !!p.favorito);
    const descuentos = filteredData.filter((p) => p?.precio_descuento || p?.en_oferta);
    const mexicoNames = ["mexico", "méxico", "méjico"];
    const internacionales = filteredData.filter(
      (p) => !mexicoNames.includes((getCountry(p) || "").toLowerCase()),
    );
    const mexico = filteredData.filter(
      (p) => mexicoNames.includes((getCountry(p) || "").toLowerCase()),
    );
    const todos = filteredData;

    const list = [];
    // Orden solicitado: Favoritos, Descuentos (si existen), Internacionales, México, Todos
    if (favoritos.length) {
      list.push({
        key: "favoritos",
        title: "Favoritos",
        description: "Paquetes destacados por el equipo",
        items: favoritos,
      });
    }
    // Descuentos solo si existen (no debe estar en navbar)
    if (descuentos.length) {
      list.push({
        key: "descuentos",
        title: "Descuentos",
        description: "¡Aprovecha estas ofertas especiales!",
        items: descuentos,
        hideFromNav: true, // No aparece en navbar
      });
    }
    if (internacionales.length) {
      list.push({
        key: "internacionales",
        title: "Internacionales",
        description: "Descubre destinos alrededor del mundo",
        items: internacionales,
      });
    }
    if (mexico.length) {
      list.push({
        key: "mexico",
        title: "México",
        description: "Explora la belleza de nuestro país",
        items: mexico,
      });
    }
    list.push({
      key: "todos",
      title: "Todos",
      description: "Todos los paquetes disponibles",
      items: todos,
    });
    return list;
  }, [filteredData]);

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Navbar fija fuera de la animación para que no se vea afectada por transform del PageTransition */}
      <UnifiedNav
        transparentOnTop
        showScrollProgress
        sectionLinks={
          // Filtrar secciones que no tienen hideFromNav
          sections
            .filter(s => !s.hideFromNav)
            .map(s => ({ id: s.key, label: s.title }))
        }
      />
      <PageTransition>
  <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden [contain:paint]">
          {/* removido id=top */}
          <DestinationsHero />
          {/* Anchor para scroll desde el botón "Buscar paquetes" del hero */}
          <div
            id="top-search"
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-4 md:-mt-6 lg:-mt-10 relative z-10 space-y-4 sm:space-y-6 scroll-mt-28"
            style={{
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
          >
            <PackagesSearchBar
              value={search}
              onChange={setSearch}
              onOpenFilters={() => setFiltersOpen(true)}
            />
            <CategoryTabs
              categories={categories}
              current={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
          {/* Eliminado AlphaIndex */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 flex-1 w-full">
            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 bg-white rounded-xl border border-slate-100"
                  />
                ))}
              </div>
            )}

            {!loading &&
              sections.map((section) => {
                const isDescuentos = section.key === "descuentos";
                return (
                  <div
                    key={section.key}
                    className={isDescuentos ? "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 rounded-2xl border-2 border-dashed border-orange-300 my-8 shadow-lg shadow-orange-100" : ""}
                  >
                    {isDescuentos && (
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          ¡OFERTAS ESPECIALES!
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <PackagesSection
                      id={section.key}
                      title={section.title}
                      description={section.description}
                      carousel={section.key !== "todos" && section.items.length > 1}
                      progressive={section.key === "todos"}
                      initialCount={12}
                      step={8}
                    >
                      {section.items.map((p, i) => (
                        <AnimatedSection
                          key={p.codigoUrl || p.id || i}
                          animation="destCard"
                          index={i}
                          stagger={70}
                          className="h-full"
                        >
                          <PackageCard paquete={p} />
                        </AnimatedSection>
                      ))}
                    </PackagesSection>
                  </div>
                );
              })}

            {!loading && !sections.length && !error && (
              <AnimatedSection animation="fadeInUp" delay={100}>
                <div className="max-w-2xl mx-auto text-center py-16 sm:py-24 px-4">
                  {/* Ilustración */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                      <svg 
                        className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    </div>
                    {/* Decoración flotante */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
                      <div className="animate-bounce-slow">
                        <svg className="w-8 h-8 text-blue-300 opacity-50 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <h2 className="font-volkhov text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    No hay paquetes disponibles
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                    Actualmente no tenemos paquetes que coincidan con tu búsqueda.
                    <br className="hidden sm:block" />
                    Intenta ajustar los filtros o contáctanos para opciones personalizadas.
                  </p>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                    <button
                      onClick={() => {
                        setSearch("");
                        setFilters({});
                        setActiveCategory("todos");
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Limpiar filtros
                    </button>
                    
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Volver al inicio
                    </Link>
                  </div>

                  {/* Información de contacto */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                      ¿Buscas algo específico?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
                      <a
                        href={contactInfo?.whatsapp ? `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}` : '#'}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Contáctanos por WhatsApp
                      </a>
                      {contactInfo?.telefono && (
                        <>
                          <span className="hidden sm:inline text-gray-300">|</span>
                          <a
                            href={`tel:${contactInfo.telefono}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {contactInfo.telefono}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          <FiltersPanel
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            onApply={setFilters}
            initial={filters}
          />
          <Footer
            contactInfo={contactInfo}
            contactLoading={contactLoading}
            currentYear={currentYear}
          />
          {/* Botón flotante volver arriba */}
          <ScrollTopButton />
        </div>
      </PageTransition>
    </>
  );
};

// Botón flotante para volver arriba
const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const btn = (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className={`fixed bottom-6 right-4 sm:right-6 z-[100000] inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"} bg-white/95 border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white`}
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
          d="M5 15l7-7 7 7"
        />
      </svg>
      <span className="text-sm font-medium hidden sm:inline">Arriba</span>
    </button>
  );
  return createPortal(btn, document.body);
};

export default DestinationsPage;
