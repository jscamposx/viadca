import React, { useEffect, useState, useMemo, useRef } from 'react';
import DestinationsHero from '../components/DestinationsHero';
import PackagesSearchBar from '../components/PackagesSearchBar';
import PackagesSection from '../components/PackagesSection';
// import { getPaquetesPublic } from '../../../api/packagesService';
import apiClient from '../../../api/axiosConfig';
import OptimizedImage from '../../../components/ui/OptimizedImage';
import { formatPrecio, sanitizeMoneda } from '../../../utils/priceUtils';
import PageTransition from '../../../components/ui/PageTransition';
import { AnimatedSection } from '../../../hooks/scrollAnimations';
import { Link } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel';
import CategoryTabs from '../components/CategoryTabs';
// import AlphaIndex from '../components/AlphaIndex'; // Eliminado: ya no agrupamos por letra
import TransparentNav from '../../../components/layout/TransparentNav';
import Footer from '../../home/components/Footer';
import { useContactInfo } from '../../../hooks/useContactInfo';

const PackageCard = ({ paquete }) => {
  const img = paquete?.primera_imagen || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop';
  const moneda = sanitizeMoneda(paquete?.moneda);
  const precio = formatPrecio(paquete?.precio_total, moneda);
  const url = `/paquetes/${paquete?.codigoUrl}`;
  // Nuevo formato Estado, Ciudad
  const firstDest = Array.isArray(paquete?.destinos) && paquete.destinos.length > 0 ? paquete.destinos[0] : null;
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
    if (estado && ciudad && estado.toLowerCase() !== ciudad.toLowerCase()) return `${estado}, ${ciudad}`;
    if (estado) return estado;
    if (ciudad) return ciudad;
    if (pais) return pais;
    return paquete?.destino || paquete?.destinos_nombres || 'Destino';
  };
  const destinoPrincipal = buildDestinoPrincipal() || paquete?.destino || paquete?.destinos_nombres || 'Destino';
  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-slate-100 group h-full flex flex-col relative">
      <div className="relative">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || destinoPrincipal || 'Paquete'}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        {/* Overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition duration-500" />
        {/* Destino siempre visible */}
        <div className="absolute bottom-3 left-3 right-3 transition-all duration-500">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg text-xs font-medium shadow-lg inline-flex items-center gap-2 border border-white/40 w-auto max-w-full">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-6-6-9-6-11a6 6 0 1112 0c0 2-1.5 5-6 11z" /></svg>
            <span className="truncate max-w-[140px] md:max-w-[180px] lg:max-w-[220px]" title={destinoPrincipal}>{destinoPrincipal}</span>
          </span>
        </div>
      </div>
      <div className="p-4 lg:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-bold text-base lg:text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 flex-1 min-h-[2.5rem]">
            {paquete?.titulo || 'Paquete'}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 block">Desde</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="uppercase text-xs font-semibold tracking-wide text-slate-500">{moneda}</span>
              <div className="font-bold text-lg text-blue-700 leading-tight">{precio || '—'}</div>
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center">
            <span className="truncate max-w-[120px]" title={destinoPrincipal}>{destinoPrincipal}</span>
          </div>
            <Link to={url} className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline flex items-center gap-1 transition-colors">
              Ver más
            </Link>
        </div>
      </div>
    </article>
  );
};

const DestinationsPage = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeCategory, setActiveCategory] = useState('todos');
  const hasFetched = useRef(false); // evita doble carga StrictMode

  const categories = useMemo(() => ([
    { label: 'Todos', value: 'todos' },
    { label: 'Ofertas', value: 'ofertas' },
    { label: 'Populares', value: 'populares' },
    { label: 'Larga duración', value: 'larga' },
    { label: 'Cortos', value: 'cortos' },
  ]), []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: resp } = await apiClient.get('/paquetes/listado');
      const items = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
      setData(items);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error cargando paquetes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadData();
  }, []);

  // Filtrado base (ahora todo en cliente, incluye búsqueda local)
  const filteredData = useMemo(() => {
    let base = [...data];
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter(p => {
        const titulo = (p?.titulo || '').toLowerCase();
        const legacy = (p?.destino || p?.destinos_nombres || '').toLowerCase();
        const destinosTxt = Array.isArray(p?.destinos) ? p.destinos.map(d => `${d.estado||''} ${d.ciudad||d.destino||''} ${d.pais||''}`.toLowerCase()).join(' ') : '';
        return titulo.includes(q) || legacy.includes(q) || destinosTxt.includes(q);
      });
    }
    if (filters.minPrecio) base = base.filter(p => Number(p.precio_total) >= Number(filters.minPrecio));
    if (filters.maxPrecio) base = base.filter(p => Number(p.precio_total) <= Number(filters.maxPrecio));
    if (filters.minDuracion) base = base.filter(p => Number(p.duracion_dias||0) >= Number(filters.minDuracion));
    if (filters.maxDuracion) base = base.filter(p => Number(p.duracion_dias||0) <= Number(filters.maxDuracion));
    if (filters.tipos?.length) {
      base = base.filter(p => {
        const tipo = (p?.tipo_producto || p?.tipo || (p.mayoristas_tipos && p.mayoristas_tipos[0]) || '').toLowerCase();
        return filters.tipos.some(t => tipo.includes(t.toLowerCase()));
      });
    }
    if (filters.continentes?.length) {
      base = base.filter(p => filters.continentes.includes(p?.continente));
    }
    switch (activeCategory) {
      case 'larga': base = base.filter(p => (p.duracion_dias||0) >= 10); break;
      case 'cortos': base = base.filter(p => (p.duracion_dias||0) > 0 && (p.duracion_dias||0) <= 5); break;
      case 'populares': base = base.slice().sort((a,b)=> (b?.reservas||0) - (a?.reservas||0)); break;
      case 'ofertas': base = base.filter(p => p?.precio_descuento || p?.en_oferta); break;
      default: break;
    }
    return base;
  }, [data, filters, activeCategory, search]);

  // Helper para extraer país robustamente
  const getCountry = (p) => {
    const tryStr = (val) => (val && typeof val === 'string' ? val.trim() : '');
    const d0 = p?.destinos?.[0] || {};
    const explicit = tryStr(d0.pais || p?.destino_pais);
    if (explicit) return explicit;
    // Buscar en otros destinos
    const other = (p?.destinos || []).map(d=> tryStr(d.pais)).find(Boolean);
    if (other) return other;
    // Intentar parsear destinos_nombres -> tomar última parte si contiene coma
    const nombres = tryStr(p?.destinos_nombres);
    if (nombres.includes(',')) {
      const parts = nombres.split(',').map(s=>s.trim()).filter(Boolean);
      if (parts.length) return parts[parts.length-1];
    }
    return 'Otros';
  };

  // Construir secciones: Favoritos + País
  const sections = useMemo(() => {
    const favoritos = filteredData.filter(p => !!p.favorito);
    const resto = filteredData.filter(p => !p.favorito);
    const countryMap = new Map();
    resto.forEach(p => {
      const country = getCountry(p) || 'Otros';
      if (!countryMap.has(country)) countryMap.set(country, []);
      countryMap.get(country).push(p);
    });

    const countrySections = Array.from(countryMap.entries())
      .sort((a,b)=> a[0].localeCompare(b[0]))
      .map(([country, items]) => ({ key: `country-${country}`, title: country, description: `Paquetes para ${country}`, items }));

    const finalSections = [];
    if (favoritos.length) {
      finalSections.push({ key: 'favoritos', title: 'Nuestros favoritos', description: 'Paquetes destacados por el equipo', items: favoritos });
    }
    return [...finalSections, ...countrySections];
  }, [filteredData]);

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const currentYear = new Date().getFullYear();

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">{/* removido id=top */}
        <TransparentNav />
        <DestinationsHero />
        {/* removido anchor top-search */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 space-y-6">
          <PackagesSearchBar value={search} onChange={setSearch} onOpenFilters={() => setFiltersOpen(true)} />
          <CategoryTabs categories={categories} current={activeCategory} onChange={setActiveCategory} />
        </div>
        {/* Eliminado AlphaIndex */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex-1 w-full">
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7 animate-pulse">
              {Array.from({ length: 8 }).map((_,i) => (
                <div key={i} className="h-72 bg-white rounded-xl border border-slate-100" />
              ))}
            </div>
          )}

          {!loading && sections.map(section => (
            <PackagesSection key={section.key} id={section.key} title={section.title} description={section.description} carousel={section.items.length > 6}>
              {section.items.map((p,i) => (
                <AnimatedSection key={p.codigoUrl || p.id || i} animation="destCard" index={i} stagger={70} className="h-full">
                  <PackageCard paquete={p} />
                </AnimatedSection>
              ))}
            </PackagesSection>
          ))}

          {!loading && !sections.length && !error && (
            <div className="text-center py-24 text-slate-500">No se encontraron resultados</div>
          )}

        </div>

        <FiltersPanel
          open={filtersOpen}
          onClose={()=>setFiltersOpen(false)}
          onApply={setFilters}
          initial={filters}
        />
        <Footer contactInfo={contactInfo} contactLoading={contactLoading} currentYear={currentYear} />
      </div>
    </PageTransition>
  );
};

export default DestinationsPage;
