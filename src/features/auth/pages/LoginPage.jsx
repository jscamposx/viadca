import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiMail,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0); // segundos restantes en cooldown

  // Contador de cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Verificar si hay mensaje de éxito (ej: verificación de email)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  // Manejar redirección después del login exitoso
  useEffect(() => {
    if (loginSuccess && user) {
      console.log('🔀 Redirigiendo usuario:', user.usuario, 'con rol:', user.rol);
      
      if (user.rol === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true, state: { message: '¡Bienvenido!' } });
      }
    }
  }, [user, loginSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    }

    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await login(formData);
      
      // Marcar login como exitoso para que el useEffect maneje la redirección
      setLoginSuccess(true);
      
    } catch (error) {
      console.error('Error de login:', error);

      const rawMsg = String(error?.response?.data?.message || '');
      const isTooMany = error?.response?.status === 429 || /too many requests|throttlerexception/i.test(rawMsg);

      if (isTooMany) {
        // Usar Retry-After si está presente, de lo contrario 30s
        const retryHeader = error?.response?.headers?.['retry-after'];
        let retryAfter = parseInt(retryHeader, 10);
        if (Number.isNaN(retryAfter) || retryAfter <= 0) retryAfter = 30;
        setCooldown(retryAfter);
        setMessage(`Has realizado demasiados intentos. Por tu seguridad, espera ${retryAfter}s e inténtalo más tarde.`);
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 401) {
        setMessage('Credenciales incorrectas');
      } else if (error.response?.status === 403) {
        setMessage('Debes verificar tu email antes de iniciar sesión');
      } else {
        setMessage('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessage = cooldown > 0
    ? `Has realizado demasiados intentos. Por tu seguridad, espera ${cooldown}s e inténtalo más tarde.`
    : message;

  const isSuccessMessage = displayMessage.includes('verificación') || displayMessage.includes('éxito');
  const isDisabled = isLoading || cooldown > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-xl inline-block mb-4">
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 mt-2">
            Accede a tu panel de administración
          </p>
        </div>

        {/* Mensaje de estado */}
        {displayMessage && (
          <div className={`p-4 rounded-xl mb-6 ${
            isSuccessMessage
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              {isSuccessMessage ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{displayMessage}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Campo Usuario */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span>Usuario</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                    errors.usuario
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                  placeholder="Ingresa tu usuario"
                  disabled={isDisabled}
                />
              </div>
              {errors.usuario && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.usuario}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-blue-600" />
                  <span>Contraseña</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 ${
                    errors.contrasena
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                  placeholder="Ingresa tu contraseña"
                  disabled={isDisabled}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isDisabled}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.contrasena && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.contrasena}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : cooldown > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>Espera {cooldown}s</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FiLogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-gray-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
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

export default LoginPage;
