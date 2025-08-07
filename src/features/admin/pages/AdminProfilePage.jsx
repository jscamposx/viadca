import React from 'react';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';

const AdminProfilePage = () => {
  const { user } = useAuth();

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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal</p>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiEdit className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nombre completo</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <FiUser className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">{user.nombre || 'No especificado'}</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <FiMail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rol</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <FiShield className="w-5 h-5 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.rol === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>

            {/* Fecha de registro */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Miembro desde</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <FiCalendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Estado de verificación */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Cuenta verificada</span>
            </div>
            <p className="text-green-600 text-sm mt-1">Tu cuenta ha sido verificada correctamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
