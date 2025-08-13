import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft
} from 'react-icons/fi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    nombre: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

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

    // Validar usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario = 'El usuario solo puede contener letras, números y guiones bajos';
    }

    // Validar email
    if (!formData.correo.trim()) {
      newErrors.correo = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Confirma tu contraseña';
    } else if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
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
      // Construir payload: incluir solo presentes (nombre opcional)
      const { confirmarContrasena, nombre, usuario, correo, contrasena } = formData;
      const dataToSend = { usuario, correo, contrasena };
      if (nombre && String(nombre).trim() !== '') {
        dataToSend.nombre = String(nombre).trim();
      }

      await register(dataToSend);
      
      setMessage('Registro exitoso. Intentando iniciar sesión...');
      
      // Intentar auto-login
      try {
        const resp = await login({ usuario: formData.usuario, contrasena: formData.contrasena });
        const rol = resp?.usuario?.rol;
        if (rol === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true, state: { message: '¡Bienvenido! Tu cuenta fue creada.' } });
        }
      } catch (loginErr) {
        // Si no se puede iniciar sesión (p.ej., debe verificar email), enviar a Home con mensaje
        navigate('/', { replace: true, state: { message: 'Cuenta creada. Verifica tu email antes de iniciar sesión.' } });
      }
      
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 409) {
        setMessage('El usuario o email ya están registrados');
      } else {
        setMessage('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessMessage = message.includes('exitoso') || 
                          message.includes('Verifica') || 
                          message.includes('Bienvenido');

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
                <FiUserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Crear Cuenta</h1>
            <p className="text-indigo-100 text-center mt-1">
              Regístrate para acceder al sistema
            </p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8">
            {/* Mensaje de estado */}
            {message && (
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
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Usuario */}
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-indigo-600" />
                    <span>Usuario</span>
                  </div>
                </label>
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
                  placeholder="Ej: juan_perez"
                  disabled={isLoading}
                />
                {errors.usuario && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.usuario}
                  </p>
                )}
              </div>

              {/* Campo Email */}
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-indigo-600" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                    errors.correo
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 bg-gray-50 hover:bg-white'
                  }`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                {errors.correo && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.correo}
                  </p>
                )}
              </div>

              {/* Campo Nombre (opcional) */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-indigo-600" />
                    <span>Nombre (opcional)</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 border-gray-300 bg-gray-50 hover:bg-white"
                  placeholder="Ej: Juan Pérez"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Este campo es opcional.</p>
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
                    placeholder="Mínimo 6 caracteres"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
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

              {/* Campo Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiLock className="w-4 h-4 text-indigo-600" />
                    <span>Confirmar Contraseña</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                      errors.confirmarContrasena
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 bg-gray-50 hover:bg-white'
                    }`}
                    placeholder="Confirma tu contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmarContrasena && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.confirmarContrasena}
                  </p>
                )}
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    Al registrarme, acepto los{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Términos y Condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Política de Privacidad
                    </Link>
                  </label>
                </div>
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
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiUserPlus className="w-5 h-5" />
                    <span>Crear Cuenta</span>
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
                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>

            {/* Iniciar sesión */}
            <div>
              <Link
                to="/login"
                className="w-full block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-300"
              >
                Iniciar sesión
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

export default RegisterPage;