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
  FiCheckCircle,
  FiArrowLeft
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
  const [cooldown, setCooldown] = useState(0);

  // Contador de cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Verificar si hay mensaje de éxito
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  // Manejar redirección después del login exitoso
  useEffect(() => {
    if (loginSuccess && user) {
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
      setLoginSuccess(true);
    } catch (error) {
      const rawMsg = String(error?.response?.data?.message || '');
      const isTooMany = error?.response?.status === 429 || /too many requests|throttlerexception/i.test(rawMsg);

      if (isTooMany) {
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

  const isSuccessMessage = displayMessage.includes('verificación') || 
                           displayMessage.includes('éxito') || 
                           displayMessage.includes('Bienvenido');
  const isDisabled = isLoading || cooldown > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="w-full max-w-md">
        {/* Volver al inicio - Mobile First */}
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
                <FiLogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Iniciar Sesión</h1>
            <p className="text-indigo-100 text-center mt-1">
              Accede a tu cuenta
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8">
            {/* Mensaje de estado */}
            {displayMessage && (
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                isSuccessMessage
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {isSuccessMessage ? (
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{displayMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Usuario */}
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-indigo-600" />
                    <span>Usuario o correo electrónico</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                      errors.usuario
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder="Ingresa tu usuario o email"
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
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiLock className="w-4 h-4 text-indigo-600" />
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
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                      errors.contrasena
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 bg-gray-50 hover:bg-white'
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

              {/* Recordar contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordar sesión
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
              </div>
            </div>

            {/* Crear cuenta */}
            <div>
              <Link
                to="/register"
                className="w-full block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-300"
              >
                Crear nueva cuenta
              </Link>
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

export default LoginPage;