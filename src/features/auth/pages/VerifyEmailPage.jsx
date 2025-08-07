import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
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
        setMessage(response.message || 'Email verificado correctamente');
      } catch (error) {
        console.error('Error de verificación:', error);
        setStatus('error');
        
        if (error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error al verificar el email. El token puede haber expirado.');
        }
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <FiLoader className="w-16 h-16 text-blue-600 animate-spin" />;
      case 'success':
        return <FiCheckCircle className="w-16 h-16 text-green-600" />;
      case 'error':
        return <FiAlertCircle className="w-16 h-16 text-red-600" />;
      default:
        return <FiMail className="w-16 h-16 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'from-blue-50 via-indigo-50 to-blue-50';
      case 'success':
        return 'from-green-50 via-emerald-50 to-green-50';
      case 'error':
        return 'from-red-50 via-pink-50 to-red-50';
      default:
        return 'from-gray-50 via-slate-50 to-gray-50';
    }
  };

  const getCardColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50';
      case 'error':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50';
      default:
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getStatusColor()} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className={`${getCardColor()} rounded-2xl shadow-xl border p-8 text-center`}>
          {/* Icono */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {status === 'loading' && 'Verificando Email'}
            {status === 'success' && '¡Email Verificado!'}
            {status === 'error' && 'Error de Verificación'}
          </h1>

          {/* Mensaje */}
          <p className={`text-base sm:text-lg mb-8 ${
            status === 'success' ? 'text-green-700' :
            status === 'error' ? 'text-red-700' :
            'text-gray-600'
          }`}>
            {status === 'loading' && 'Procesando tu verificación de email...'}
            {status === 'success' && message}
            {status === 'error' && message}
          </p>

          {/* Botones de acción */}
          {status === 'success' && (
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full inline-block bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/"
                className="block text-green-600 hover:text-green-700 text-sm transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Link
                to="/register"
                className="w-full inline-block bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Registrarse de Nuevo
              </Link>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Intentar Iniciar Sesión
                </Link>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Por favor espera mientras verificamos tu email...
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        {status === 'success' && (
          <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">¡Bienvenido al sistema!</h3>
            <p className="text-sm text-green-700">
              Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión y acceder a todas las funcionalidades.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-red-700">
              Si continúas teniendo problemas, contacta al administrador del sistema o intenta registrarte nuevamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
