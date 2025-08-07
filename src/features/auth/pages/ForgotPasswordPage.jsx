import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiMail,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiSend
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
      console.error('Error al solicitar recuperación:', error);
      
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FiCheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              ¡Email Enviado!
            </h1>
            
            <p className="text-green-700 mb-6 leading-relaxed">
              {message}
            </p>
            
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full inline-block bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Volver al Login
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                  setMessage('');
                }}
                className="w-full text-green-600 hover:text-green-700 text-sm transition-colors"
              >
                Enviar otro email
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Nota:</strong> Revisa también tu carpeta de spam. El enlace es válido por 1 hora.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-xl inline-block mb-4">
            <FiMail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600 mt-2">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="p-4 rounded-xl mb-6 bg-red-50 border border-red-200 text-red-700">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Campo Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-blue-600" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                  error
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link
                to="/login"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Volver al Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-gray-700 transition-colors"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Recibirás un email con un enlace seguro</li>
            <li>• El enlace es válido por 1 hora</li>
            <li>• Podrás crear una nueva contraseña</li>
          </ul>
        </div>

        {/* Link al home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-700 text-sm transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
