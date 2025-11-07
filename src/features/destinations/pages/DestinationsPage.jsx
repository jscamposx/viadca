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
        icon: '<path d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>',
        viewBox: '0 0 512 512',
        gradient: 'from-amber-500 to-orange-600'
      };
    } else if (tipoLower.includes('paquete')) {
      return {
        label: 'Paquete',
        icon: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
        viewBox: '0 0 24 24',
        gradient: 'from-blue-500 to-indigo-600'
      };
    } else {
      return {
        label: tipo || 'Paquete',
        icon: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
        viewBox: '0 0 24 24',
        gradient: 'from-blue-500 to-indigo-600'
      };
    }
  };

  const tipoConfig = getTipoConfig(tipoPaquete);

  return (
    <article className="bg-white rounded-xl shadow-md shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-slate-100 group h-full flex flex-col transform-gpu">
      {/* Imagen del paquete */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || destinoPrincipal || "Paquete"}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 80vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
          aria-hidden="true"
        />
        
        {/* Badges superiores */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {tipoPaquete ? (
            <span
              className={`bg-gradient-to-r ${tipoConfig.gradient} text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20`}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox={tipoConfig.viewBox}
                className="w-3 h-3"
                aria-hidden="true"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={{ __html: tipoConfig.icon }}
              />
              {tipoConfig.label}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="w-3 h-3"
                aria-hidden="true"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg>
              Activo
            </span>
          )}
        </div>
        
        {/* Location badge - appears on hover */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 shadow border border-white/30">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-blue-600"
              aria-hidden="true"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {destinoPrincipal}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        {/* Título y precio */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 flex-1 min-h-[2.2rem]">
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

        {/* Duración */}
        {duracion && (
          <div className="flex items-center text-slate-600 mb-3 text-xs sm:text-sm">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-1.5 text-slate-400 shrink-0"
              aria-hidden="true"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="truncate">{duracion}</span>
          </div>
        )}

        {/* Footer - Location y CTA */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500 flex items-center max-w-[120px]">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 mr-1 text-blue-500"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="truncate">{destinoPrincipal}</span>
          </div>
          
          <Link 
            to={url}
            className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded flex items-center gap-1 group-hover:gap-1.5 transition-all"
            aria-label={`Ver detalles de ${paquete?.titulo || "Paquete"}`}
          >
            Ver más
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
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
      description: "Todos los viajes disponibles",
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
      
      {/* Panel de filtros fuera del PageTransition para evitar problemas de z-index */}
      <FiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={setFilters}
        initial={filters}
      />
      
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
          {/* Hero Section */}
          <DestinationsHero />
          
          {/* Barra de búsqueda - posición estática normal */}
          <div
            id="top-search"
            className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Barra de búsqueda */}
                <PackagesSearchBar
                  value={search}
                  onChange={setSearch}
                  onOpenFilters={() => setFiltersOpen(true)}
                />
                
                {/* Tabs de categorías */}
                <div className="rounded-xl border border-slate-200/60 bg-white/90 shadow-sm overflow-hidden">
                  <CategoryTabs
                    categories={categories}
                    current={activeCategory}
                    onChange={setActiveCategory}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full"
          >
            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse"
                  >
                    <div className="w-full h-64 bg-slate-200 rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading &&
              sections.map((section) => {
                const isDescuentos = section.key === "descuentos";
                return (
                  <div
                    key={section.key}
                    className={isDescuentos ? "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 rounded-2xl border-2 border-dashed border-orange-300 my-10 shadow-lg shadow-orange-100" : ""}
                  >
                    {isDescuentos && (
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl animate-pulse">
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
                    No hay viajes disponibles
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                    Actualmente no tenemos viajes que coincidan con tu búsqueda.
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
