import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiMail,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiSend,
  FiLock,
  FiHelpCircle
} from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El email no es válido');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(email);
      setIsSuccess(true);
      setMessage(response.message || 'Se ha enviado un enlace de recuperación a tu email');
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al enviar el email de recuperación. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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

          {/* Tarjeta de éxito */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-6 px-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiCheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center">
                ¡Email Enviado!
              </h1>
              <p className="text-green-100 text-center mt-1">
                Revisa tu bandeja de entrada
              </p>
            </div>

            {/* Contenido */}
            <div className="p-6 sm:p-8">
              <div className="text-center">
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {message}
                </p>
                
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="w-full inline-block bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Volver al Login
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                      setMessage('');
                    }}
                    className="w-full text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Enviar otro email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FiHelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">¿No recibiste el email?</h3>
                <p className="text-sm text-gray-600">
                  Revisa tu carpeta de spam o solicita un nuevo enlace. El enlace es válido por 1 hora.
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
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Cabecera con gradiente */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 px-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FiLock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Recuperar Contraseña
            </h1>
            <p className="text-indigo-100 text-center mt-1">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8">
            {/* Mensaje de estado */}
            {error && (
              <div className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-indigo-600" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                    error
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 bg-gray-50 hover:bg-white'
                  }`}
                  placeholder="Ingresa tu email registrado"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiSend className="w-5 h-5" />
                    <span>Enviar Enlace</span>
                  </div>
                )}
              </button>
            </form>

            {/* Enlaces adicionales */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center gap-2"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Volver al Login</span>
                </Link>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <FiHelpCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">¿Cómo funciona?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recibirás un email con un enlace seguro</li>
                <li>• El enlace es válido por 1 hora</li>
                <li>• Podrás crear una nueva contraseña</li>
              </ul>
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
  );
};

export default ForgotPasswordPage;