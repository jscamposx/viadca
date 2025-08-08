import React, { useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit, FiSave, FiX, FiCheckCircle, FiClock, FiKey } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../../../api/authService';

const AdminProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || user.nombre_completo || '',
        correo: user.correo || user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updateData = {};
      if (formData.nombre !== (user.nombre || user.nombre_completo || '')) {
        updateData.nombre = formData.nombre;
      }
      if (formData.correo !== (user.correo || user.email || '')) {
        updateData.email = formData.correo;
      }

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: 'info', text: 'No hay cambios para guardar' });
        setIsEditing(false);
        return;
      }

      const response = await authService.updateProfile(updateData);
      await updateProfile();

      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre || user.nombre_completo || '',
      correo: user.correo || user.email || ''
    });
    setIsEditing(false);
    setMessage(null);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'pre-autorizado': return 'Pre-autorizado';
      default: return 'Usuario';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'pre-autorizado': return 'bg-gradient-to-br from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-br from-indigo-500 to-indigo-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Error en fecha';
    }
  };

  const isVerified = user.email_verificado || user.emailVerificado || user.verificado;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header con avatar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">
                {getInitials(user.nombre || user.nombre_completo || user.usuario)}
              </span>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${getRoleColor(user.rol)}`}>
              <FiShield className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {user.nombre || user.nombre_completo || user.usuario}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.rol)} text-white shadow-sm`}>
                {getRoleLabel(user.rol)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isVerified ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-amber-500 to-amber-600'
              } text-white shadow-sm flex items-center gap-1`}>
                {isVerified ? <FiCheckCircle className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                {isVerified ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800'
              : message.type === 'error'
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800'
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800'
          } shadow-sm transition-all duration-300 animate-fadeIn`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' && <FiCheckCircle className="w-6 h-6 flex-shrink-0" />}
              {message.type === 'error' && <FiX className="w-6 h-6 flex-shrink-0" />}
              {message.type === 'info' && <FiClock className="w-6 h-6 flex-shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Panel principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Encabezado del panel */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Información del perfil</h2>
              <p className="text-gray-600">Gestiona tu información personal</p>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <FiEdit className="w-4 h-4" />
                <span>Editar perfil</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  disabled={loading}
                >
                  <FiSave className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar cambios'}</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Contenido */}
          <div className="p-5">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiUser className="w-4 h-4" />
                      <span>Nombre completo</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full p-3.5 pl-12 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300"
                        placeholder="Ingresa tu nombre completo"
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="correo" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      <span>Correo electrónico</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className="w-full p-3.5 pl-12 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300"
                        placeholder="Ingresa tu correo electrónico"
                      />
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiShield className="w-4 h-4" />
                      <span>Rol</span>
                    </label>
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user.rol)}`}>
                        <FiShield className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{getRoleLabel(user.rol)}</span>
                    </div>
                  </div>

                  {/* Usuario */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiKey className="w-4 h-4" />
                      <span>Nombre de usuario</span>
                    </label>
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-900">{user.usuario}</span>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    <span>Nombre completo</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">{user.nombre || user.nombre_completo || 'No especificado'}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiMail className="w-4 h-4" />
                    <span>Correo electrónico</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FiMail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{user.correo || user.email}</span>
                  </div>
                </div>

                {/* Rol */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiShield className="w-4 h-4" />
                    <span>Rol</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user.rol)}`}>
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{getRoleLabel(user.rol)}</span>
                  </div>
                </div>

                {/* Usuario */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiKey className="w-4 h-4" />
                    <span>Nombre de usuario</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900">{user.usuario}</span>
                  </div>
                </div>

                {/* Fecha de registro */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>Miembro desde</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatDate(
                        user.creadoEn || user.createdAt || user.created_at || 
                        user.fechaCreacion || user.fecha_creacion || user.fechaRegistro
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Estado de verificación */}
            <div className={`mt-8 p-5 rounded-xl border ${
              isVerified && formData.correo === (user.correo || user.email)
                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                  isVerified && formData.correo === (user.correo || user.email)
                    ? 'bg-green-500'
                    : 'bg-amber-500'
                }`}>
                  {isVerified && formData.correo === (user.correo || user.email) ? (
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <FiClock className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold ${
                    isVerified && formData.correo === (user.correo || user.email)
                      ? 'text-green-800'
                      : 'text-amber-800'
                  }`}>
                    {isVerified && formData.correo === (user.correo || user.email)
                      ? 'Cuenta verificada' 
                      : (isEditing && formData.correo !== (user.correo || user.email))
                        ? 'Verificación requerida'
                        : 'Verificación pendiente'}
                  </h3>
                  <p className={`mt-1 ${
                    isVerified && formData.correo === (user.correo || user.email)
                      ? 'text-green-700'
                      : 'text-amber-700'
                  }`}>
                    {isVerified && formData.correo === (user.correo || user.email)
                      ? 'Tu cuenta ha sido verificada correctamente' 
                      : (isEditing && formData.correo !== (user.correo || user.email))
                        ? 'Al cambiar tu correo electrónico, necesitarás verificar la nueva dirección'
                        : 'Tu cuenta está pendiente de verificación. Por favor revisa tu correo.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;