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
    <article className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-slate-100 h-full flex flex-col transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-blue-200">
      {/* Imagen con overlay mejorado */}
      <div className="relative overflow-hidden rounded-t-3xl">
        <OptimizedImage
          src={img}
          alt={paquete?.titulo || 'Paquete'}
          className="w-full h-52 sm:h-56 md:h-60 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          width={800}
          height={480}
          responsive
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1536px) 25vw, 320px"
          lazy={true}
          placeholder={true}
        />
        
        {/* Overlay con gradiente dinámico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Badge de destino */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-full text-xs font-semibold shadow-xl">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {paquete?.destinos_nombres || 'Destino'}
          </span>
        </div>
        
        {/* Botón favorito */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
          <svg className="w-5 h-5 text-slate-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* Badge de oferta */}
        {paquete?.precio_descuento && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
              🔥 OFERTA
            </span>
          </div>
        )}
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-bold text-lg lg:text-xl text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 flex-1">
            {paquete?.titulo || 'Paquete'}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 block mb-1">Desde</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="uppercase text-xs font-semibold tracking-wide text-slate-400">{moneda}</span>
              <div className="font-bold text-xl text-blue-700 leading-tight">{precio || '—'}</div>
            </div>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {paquete?.duracion_dias ? `${paquete.duracion_dias} días` : 'Consultar'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {paquete?.destinos_nombres || 'Destino'}
          </span>
        </div>
        
        {/* Footer de la tarjeta */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">★</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500">+50 viajeros</span>
          </div>
          
          <Link 
            to={url} 
            className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all duration-300 hover:gap-3"
          >
            <span>Ver detalles</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center border border-white/60 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">{data.length}</div>
              <div className="text-xs text-slate-600 font-medium">Disponibles</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center border border-white/60 shadow-lg">
              <div className="text-2xl font-bold text-green-600">15+</div>
              <div className="text-xs text-slate-600 font-medium">Países</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center border border-white/60 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">50+</div>
              <div className="text-xs text-slate-600 font-medium">Ciudades</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center border border-white/60 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-xs text-slate-600 font-medium">Soporte</div>
            </div>
          </div>

          {error && (
            <div className="p-6 mb-8 bg-red-50/90 backdrop-blur border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-3 shadow-lg">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <div className="font-semibold">Ups, algo salió mal</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_,i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-slate-200 rounded-t-3xl" />
                    <div className="p-6 bg-white rounded-b-3xl border border-slate-100">
                      <div className="h-4 bg-slate-200 rounded mb-3" />
                      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && grouped.map(([letter, items]) => (
            <PackagesSection key={letter} id={`sec-${letter}`} title={`Destinos "${letter}"`} description={`Descubre ${items.length} increíbles paquetes que comienzan con la letra ${letter}`}> 
              {items.map((p,i) => (
                <AnimatedSection key={p.codigoUrl || p.id || i} animation="destCard" index={i} stagger={70} className="h-full">
                  <PackageCard paquete={p} />
                </AnimatedSection>
              ))}
            </PackagesSection>
          ))}

          {!loading && !grouped.length && !error && (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No encontramos resultados</h3>
                <p className="text-slate-600 mb-6">Intenta ajustar tus filtros o buscar algo diferente</p>
                <button 
                  onClick={() => { setSearch(''); setFilters({}); setActiveCategory('todos'); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}

          {/* Paginación mejorada */}
          <div className="flex items-center justify-center gap-6 mt-16 mb-8">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p-1))}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                {page}
              </span>
              <span className="text-slate-500 text-sm">de muchas páginas</span>
            </div>
            
            <button
              disabled={loading || data.length < limit}
              onClick={() => setPage(p => p+1)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
            >
              Siguiente
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
