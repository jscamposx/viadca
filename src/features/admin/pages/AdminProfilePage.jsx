import React, { useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit, FiSave, FiX, FiCheckCircle, FiClock } from 'react-icons/fi';
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
      // Enviar solo los campos que han cambiado
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
      await updateProfile(); // Actualizar contexto con datos frescos

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {getInitials(user.nombre || user.nombre_completo || user.usuario)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal</p>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700'
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <FiCheckCircle className="w-5 h-5" />}
              {message.type === 'error' && <FiX className="w-5 h-5" />}
              {message.type === 'info' && <FiClock className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Información del Usuario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  <FiX className="w-4 h-4" />
                  Cancelar
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  <FiSave className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Formulario de edición */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre completo</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="correo" className="text-sm font-medium text-gray-700">Correo electrónico</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <FiMail className="w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900"
                      placeholder="Ingresa tu correo electrónico"
                    />
                  </div>
                </div>

                {/* Rol (solo lectura) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rol</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border">
                    <FiShield className="w-5 h-5 text-gray-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.rol === 'admin' 
                        ? 'bg-red-100 text-red-700' 
                        : user.rol === 'pre-autorizado'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rol === 'admin' ? 'Administrador' : user.rol === 'pre-autorizado' ? 'Pre-autorizado' : 'Usuario'}
                    </span>
                  </div>
                </div>

                {/* Usuario (solo lectura) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre de usuario</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border">
                    <FiUser className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900">{user.usuario}</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vista de solo lectura */}
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FiUser className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{user.nombre || user.nombre_completo || 'No especificado'}</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FiMail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{user.correo || user.email}</span>
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rol</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FiShield className="w-5 h-5 text-gray-500" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.rol === 'admin' 
                      ? 'bg-red-100 text-red-700' 
                      : user.rol === 'pre-autorizado'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.rol === 'admin' ? 'Administrador' : user.rol === 'pre-autorizado' ? 'Pre-autorizado' : 'Usuario'}
                  </span>
                </div>
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre de usuario</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FiUser className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{user.usuario}</span>
                </div>
              </div>

              {/* Fecha de registro */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Miembro desde</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FiCalendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">
                    {(() => {
                      // Buscar campo de fecha de creación
                      const dateField = user.creadoEn || user.createdAt || user.created_at || 
                                       user.fechaCreacion || user.fecha_creacion || user.fechaRegistro;
                      
                      if (dateField) {
                        try {
                          const date = new Date(dateField);
                          // Verificar que la fecha es válida
                          if (isNaN(date.getTime())) {
                            return 'Fecha inválida';
                          }
                          return date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } catch (error) {
                          return 'Error en fecha';
                        }
                      }
                      return 'No disponible';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Estado de verificación */}
          <div className={`mt-6 p-4 rounded-lg border ${
            (user.email_verificado || user.emailVerificado || user.verificado) && 
            formData.correo === (user.correo || user.email)
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                (user.email_verificado || user.emailVerificado || user.verificado) && 
                formData.correo === (user.correo || user.email)
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}></div>
              <span className={`font-medium ${
                (user.email_verificado || user.emailVerificado || user.verificado) && 
                formData.correo === (user.correo || user.email)
                  ? 'text-green-700'
                  : 'text-yellow-700'
              }`}>
                {(user.email_verificado || user.emailVerificado || user.verificado) && 
                 formData.correo === (user.correo || user.email)
                  ? 'Cuenta verificada' 
                  : (isEditing && formData.correo !== (user.correo || user.email))
                    ? 'Verificación requerida'
                    : 'Verificación pendiente'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              (user.email_verificado || user.emailVerificado || user.verificado) && 
              formData.correo === (user.correo || user.email)
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}>
              {(user.email_verificado || user.emailVerificado || user.verificado) && 
               formData.correo === (user.correo || user.email)
                ? 'Tu cuenta ha sido verificada correctamente' 
                : (isEditing && formData.correo !== (user.correo || user.email))
                  ? 'Al cambiar tu correo electrónico, necesitarás verificar la nueva dirección'
                  : 'Tu cuenta está pendiente de verificación'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
