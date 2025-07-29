import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMayoristas } from "../hooks/useMayoristas";
import {
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiX,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import api from "../../../api";
import { useNotification } from "./AdminLayout";

const AdminMayoristasPage = () => {
  const { mayoristas, setMayoristas, loading, error, deleteMayorista } = useMayoristas();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMayoristas, setFilteredMayoristas] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "asc",
  });
  const [tipoFilter, setTipoFilter] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const { addNotification } = useNotification();

  const handleExport = async (mayoristaId) => {
    try {
      const response = await api.mayoristas.exportToExcel(mayoristaId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `mayorista-${mayoristaId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      addNotification("La exportación a Excel ha comenzado.", "success");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      addNotification("Error al exportar a Excel", "error");
    }
  };

  const handleDelete = async (mayoristaId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mayorista?")) {
      try {
        await deleteMayorista(mayoristaId);
        addNotification("Mayorista eliminado correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar mayorista:", error);
        addNotification("Error al eliminar el mayorista", "error");
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setIsSortMenuOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTipoFilter("");
    setSortConfig({ key: "nombre", direction: "asc" });
  };

  // Filtrado y ordenamiento
  useEffect(() => {
    let filtered = [...mayoristas];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (mayorista) =>
          mayorista.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mayorista.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mayorista.tipo_producto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo de producto
    if (tipoFilter) {
      filtered = filtered.filter((mayorista) => mayorista.tipo_producto === tipoFilter);
    }

    // Ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredMayoristas(filtered);
  }, [mayoristas, searchTerm, tipoFilter, sortConfig]);

  // Obtener tipos únicos para el filtro
  const tiposUnicos = [...new Set(mayoristas.map((m) => m.tipo_producto))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mayoristas</h1>
              <p className="text-gray-600">
                Gestiona los mayoristas ({mayoristas.length} total)
              </p>
            </div>
          </div>
          <Link
            to="/admin/mayoristas/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            Nuevo Mayorista
          </Link>
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, clave o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter />
              Filtros
            </button>

            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Ordenar
                {sortConfig.direction === "asc" ? (
                  <FiArrowUp size={16} />
                ) : (
                  <FiArrowDown size={16} />
                )}
              </button>

              {isSortMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleSort("nombre")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Nombre
                    </button>
                    <button
                      onClick={() => handleSort("clave")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Clave
                    </button>
                    <button
                      onClick={() => handleSort("tipo_producto")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Tipo de Producto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {(searchTerm || tipoFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                <FiX />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros expandible */}
        {isFiltersOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Producto
                </label>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de mayoristas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mayorista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMayoristas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No se encontraron mayoristas</p>
                    <p className="text-sm">
                      {mayoristas.length === 0
                        ? "Comienza creando tu primer mayorista"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMayoristas.map((mayorista) => (
                  <tr key={mayorista.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FiUsers className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {mayorista.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {mayorista.clave}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mayorista.tipo_producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {mayorista.created_at
                          ? new Date(mayorista.created_at).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleExport(mayorista.id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
                          title="Exportar a Excel"
                        >
                          <FiDownload />
                        </button>
                        <Link
                          to={`/admin/mayoristas/editar/${mayorista.id}`}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDelete(mayorista.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      {filteredMayoristas.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Mostrando {filteredMayoristas.length} de {mayoristas.length} mayoristas
        </div>
      )}
    </div>
  );
};

export default AdminMayoristasPage;
