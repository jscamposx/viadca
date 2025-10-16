import React, { useState, useEffect } from "react";
import { FiUsers, FiSearch, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import api from "../../../api";

const UsuariosAutorizadosSelector = ({ 
  usuariosAutorizadosIds = [], 
  onUsuariosChange,
  esPublico = true 
}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.users.getAllUsers({ page: 1, limit: 1000 });
        // Filtrar solo usuarios no-admin para la lista
        const usuariosNoAdmin = (response?.usuarios || response?.data || [])
          .filter(u => u.rol !== 'admin');
        setUsuarios(usuariosNoAdmin);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsuarios();
  }, []);

  const handleToggleUsuario = (usuarioId) => {
    const isSelected = usuariosAutorizadosIds.includes(usuarioId);
    const newIds = isSelected
      ? usuariosAutorizadosIds.filter(id => id !== usuarioId)
      : [...usuariosAutorizadosIds, usuarioId];
    
    onUsuariosChange(newIds);
  };

  const handleSelectAll = () => {
    const allIds = filteredUsuarios.map(u => u.id);
    onUsuariosChange(allIds);
  };

  const handleDeselectAll = () => {
    onUsuariosChange([]);
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (usuario.nombre_completo?.toLowerCase().includes(search)) ||
      (usuario.usuario?.toLowerCase().includes(search)) ||
      (usuario.correo?.toLowerCase().includes(search))
    );
  });

  if (esPublico) {
    return null; // No mostrar selector si el paquete es público
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-slate-600">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-red-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 text-red-600">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
      <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
          <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        </div>
        <span className="flex-1">Usuarios Autorizados</span>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Paso 3
        </span>
        {usuariosAutorizadosIds.length > 0 && (
          <span className="text-sm font-normal bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            {usuariosAutorizadosIds.length} seleccionado{usuariosAutorizadosIds.length !== 1 ? 's' : ''}
          </span>
        )}
      </h4>

      {/* Banner de información */}
      <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
        <div className="flex gap-3">
          <FiUsers className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Selecciona los Usuarios con Acceso
            </p>
            <p className="text-xs sm:text-sm text-blue-700">
              Solo los usuarios seleccionados podrán ver este paquete privado en la sección "Mis Paquetes". 
              Los administradores siempre tienen acceso completo.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario o correo..."
            className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Botones de selección masiva */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={handleSelectAll}
          className="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium"
        >
          Seleccionar todos
        </button>
        <button
          type="button"
          onClick={handleDeselectAll}
          className="flex-1 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
        >
          Limpiar selección
        </button>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-lg border border-slate-200 max-h-80 overflow-y-auto">
        {filteredUsuarios.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <FiUsers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">
              {searchTerm ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsuarios.map((usuario) => {
              const isSelected = usuariosAutorizadosIds.includes(usuario.id);
              
              return (
                <label
                  key={usuario.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors duration-150 ${
                    isSelected ? "bg-purple-50 hover:bg-purple-100" : ""
                  }`}
                >
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleUsuario(usuario.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-purple-600 border-purple-600"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <FiCheck className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {usuario.nombre_completo || usuario.usuario || "Sin nombre"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {usuario.correo}
                    </p>
                  </div>

                  {usuario.rol && usuario.rol !== 'usuario' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {usuario.rol}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Información adicional */}
      {usuariosAutorizadosIds.length === 0 && !esPublico && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 flex items-start gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Atención:</strong> No has seleccionado ningún usuario autorizado. 
              El paquete solo será visible para administradores.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UsuariosAutorizadosSelector;
