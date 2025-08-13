import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiArrowLeft,
  FiUserCheck,
  FiHelpCircle
} from 'react-icons/fi';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  
  const token = searchParams.get('token');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no válido');
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || '¡Tu email ha sido verificado correctamente!');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Error al verificar el email. El token puede haber expirado.');
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <FiLoader className="w-16 h-16 text-indigo-600 animate-spin" />,
          bg: "from-indigo-50 via-blue-50 to-purple-50",
          card: "border-indigo-200 bg-white",
          text: "text-indigo-700",
          title: "Verificando Email",
          button: "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
        };
      case 'success':
        return {
          icon: <FiCheckCircle className="w-16 h-16 text-green-600" />,
          bg: "from-green-50 via-emerald-50 to-teal-50",
          card: "border-green-200 bg-white",
          text: "text-green-700",
          title: "¡Email Verificado!",
          button: "from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
        };
      case 'error':
        return {
          icon: <FiAlertCircle className="w-16 h-16 text-red-600" />,
          bg: "from-red-50 via-rose-50 to-orange-50",
          card: "border-red-200 bg-white",
          text: "text-red-700",
          title: "Error de Verificación",
          button: "from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800"
        };
      default:
        return {
          icon: <FiMail className="w-16 h-16 text-gray-600" />,
          bg: "from-gray-50 via-slate-50 to-gray-50",
          card: "border-gray-200 bg-white",
          text: "text-gray-600",
          title: "Verificación de Email",
          button: "from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800"
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${statusConfig.bg} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Volver al inicio - Mobile */}
        <div className="sm:hidden mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Tarjeta principal */}
        <div className={`rounded-2xl shadow-xl overflow-hidden border border-gray-100`}>
          {/* Cabecera con gradiente */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 px-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FiUserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              {statusConfig.title}
            </h1>
            <p className="text-indigo-100 text-center mt-1">
              {status === 'loading' 
                ? 'Estamos procesando tu verificación' 
                : status === 'success' 
                  ? 'Tu cuenta ha sido verificada' 
                  : 'Hubo un problema con la verificación'}
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8">
            {/* Icono de estado */}
            <div className="flex justify-center mb-6">
              {statusConfig.icon}
            </div>

            {/* Mensaje */}
            <p className={`text-center text-base sm:text-lg mb-8 ${statusConfig.text}`}>
              {message}
            </p>

            {/* Botones de acción */}
            {status === 'success' && (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className={`w-full inline-block bg-gradient-to-r ${statusConfig.button} text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
                >
                  Iniciar Sesión
                </Link>
                <div className="text-center">
                  <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className={`flex-1 text-center bg-gradient-to-r ${statusConfig.button} text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    Registrarse de Nuevo
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors"
                  >
                    Intentar Iniciar Sesión
                  </Link>
                </div>
                <div className="text-center">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Por favor espera mientras verificamos tu email...
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-700">
                    Este proceso puede tomar unos segundos. No cierres esta página.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        {status === 'success' && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-1">¡Cuenta verificada!</h3>
                <p className="text-sm text-green-700">
                  Ahora puedes acceder a todas las funciones del sistema. Te recomendamos completar tu perfil para una mejor experiencia.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-red-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <FiHelpCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">¿Necesitas ayuda?</h3>
                <p className="text-sm text-red-700">
                  Si continúas teniendo problemas, contacta a nuestro equipo de soporte en soporte@empresa.com o intenta registrarte nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}

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
  );
};

export default VerifyEmailPage;