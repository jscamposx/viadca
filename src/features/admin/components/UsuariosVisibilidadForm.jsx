import React, { useState, useEffect } from "react";
import { FiUsers, FiGlobe, FiLock, FiCheck, FiX, FiAlertCircle, FiSearch, FiPackage, FiLink } from "react-icons/fi";
import api from "../../../api";

const UsuariosVisibilidadForm = ({ formData, onFormChange }) => {
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
        
        // La respuesta tiene estructura: { data: { data: [...usuarios], pagination: {...} } }
        // authService ya devuelve response.data, así que aquí recibimos { data: [...], pagination: {...} }
        const usuariosList = response?.data || [];
        
        console.log("👥 Total de usuarios recibidos:", usuariosList.length);
        
        // Filtrar usuarios que NO sean admin
        const usuariosNoAdmin = usuariosList.filter(u => u.rol !== 'admin');
        console.log("✅ Usuarios disponibles (sin admin):", usuariosNoAdmin.length);
        
        setUsuarios(usuariosNoAdmin);
      } catch (err) {
        console.error("❌ Error cargando usuarios:", err);
        console.error("❌ Detalles del error:", err.response?.data || err.message);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsuarios();
  }, []);

  const handleTipoAccesoChange = (tipoAcceso) => {
    console.log(`🔄 Tipo de acceso cambió:`, tipoAcceso);
    
    // Actualizar tipoAcceso y esPublico
    onFormChange({
      target: { name: 'tipoAcceso', value: tipoAcceso },
    });
    
    // Actualizar esPublico basado en el tipo
    onFormChange({
      target: { name: 'esPublico', value: tipoAcceso === 'publico' },
    });

    // Si cambia a link-privado, limpiar usuarios autorizados
    if (tipoAcceso === 'link-privado') {
      onFormChange({
        target: { name: 'usuariosAutorizadosIds', value: [] },
      });
    }
  };

  const handleToggleUsuario = (usuarioId) => {
    const currentIds = formData.usuariosAutorizadosIds || [];
    const isSelected = currentIds.includes(usuarioId);
    const newIds = isSelected
      ? currentIds.filter(id => id !== usuarioId)
      : [...currentIds, usuarioId];
    
    onFormChange({
      target: { name: 'usuariosAutorizadosIds', value: newIds }
    });
  };

  const handleSelectAll = () => {
    const allIds = filteredUsuarios.map(u => u.id);
    onFormChange({
      target: { name: 'usuariosAutorizadosIds', value: allIds }
    });
  };

  const handleDeselectAll = () => {
    onFormChange({
      target: { name: 'usuariosAutorizadosIds', value: [] }
    });
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

  const usuariosSeleccionados = formData.usuariosAutorizadosIds || [];
  const tipoAcceso = formData.tipoAcceso || 'publico';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Selector de Tipo de Acceso - 3 opciones */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiPackage className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Tipo de Acceso</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Opción 1: PÚBLICO */}
          <button
            type="button"
            onClick={() => handleTipoAccesoChange("publico")}
            className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              tipoAcceso === 'publico'
                ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white hover:border-green-300 hover:shadow-md"
            }`}
          >
            {tipoAcceso === 'publico' && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                <FiCheck className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className={`p-3 rounded-xl w-fit ${tipoAcceso === 'publico' ? "bg-green-500" : "bg-green-100"}`}>
                <FiGlobe className={`w-6 h-6 ${tipoAcceso === 'publico' ? "text-white" : "text-green-600"}`} />
              </div>
              
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Público
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                  Visible para todos en el listado público
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-green-600" />
                    <span>Aparece en /paquetes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-green-600" />
                    <span>No requiere login</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-green-600" />
                    <span>Accesible por URL directa</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Opción 2: PRIVADO */}
          <button
            type="button"
            onClick={() => handleTipoAccesoChange("privado")}
            className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              tipoAcceso === 'privado'
                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md"
            }`}
          >
            {tipoAcceso === 'privado' && (
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1.5 shadow-lg">
                <FiCheck className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className={`p-3 rounded-xl w-fit ${tipoAcceso === 'privado' ? "bg-purple-500" : "bg-purple-100"}`}>
                <FiLock className={`w-6 h-6 ${tipoAcceso === 'privado' ? "text-white" : "text-purple-600"}`} />
              </div>
              
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Privado
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                  Solo usuarios autorizados con login
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-purple-600" />
                    <span>Aparece en /mis-paquetes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-purple-600" />
                    <span>Requiere autenticación</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-purple-600" />
                    <span>Envía notificaciones email</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Opción 3: LINK-PRIVADO */}
          <button
            type="button"
            onClick={() => handleTipoAccesoChange("link-privado")}
            className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              tipoAcceso === 'link-privado'
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-[1.02]"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
            }`}
          >
            {tipoAcceso === 'link-privado' && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                <FiCheck className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className={`p-3 rounded-xl w-fit ${tipoAcceso === 'link-privado' ? "bg-blue-500" : "bg-blue-100"}`}>
                <FiLink className={`w-6 h-6 ${tipoAcceso === 'link-privado' ? "text-white" : "text-blue-600"}`} />
              </div>
              
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Link Privado
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                  Solo accesible por URL directa
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-blue-600" />
                    <span>No aparece en listados</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-blue-600" />
                    <span>No requiere login</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FiCheck className="w-3 h-3 text-blue-600" />
                    <span>Ideal para WhatsApp/Email</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Selector de usuarios autorizados - Solo visible si es PRIVADO */}
      {tipoAcceso === 'privado' && (
        <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-xl sm:rounded-2xl border-2 border-purple-200 p-4 sm:p-6 shadow-lg">
          {/* Header con contador */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  Seleccionar Usuarios
                </h4>
                <p className="text-xs text-slate-600">
                  Quiénes podrán ver este paquete
                </p>
              </div>
            </div>
            {usuariosSeleccionados.length > 0 && (
              <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                {usuariosSeleccionados.length}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-purple-600 mb-3"></div>
              <span className="text-sm text-slate-600 font-medium">Cargando usuarios...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-red-600 p-4 bg-red-50 rounded-xl border border-red-200">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Barra de búsqueda mejorada */}
              <div className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar usuarios..."
                    className="w-full pl-12 pr-10 py-3.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-sm font-medium placeholder:text-slate-400"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Botones de selección masiva mejorados */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FiCheck className="w-4 h-4" />
                  Todos
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white text-slate-700 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  <FiX className="w-4 h-4" />
                  Ninguno
                </button>
              </div>

              {/* Lista de usuarios mejorada */}
              <div className="bg-white rounded-xl border-2 border-purple-100 max-h-80 overflow-y-auto shadow-inner">
                {filteredUsuarios.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-3">
                      <FiUsers className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {searchTerm ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredUsuarios.map((usuario) => {
                      const isSelected = usuariosSeleccionados.includes(usuario.id);
                      
                      return (
                        <label
                          key={usuario.id}
                          className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? "bg-purple-50 hover:bg-purple-100" 
                              : "hover:bg-slate-50"
                          }`}
                        >
                          {/* Checkbox personalizado */}
                          <div className="relative flex items-center justify-center flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleUsuario(usuario.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "bg-purple-500 border-purple-500 scale-110"
                                  : "border-slate-300 bg-white hover:border-purple-300"
                              }`}
                            >
                              {isSelected && <FiCheck className="w-4 h-4 text-white font-bold" />}
                            </div>
                          </div>

                          {/* Info del usuario */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isSelected ? "text-purple-900" : "text-slate-900"}`}>
                              {usuario.nombre_completo || usuario.usuario || "Sin nombre"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {usuario.correo}
                            </p>
                          </div>

                          {/* Badge de rol */}
                          {usuario.rol && usuario.rol !== 'usuario' && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-wide">
                              {usuario.rol}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle para estado del paquete - Diseño mejorado */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${
              formData.activo ? "bg-green-500" : "bg-slate-300"
            }`}>
              <FiPackage className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Estado del Paquete
              </h4>
              <p className="text-xs text-slate-600">
                {formData.activo ? "Visible en la plataforma" : "Oculto para usuarios"}
              </p>
            </div>
          </div>

          {/* Toggle switch mejorado */}
          <button
            type="button"
            onClick={() => handleToggleChange("activo", !formData.activo)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
              formData.activo 
                ? "bg-green-500 focus:ring-green-500" 
                : "bg-slate-300 focus:ring-slate-400"
            }`}
            role="switch"
            aria-checked={formData.activo}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                formData.activo ? "translate-x-7" : "translate-x-1"
              }`}
            >
              <span className="flex items-center justify-center h-full">
                {formData.activo ? (
                  <FiCheck className="w-3 h-3 text-green-500" />
                ) : (
                  <FiX className="w-3 h-3 text-slate-400" />
                )}
              </span>
            </span>
          </button>
        </div>

        {/* Indicador visual del estado */}
        <div className={`p-3 rounded-lg border-2 ${
          formData.activo 
            ? "bg-green-50 border-green-200" 
            : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              formData.activo ? "bg-green-500 animate-pulse" : "bg-slate-400"
            }`}></div>
            <span className={`text-sm font-semibold ${
              formData.activo ? "text-green-700" : "text-slate-600"
            }`}>
              {formData.activo ? "Paquete Activo" : "Paquete Inactivo"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosVisibilidadForm;
