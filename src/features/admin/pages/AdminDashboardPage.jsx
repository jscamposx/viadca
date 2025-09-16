import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { useMayoristas } from "../hooks/useMayoristas";
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
  const totalPaquetes = paquetes?.length || 0;
  const totalMayoristas = mayoristas?.length || 0;
  const activos = Array.isArray(paquetes)
    ? paquetes.filter((p) => p.activo).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Panel Administrativo</h1>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                Resumen rápido del sistema y herramientas directas de cotización.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/paquetes/nuevo"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
              >
                <FiPlus className="w-4 h-4" /> Nuevo Paquete
              </Link>
              <button
                onClick={() => window.location.reload()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium shadow-sm disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={FiPackage} label="Paquetes" value={totalPaquetes} />
            <StatCard
              icon={FiDownload}
              label="Activos"
              value={activos}
              accent="bg-emerald-50 text-emerald-600"
            />
          <StatCard
            icon={FiUsers}
            label="Mayoristas"
            value={totalMayoristas}
            accent="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            icon={FiClipboard}
            label="Cotizaciones (sesión)"
            value={typeof window !== 'undefined' && window.localStorage.getItem('cotizador_paquetes') ? JSON.parse(window.localStorage.getItem('cotizador_paquetes')).length : 0}
            accent="bg-amber-50 text-amber-600"
          />
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
