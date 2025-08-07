import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiClock,
  FiMail,
  FiShield,
  FiRefreshCw,
  FiHome,
  FiLogOut,
  FiUser,
  FiCheckCircle
} from 'react-icons/fi';

const PendingApprovalPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario fue aprobado
  useEffect(() => {
    if (user && user.rol === 'admin') {
      // Usuario fue aprobado, redirigir al dashboard
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    try {
      await updateProfile();
      // Si el usuario fue aprobado, el useEffect de arriba se encargará de la redirección
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-block mb-4">
              <FiClock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Cuenta Pendiente de Aprobación
            </h1>
            <p className="text-orange-100 text-sm sm:text-base">
              Tu registro está siendo revisado por nuestro equipo
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8">
            {/* Información del usuario */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">Información de tu cuenta</h3>
                  <p className="text-sm text-orange-600">Estado actual del registro</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Usuario:</span>
                  <span className="ml-2 font-medium text-gray-800">{user?.usuario}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-800">{user?.correo}</span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="ml-2 font-medium text-orange-600">Pre-autorizado</span>
                </div>
                <div>
                  <span className="text-gray-600">Email verificado:</span>
                  <span className="ml-2 font-medium text-green-600 flex items-center gap-1">
                    <FiCheckCircle className="w-4 h-4" />
                    Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Mensaje principal */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <FiShield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  ¡Gracias por registrarte!
                </h2>
                <p className="text-gray-600 mb-4">
                  Tu cuenta ha sido creada exitosamente y tu email ha sido verificado. 
                  Ahora estamos revisando tu solicitud para darte acceso completo al panel de administración.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">¿Qué sigue?</h3>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• Un administrador revisará tu solicitud</li>
                    <li>• Recibirás un email cuando tu cuenta sea aprobada</li>
                    <li>• Podrás acceder al panel administrativo completo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Estado de progreso */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Estado del Proceso</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Registro</span>
                <span className="text-xs text-gray-600">Verificación</span>
                <span className="text-xs text-gray-600">Aprobación</span>
                <span className="text-xs text-gray-600">Acceso</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 rounded-full" style={{ width: '66%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Completado</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Completado</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3 text-orange-500 animate-pulse" />
                  <span className="text-xs text-orange-600">En proceso</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Pendiente</span>
                </div>
              </div>
            </div>

            {/* Tiempo estimado */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-8 border border-gray-200">
              <div className="flex items-center gap-3">
                <FiClock className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Tiempo estimado de aprobación</h4>
                  <p className="text-sm text-gray-600">
                    Normalmente procesamos las solicitudes en <span className="font-medium text-blue-600">24-48 horas</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiRefreshCw className="w-5 h-5" />
                Verificar Estado
              </button>
              
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiHome className="w-5 h-5" />
                Ir al Inicio
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiLogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <FiMail className="w-4 h-4 text-orange-600" />
              ¿Necesitas ayuda?
            </h3>
            <p className="text-sm text-gray-600">
              Si tienes alguna pregunta sobre tu solicitud, puedes contactarnos en{' '}
              <a href="mailto:admin@viajes.com" className="text-orange-600 hover:text-orange-700 font-medium">
                admin@viajes.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
