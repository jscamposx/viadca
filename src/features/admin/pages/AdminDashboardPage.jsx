import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { useMayoristas } from "../hooks/useMayoristas";
import { FiRefreshCw, FiPackage, FiUsers, FiPlus, FiArrowRight, FiHome, FiUserPlus } from "react-icons/fi";
import PackageLookupPanel from "../components/PackageLookupPanel";

const AdminDashboard = () => {
  const { paquetes, loading: paquetesLoading } = useAllPackages();
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();
  const loading = paquetesLoading || mayoristasLoading;
  const totalPaquetes = paquetes?.length || 0;
  const totalMayoristas = mayoristas?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
              <p className="text-sm text-gray-600 mt-1">Búsqueda rápida y exportación de paquetes.</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => window.location.reload()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg shadow-sm text-sm disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PackageLookupPanel />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiArrowRight className="w-5 h-5 text-blue-600" /> Accesos rápidos
              </h2>
              <div className="space-y-3">
                <Link to="/admin/paquetes/nuevo" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-blue-600 text-white p-2 rounded-md">
                    <FiPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Nuevo Paquete</p>
                    <p className="text-xs text-gray-600">Crear paquete turístico</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/admin/mayoristas/nuevo" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-emerald-600 text-white p-2 rounded-md">
                    <FiUserPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Nuevo Mayorista</p>
                    <p className="text-xs text-gray-600">Registrar proveedor</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/admin/paquetes" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-gray-800 text-white p-2 rounded-md">
                    <FiPackage className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Ver Paquetes</p>
                    <p className="text-xs text-gray-600">Gestionar inventario</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/admin/mayoristas" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-green-600 text-white p-2 rounded-md">
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Mayoristas</p>
                    <p className="text-xs text-gray-600">Gestionar proveedores</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/admin/usuarios" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-indigo-600 text-white p-2 rounded-md">
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Administrar Usuarios</p>
                    <p className="text-xs text-gray-600">Gestión de cuentas</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link to="/" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="bg-slate-600 text-white p-2 rounded-md">
                    <FiHome className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Página Inicial</p>
                    <p className="text-xs text-gray-600">Ver sitio público</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Estado rápido</h2>
              <p className="text-sm text-gray-600">Paquetes: {totalPaquetes}</p>
              <p className="text-sm text-gray-600">Mayoristas: {totalMayoristas}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
