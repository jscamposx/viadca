import React, { useEffect, useState, useMemo } from 'react';
import DestinationsHero from '../components/DestinationsHero';
import PackagesSearchBar from '../components/PackagesSearchBar';
import PackagesSection from '../components/PackagesSection';
import { getPaquetes } from '../../../api/packagesService';
import OptimizedImage from '../../../components/ui/OptimizedImage';
import { formatPrecio, sanitizeMoneda } from '../../../utils/priceUtils';
import PageTransition from '../../../components/ui/PageTransition';
import { AnimatedSection } from '../../../hooks/scrollAnimations';
import { Link } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel';
import CategoryTabs from '../components/CategoryTabs';
import AlphaIndex from '../components/AlphaIndex';
import TransparentNav from '../../../components/layout/TransparentNav';
import Footer from '../../home/components/Footer';
import { useContactInfo } from '../../../hooks/useContactInfo';

const PackageCard = ({ paquete }) => {
  const img = paquete?.primera_imagen || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop';
  const moneda = sanitizeMoneda(paquete?.moneda);
  const precio = formatPrecio(paquete?.precio_total, moneda);
  const url = `/paquetes/${paquete?.codigoUrl}`;

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden border border-slate-100 group h-full flex flex-col">
      <div className="relative">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || 'Paquete'}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg text-xs font-medium shadow-lg">
            {paquete?.destinos_nombres || 'Destino'}
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
            <span className="truncate max-w-[120px]">{paquete?.destinos_nombres || 'Destino'}</span>
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
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeLetter, setActiveLetter] = useState(null);
  const limit = 12;

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
      const { data: resp } = await getPaquetes(page, limit, search || undefined);
      const items = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
      setData(items);
      if (resp?.meta?.total) setTotal(resp.meta.total);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error cargando paquetes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadData();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Filtro/transformación de datos según categoría
  const filteredData = useMemo(() => {
    let base = [...data];
    // aplicar búsqueda ya aplicada en API si backend la soporta; aquí podría refinar
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
      // Suponiendo p.continente; si no existe, habría que mapear por destino
      base = base.filter(p => filters.continentes.includes(p?.continente));
    }
    switch (activeCategory) {
      case 'larga':
        base = base.filter(p => (p.duracion_dias||0) >= 10);
        break;
      case 'cortos':
        base = base.filter(p => (p.duracion_dias||0) > 0 && (p.duracion_dias||0) <= 5);
        break;
      case 'populares':
        base = base.slice().sort((a,b)=> (b?.reservas||0) - (a?.reservas||0));
        break;
      case 'ofertas':
        base = base.filter(p => p?.precio_descuento || p?.en_oferta);
        break;
      default:
        break;
    }
    return base;
  }, [data, filters, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map();
    filteredData.forEach(p => {
      const key = (p?.destinos_nombres || 'Otros').charAt(0).toUpperCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  }, [filteredData]);

  const letters = useMemo(()=> grouped.map(([l])=>l), [grouped]);

  const handleJump = (l) => {
    setActiveLetter(l);
    const el = document.getElementById(`sec-${l}`);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      setTimeout(()=>setActiveLetter(null), 1500);
    }
  };

  const { contactInfo, loading: contactLoading } = useContactInfo();
  const currentYear = new Date().getFullYear();

  return (
    <PageTransition>
      <div id="top" className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <TransparentNav />
        <DestinationsHero />
        {/* anchor for hero cta scroll */}
        <div id="top-search" className="-mt-10" aria-hidden="true"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 space-y-6">
          <PackagesSearchBar value={search} onChange={setSearch} onOpenFilters={() => setFiltersOpen(true)} />
          <CategoryTabs categories={categories} current={activeCategory} onChange={setActiveCategory} />
        </div>
        <AlphaIndex letters={letters} onJump={handleJump} active={activeLetter} />
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

          {!loading && grouped.map(([letter, items]) => (
            <PackagesSection key={letter} id={`sec-${letter}`} title={`Destinos "${letter}"`} description={`Paquetes que comienzan con la letra ${letter}`}> 
              {items.map((p,i) => (
                <AnimatedSection key={p.codigoUrl || p.id || i} animation="destCard" index={i} stagger={70} className="h-full">
                  <PackageCard paquete={p} />
                </AnimatedSection>
              ))}
            </PackagesSection>
          ))}

          {!loading && !grouped.length && !error && (
            <div className="text-center py-24 text-slate-500">No se encontraron resultados</div>
          )}

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p-1))}
              className="px-5 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm font-medium"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-500">Página {page}</span>
            <button
              disabled={loading || data.length < limit}
              onClick={() => setPage(p => p+1)}
              className="px-5 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm font-medium"
            >
              Siguiente
            </button>
          </div>
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
