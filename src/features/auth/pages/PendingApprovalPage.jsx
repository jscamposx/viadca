import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PageTransition from '../../../components/ui/PageTransition';
import {
  FiClock,
  FiMail,
  FiShield,
  FiRefreshCw,
  FiHome,
  FiLogOut,
  FiUser,
  FiCheckCircle,
  FiArrowLeft,
  FiHelpCircle,
  FiAlertTriangle
} from 'react-icons/fi';

const PendingApprovalPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario fue aprobado
  useEffect(() => {
    if (user && user.rol === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    try {
      await updateProfile();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="w-full max-w-2xl">
          {/* Volver al inicio - Mobile */}
          <div className="sm:hidden mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200">
          {/* Cabecera con gradiente */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-8 px-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FiClock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Cuenta Pendiente de Aprobación
            </h1>
            <p className="text-amber-100 text-center">
              Tu registro está siendo revisado por nuestro equipo
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8">
            {/* Información del usuario */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mb-8 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Información de tu cuenta</h3>
                  <p className="text-sm text-amber-600">Estado actual del registro</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-600 font-medium">Usuario:</span>
                  </div>
                  <p className="font-medium text-gray-800 truncate">{user?.usuario}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-600 font-medium">Email:</span>
                  </div>
                  <p className="font-medium text-gray-800 truncate">{user?.correo}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-600 font-medium">Estado:</span>
                  </div>
                  <p className="font-medium text-amber-600">Pre-autorizado</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600 font-medium">Email verificado:</span>
                  </div>
                  <p className="font-medium text-green-600">Verificado</p>
                </div>
              </div>
            </div>

            {/* Mensaje principal */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <FiShield className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  ¡Gracias por registrarte!
                </h2>
                <p className="text-gray-600 mb-4">
                  Tu cuenta ha sido creada exitosamente y tu email ha sido verificado. 
                  Ahora estamos revisando tu solicitud para darte acceso completo al panel de administración.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5" />
                  ¿Qué sigue?
                </h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <FiCheckCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Un administrador revisará tu solicitud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <FiCheckCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Recibirás un email cuando tu cuenta sea aprobada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                      <FiCheckCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Podrás acceder al panel administrativo completo</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Estado de progreso */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Estado del Proceso</h3>
              
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">Registro</span>
                <span className="text-xs text-gray-600">Verificación</span>
                <span className="text-xs text-gray-600">Aprobación</span>
                <span className="text-xs text-gray-600">Acceso</span>
              </div>
              
              <div className="relative mb-1">
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
                <div className="relative flex justify-between">
                  <div className="z-10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="z-10">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="z-10">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="z-10">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 rounded-full" style={{ width: '66%' }}></div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-green-600 font-medium">Completado</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-green-600 font-medium">Completado</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-amber-600 font-medium">En proceso</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 font-medium">Pendiente</span>
                </div>
              </div>
            </div>

            {/* Tiempo estimado */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-8 border border-gray-200 flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Tiempo estimado de aprobación</h4>
                <p className="text-sm text-gray-600">
                  Normalmente procesamos las solicitudes en <span className="font-medium text-blue-600">24-48 horas</span>
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleRefresh}
                className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FiRefreshCw className="w-6 h-6" />
                <span>Verificar Estado</span>
              </button>
              
              <Link
                to="/"
                className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FiHome className="w-6 h-6" />
                <span>Ir al Inicio</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-semibold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FiLogOut className="w-6 h-6" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <FiMail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600">
                Si tienes alguna pregunta sobre tu solicitud, puedes contactarnos en{' '}
                <a href="mailto:admin@viajes.com" className="text-amber-600 hover:text-amber-700 font-medium">
                  admin@viajes.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Link al home - Desktop */}
        <div className="hidden sm:block text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 transition-colors font-medium inline-flex items-center gap-1"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PendingApprovalPage;