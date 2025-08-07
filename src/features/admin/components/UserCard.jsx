import React from 'react';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiMoreVertical,
  FiShield,
  FiClock,
  FiTrash2,
  FiCheckCircle,
  FiEdit2,
  FiUserCheck,
  FiActivity
} from 'react-icons/fi';

const UserCard = ({ 
  user, 
  currentUser, 
  showActionMenu, 
  setShowActionMenu, 
  handleRoleChange, 
  setConfirmDialog, 
  getRoleColor, 
  getRoleIcon, 
  loading 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No disponible';
    }
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  };

  // Fondo degradado unificado para todas las tarjetas
  const getUnifiedGradient = () => {
    return 'from-purple-50 via-indigo-50 to-blue-50';
  };

  // Color del fondo del icono según el rol
  const getRoleIconBg = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'pre-autorizado':
        return 'bg-orange-500';
      default: // usuario
        return 'bg-blue-500';
    }
  };

  const getRoleColorBg = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 hover:bg-red-100 border-red-200';
      case 'pre-autorizado':
        return 'bg-orange-50 hover:bg-orange-100 border-orange-200';
      default:
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
    }
  };

  return (
    <div className={`grupo bg-gradient-to-br ${getUnifiedGradient()} rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-purple-300 overflow-hidden flex flex-col h-full`}>
      {/* Header con avatar e información */}
      <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-5 lg:p-6 border-b border-white/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`${getRoleIconBg(user.rol)} p-3 rounded-xl mr-4 shadow-lg`}>
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-200">
                {user.usuario}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {user.id === currentUser?.id && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 shadow-sm">
                    Tú
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Menú de acciones */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(showActionMenu === user.id ? null : user.id);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>
            
            {showActionMenu === user.id && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                {/* Cambiar rol */}
                {user.id !== currentUser?.id && (
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">Cambiar rol:</p>
                    <div className="space-y-1">
                      {['usuario', 'pre-autorizado', 'admin'].map(role => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(user, role)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white transition-colors duration-200 font-medium ${
                            user.rol === role 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                          disabled={user.rol === role}
                        >
                          <div className="flex items-center gap-2">
                            {role === 'admin' && <FiShield className="w-3 h-3" />}
                            {role === 'pre-autorizado' && <FiClock className="w-3 h-3" />}
                            {role === 'usuario' && <FiUser className="w-3 h-3" />}
                            {role}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Eliminar */}
                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => setConfirmDialog({
                      isOpen: true,
                      type: 'delete',
                      user
                    })}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col bg-white/40 backdrop-blur-sm">
        {/* Información en cards pequeñas */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/80 hover:bg-white/90 border-gray-200 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border flex flex-col items-center justify-center">
            <div className={`${getRoleIconBg(user.rol)} p-2 rounded-lg mb-1`}>
              {getRoleIcon(user.rol)}
            </div>
            <div className="text-xs font-medium truncate" style={{color: user.rol === 'admin' ? '#dc2626' : user.rol === 'pre-autorizado' ? '#ea580c' : '#2563eb'}}>
              {user.rol}
            </div>
          </div>

          <div className={`${(user.email_verificado || user.emailVerificado || user.email_verificado || user.verificado) ? 'bg-white/80 hover:bg-white/90 border-green-200' : 'bg-white/80 hover:bg-white/90 border-yellow-200'} rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border flex flex-col items-center justify-center`}>
            <div className={`${(user.email_verificado || user.emailVerificado || user.email_verificado || user.verificado) ? 'bg-green-500' : 'bg-yellow-500'} p-2 rounded-lg mb-1`}>
              {(user.email_verificado || user.emailVerificado || user.email_verificado || user.verificado) ? (
                <FiCheckCircle className="w-3 h-3 text-white transition-transform duration-200" />
              ) : (
                <FiClock className="w-3 h-3 text-white transition-transform duration-200" />
              )}
            </div>
            <div className={`text-xs font-medium ${(user.email_verificado || user.emailVerificado || user.email_verificado || user.verificado) ? 'text-green-700' : 'text-yellow-700'}`}>
              {(user.email_verificado || user.emailVerificado || user.email_verificado || user.verificado) ? 'Verificado' : 'Pendiente'}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex-1">
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              INFORMACIÓN
            </p>
            <div className="space-y-2 bg-white/60 p-3 rounded-lg border border-white/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email:</span>
                <span className="text-sm font-medium text-gray-900 truncate ml-2" title={user.correo}>
                  {user.correo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Registro:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(
                    user.creadoEn ||
                    user.fechaCreacion || 
                    user.fecha_creacion || 
                    user.createdAt || 
                    user.created_at || 
                    user.fechaRegistro || 
                    user.fecha_registro || 
                    user.registeredAt || 
                    user.registered_at ||
                    user.updatedAt ||
                    user.updated_at
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción - Solo para otros usuarios */}
        {user.id !== currentUser?.id && (
          <div className="space-y-2">
            {/* Botón de eliminar */}
            <button
              onClick={() => setConfirmDialog({
                isOpen: true,
                type: 'delete',
                user
              })}
              className="grupo/eliminar w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
              title="Eliminar"
            >
              <FiTrash2 className="w-4 h-4 grupo-hover/eliminar:scale-125 grupo-hover/eliminar:rotate-12 transition-all duration-300" />
              <span className="grupo-hover/eliminar:font-bold transition-all duration-200">
                Eliminar
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
