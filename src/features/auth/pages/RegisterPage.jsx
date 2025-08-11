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
  FiCheckCircle
} from 'react-icons/fi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    // Campos opcionales soportados por backend
    nombre: '',
    // eliminado nombre_completo
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
      console.error('Error de registro:', error);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-green-600 to-blue-700 p-4 rounded-2xl shadow-xl inline-block mb-4">
            <FiUserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 mt-2">
            Regístrate para acceder al sistema
          </p>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            message.includes('exitoso') || message.includes('Verifica') || message.includes('Verifica tu email')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              {message.includes('exitoso') || message.includes('Verifica') || message.includes('Verifica tu email') ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiAlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{message}</span>
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
                  <FiUser className="w-4 h-4 text-green-600" />
                  <span>Usuario</span>
                </div>
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 ${
                  errors.usuario
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
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
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-green-600" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 ${
                  errors.correo
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
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
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-green-600" />
                  <span>Nombre (opcional)</span>
                </div>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                placeholder="Ej: Juan Pérez"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Este campo es opcional.</p>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-green-600" />
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
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 ${
                    errors.contrasena
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
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
              <label htmlFor="confirmarContrasena" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4 text-green-600" />
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
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 ${
                    errors.confirmarContrasena
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
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

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          {/* Enlaces adicionales */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-center text-sm">
              <span className="text-gray-600">¿Ya tienes cuenta? </span>
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Inicia sesión
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

export default RegisterPage;
