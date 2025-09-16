import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { useMayoristas } from "../hooks/useMayoristas";
import { useEffect, useState, useMemo, useRef } from "react";
import api from "../../../api";
import {
  FiRefreshCw,
  FiPackage,
  FiUsers,
  FiPlus,
  FiArrowRight,
  FiHome,
  FiUserPlus,
  FiDownload,
  FiLayers,
  FiClipboard,
} from "react-icons/fi";
import PackageLookupPanel from "../components/PackageLookupPanel";

const StatCard = ({ icon: Icon, label, value, accent, refreshing }) => (
  <div
    className={`relative group rounded-xl border p-4 flex items-center gap-4 shadow-sm transition-all duration-500 bg-white/70 backdrop-blur-md border-white/60 hover:shadow-lg hover:-translate-y-0.5 inner-glow stat-refresh-shimmer ${refreshing ? 'stat-refreshing' : ''}`}
  >
    <div className={`p-2.5 rounded-lg shadow-sm ${accent || 'bg-blue-50 text-blue-600'} group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] tracking-[0.15em] font-semibold uppercase text-gray-500/80 line-clamp-1">{label}</p>
      <p className="text-xl font-bold text-gray-900/90 mt-0.5 tabular-nums">{value}</p>
    </div>
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay bg-gradient-to-r from-transparent via-white/25 to-transparent" />
  </div>
);

const QuickLink = ({ to, icon: Icon, title, desc, color }) => (
  <Link
    to={to}
    className="relative group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/40 bg-white/60 hover:bg-white/80 transition-all shadow-sm hover:shadow-lg backdrop-blur-md focus-ring-custom focus:outline-none"
  >
    <div className={`p-2 rounded-md text-white shadow ${color || 'bg-blue-600'} group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 line-clamp-1 tracking-tight">{title}</p>
      <p className="text-[11px] text-gray-600/90 line-clamp-1">{desc}</p>
    </div>
    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-500 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
    <span className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </Link>
);

const AdminDashboard = () => {
  const { paquetes, loading: paquetesLoading } = useAllPackages();
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();
  const loading = paquetesLoading || mayoristasLoading;

  const [pkgStats, setPkgStats] = useState({ total: 0, paquetes: 0, activos: 0, inactivos: 0 });
  const [mayStats, setMayStats] = useState({ total: 0, mayoristas: 0, activos: 0, inactivos: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshingVisual, setRefreshingVisual] = useState(false);
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadStats = async (visual=false) => {
      setStatsLoading(true);
      if (visual) {
        setRefreshingVisual(true);
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = setTimeout(()=> setRefreshingVisual(false), 1800);
      }
      try {
        const [pResp, mResp] = await Promise.allSettled([
          api.packages?.getPaquetesStatsOverview?.(),
          api.mayoristas?.getMayoristasStatsOverview?.(),
        ]);
        if (mounted) {
          if (pResp.status === 'fulfilled') {
            const d = pResp.value?.data ?? pResp.value;
            setPkgStats({
              total: d?.total ?? d?.paquetes ?? 0,
              paquetes: d?.paquetes ?? d?.total ?? 0,
              activos: d?.activos ?? 0,
              inactivos: d?.inactivos ?? 0,
            });
          } else {
            // fallback
            setPkgStats({
              total: paquetes?.length || 0,
              paquetes: paquetes?.length || 0,
              activos: Array.isArray(paquetes) ? paquetes.filter(p=>p.activo).length : 0,
              inactivos: 0,
            });
          }
          if (mResp.status === 'fulfilled') {
            const d = mResp.value?.data ?? mResp.value;
            setMayStats({
              total: d?.total ?? d?.mayoristas ?? 0,
              mayoristas: d?.mayoristas ?? d?.total ?? 0,
              activos: d?.activos ?? 0,
              inactivos: d?.inactivos ?? 0,
            });
          } else {
            setMayStats({
              total: mayoristas?.length || 0,
              mayoristas: mayoristas?.length || 0,
              activos: 0,
              inactivos: 0,
            });
          }
        }
      } catch (e) {
        if (mounted && import.meta.env.DEV) console.warn('Error cargando stats dashboard', e);
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, [paquetes, mayoristas]);

  const manualRefresh = () => {
    // fuerza recarga de la página (como antes) pero disparando animación local
    setRefreshingVisual(true);
    window.location.reload();
  };

  // Skeleton component inline
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-2 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-12 bg-gray-300 rounded" />
      </div>
    </div>
  );

  const cotizacionesSesion = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = window.localStorage.getItem('cotizador_paquetes');
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch { return 0; }
  }, []);

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6 relative">
      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="glass-panel glass-border-gradient rounded-2xl shadow-lg p-4 sm:p-6 fade-slide-up">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex-1 min-w-0 space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Panel Administrativo
              </h1>
              <p className="text-gray-600/90 text-sm sm:text-base max-w-2xl">
                Gestión central, métricas clave y herramientas de cotización en un solo lugar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={manualRefresh}
                disabled={loading}
                aria-label="Actualizar"
                title="Actualizar"
                className="group relative flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap bg-white/70 hover:bg-white/90 text-gray-700 border border-white/60 shadow-sm hover:shadow focus-ring-custom disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                <span>Actualizar</span>
                <span className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-500" />
              </button>
              <Link
                to="/admin/paquetes/nuevo"
                className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-400 ease-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap focus-ring-custom"
              >
                <FiPlus className="w-5 h-5" />
                <span>Nuevo Paquete</span>
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${refreshingVisual ? 'stat-refreshing' : ''}`}>
          {statsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard icon={FiPackage} label="Paquetes" value={pkgStats.paquetes} refreshing={refreshingVisual} />
              <StatCard icon={FiDownload} label="Activos" value={pkgStats.activos} accent="bg-emerald-50 text-emerald-600" refreshing={refreshingVisual} />
              <StatCard icon={FiClipboard} label="Inactivos" value={pkgStats.inactivos} accent="bg-rose-50 text-rose-600" refreshing={refreshingVisual} />
              <StatCard icon={FiUsers} label="Mayoristas" value={mayStats.mayoristas} accent="bg-indigo-50 text-indigo-600" refreshing={refreshingVisual} />
              <StatCard icon={FiLayers} label="Cotizaciones" value={cotizacionesSesion} accent="bg-amber-50 text-amber-600" refreshing={refreshingVisual} />
            </>
          )}
        </div>

        {/* Barra de acciones rápidas (sticky) */}
        <div className="sticky-actions-bar glass-panel rounded-xl border border-white/40 shadow-md px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto hide-scrollbar-x">
          <div className="flex items-stretch gap-3 min-w-max">
            <QuickLink to="/admin/paquetes" icon={FiPackage} title="Paquetes" desc="Listado y gestión" color="bg-gray-800" />
            <QuickLink to="/admin/paquetes/nuevo" icon={FiPlus} title="Nuevo Paquete" desc="Crear oferta" color="bg-blue-600" />
            <QuickLink to="/admin/mayoristas" icon={FiUsers} title="Mayoristas" desc="Proveedores" color="bg-green-600" />
            <QuickLink to="/admin/mayoristas/nuevo" icon={FiUserPlus} title="Nuevo Mayorista" desc="Registrar" color="bg-emerald-600" />
            <QuickLink to="/admin/usuarios" icon={FiUsers} title="Usuarios" desc="Cuentas y roles" color="bg-indigo-600" />
            <QuickLink to="/" icon={FiHome} title="Página Pública" desc="Ver sitio" color="bg-slate-600" />
          </div>
        </div>

        {/* Cotizador */}
        <div className="glass-panel glass-border-gradient rounded-2xl shadow-lg overflow-hidden">
          <PackageLookupPanel />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
