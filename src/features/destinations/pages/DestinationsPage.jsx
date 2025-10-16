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
  const isActivo = paquete?.activo !== false;
  const hasDescuento = paquete?.precio_descuento || paquete?.en_oferta;
  const statusLabel = isActivo ? "Activo" : "No disponible";
  const statusClasses = isActivo
    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
    : "bg-gradient-to-r from-slate-500 to-gray-600 text-white";

  return (
    <article className="bg-white rounded-xl shadow-md md:shadow-lg md:hover:shadow-xl md:hover:shadow-blue-500/10 transition-all duration-500 md:hover:-translate-y-2 md:hover:scale-[1.02] overflow-hidden border border-slate-100 group h-full flex flex-col transform-gpu">
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || destinoPrincipal || "Paquete"}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover md:group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 80vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-500"
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
          <span
            className={`${statusClasses} px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/20`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-2 md:group-hover:translate-y-0 z-20">
          <span className="bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-white/40">
            <FiMapPin className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            {destinoPrincipal}
          </span>
        </div>
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
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
      
      // Usar el endpoint correcto según autenticación
      const endpoint = isAuthenticated ? "/paquetes/mis-paquetes" : "/paquetes/listado";
      const { data: resp } = await apiClient.get(endpoint);
      
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
  }, [isAuthenticated]); // Recargar cuando cambie el estado de autenticación

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
              <div className="text-center py-24 text-slate-500">
                No se encontraron resultados
              </div>
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
