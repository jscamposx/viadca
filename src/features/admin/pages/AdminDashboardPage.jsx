import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { useMayoristas } from "../hooks/useMayoristas";
import { useEffect, useState } from "react";
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

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className={`p-2.5 rounded-lg ${accent || "bg-blue-50 text-blue-600"}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium line-clamp-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const QuickLink = ({ to, icon: Icon, title, desc, color }) => (
  <Link
    to={to}
    className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition shadow-sm"
  >
    <div className={`p-2 rounded-md text-white ${color || "bg-blue-600"}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 line-clamp-1">{title}</p>
      <p className="text-xs text-gray-600 line-clamp-1">{desc}</p>
    </div>
    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-500 flex-shrink-0" />
  </Link>
);

const AdminDashboard = () => {
  const { paquetes, loading: paquetesLoading } = useAllPackages();
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();
  const loading = paquetesLoading || mayoristasLoading;

  const [pkgStats, setPkgStats] = useState({ total: 0, paquetes: 0, activos: 0, inactivos: 0 });
  const [mayStats, setMayStats] = useState({ total: 0, mayoristas: 0, activos: 0, inactivos: 0 });

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
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
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, [paquetes, mayoristas]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header remodelado estilo páginas internas */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-6 mb-2 sm:mb-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Panel Administrativo
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2">
                Gestión central y herramientas rápidas de administración.
              </p>
            </div>
            <div className="w-full sm:w-auto lg:w-auto flex items-center justify-center lg:justify-end gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                disabled={loading}
                aria-label="Actualizar"
                title="Actualizar"
                className="flex items-center justify-center gap-2 border font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-300 text-sm sm:text-base whitespace-nowrap bg-white hover:bg-gray-50 text-gray-700 border-gray-200 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              <Link
                to="/admin/paquetes/nuevo"
                className="w-full sm:w-auto lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nuevo Paquete</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={FiPackage} label="Paquetes" value={pkgStats.paquetes} />
          <StatCard icon={FiDownload} label="Activos" value={pkgStats.activos} accent="bg-emerald-50 text-emerald-600" />
          <StatCard icon={FiClipboard} label="Inactivos" value={pkgStats.inactivos} accent="bg-rose-50 text-rose-600" />
          <StatCard icon={FiUsers} label="Mayoristas" value={mayStats.mayoristas} accent="bg-indigo-50 text-indigo-600" />
          <StatCard icon={FiLayers} label="Cotizaciones" value={typeof window !== 'undefined' && window.localStorage.getItem('cotizador_paquetes') ? JSON.parse(window.localStorage.getItem('cotizador_paquetes')).length : 0} accent="bg-amber-50 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Cotizador */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <PackageLookupPanel />
            </div>
          </div>

          {/* Quick links + Activity */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <FiLayers className="w-4 h-4 text-blue-600" /> Navegación Rápida
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <QuickLink to="/admin/paquetes" icon={FiPackage} title="Paquetes" desc="Listado y gestión" color="bg-gray-800" />
                <QuickLink to="/admin/paquetes/nuevo" icon={FiPlus} title="Nuevo Paquete" desc="Crear oferta" color="bg-blue-600" />
                <QuickLink to="/admin/mayoristas" icon={FiUsers} title="Mayoristas" desc="Proveedores" color="bg-green-600" />
                <QuickLink to="/admin/mayoristas/nuevo" icon={FiUserPlus} title="Nuevo Mayorista" desc="Registrar" color="bg-emerald-600" />
                <QuickLink to="/admin/usuarios" icon={FiUsers} title="Usuarios" desc="Cuentas y roles" color="bg-indigo-600" />
                <QuickLink to="/" icon={FiHome} title="Página Pública" desc="Ver sitio" color="bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
