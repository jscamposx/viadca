import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token de recuperación no válido o expirado");
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Token de recuperación no válido");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await resetPassword(token, formData.password);
      setIsSuccess(true);
      setMessage(response.message || "Contraseña restablecida correctamente");

      // Redirigir después de un momento
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Contraseña restablecida. Puedes iniciar sesión con tu nueva contraseña.",
          },
        });
      }, 3000);
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setMessage("Token inválido o expirado");
      } else {
        setMessage("Error al restablecer la contraseña. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Vista para token inválido
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="w-full max-w-[28rem] sm:max-w-md md:max-w-lg">
          {/* Volver al inicio - Mobile */}
          <div className="sm:hidden mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
          </div>

          {/* Tarjeta de error */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 py-6 px-6 sm:px-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiAlertCircle
                    className="w-8 h-8 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center">
                Enlace No Válido
              </h1>
              <p className="text-red-100 text-center mt-1">
                El enlace de recuperación no es válido o ha expirado
              </p>
            </div>

            {/* Contenido */}
            <div className="p-6 sm:p-8">
              <div className="text-center">
                <p
                  className="text-gray-700 mb-8 leading-relaxed"
                  role="alert"
                  aria-live="assertive"
                >
                  Por favor, solicita un nuevo enlace de recuperación para
                  restablecer tu contraseña.
                </p>

                <div className="space-y-4">
                  <Link
                    to="/forgot-password"
                    className="w-full inline-block bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Solicitar Nuevo Enlace
                  </Link>

                  <Link
                    to="/login"
                    className="inline-block text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Link al home - Desktop */}
          <div className="hidden sm:block text-center mt-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium inline-flex items-center gap-1"
            >
              <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista para restablecimiento exitoso
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="w-full max-w-[28rem] sm:max-w-md md:max-w-lg">
          {/* Volver al inicio - Mobile */}
          <div className="sm:hidden mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
          </div>

          {/* Tarjeta de éxito */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-6 px-6 sm:px-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiCheckCircle
                    className="w-8 h-8 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center">
                ¡Contraseña Restablecida!
              </h1>
              <p className="text-green-100 text-center mt-1">
                Tu nueva contraseña ha sido guardada
              </p>
            </div>

            {/* Contenido */}
            <div className="p-6 sm:p-8">
              <div className="text-center">
                <p
                  className="text-gray-700 mb-8 leading-relaxed"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>

                <Link
                  to="/login"
                  className="w-full inline-block bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Iniciar Sesión
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
              <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista del formulario
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="w-full max-w-[28rem] sm:max-w-md md:max-w-lg">
          {/* Volver al inicio - Mobile */}
          <div className="sm:hidden mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cabecera con gradiente */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 px-6 sm:px-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiShield className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center">
                Restablecer Contraseña
              </h1>
              <p className="text-indigo-100 text-center mt-1">
                Crea una nueva contraseña segura
              </p>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 sm:p-8">
              {/* Mensaje de estado */}
              {message && (
                <div
                  className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700"
                  role="alert"
                  aria-live="assertive"
                >
                  <FiAlertCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Nueva Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <FiLock
                        className="w-4 h-4 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span>Nueva Contraseña</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                        errors.password
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 bg-gray-50 hover:bg-white"
                      }`}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isLoading}
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <FiEye className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-red-600 text-sm mt-2 flex items-center gap-2"
                      role="alert"
                    >
                      <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Campo Confirmar Contraseña */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <FiLock
                        className="w-4 h-4 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span>Confirmar Contraseña</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 bg-gray-50 hover:bg-white"
                      }`}
                      placeholder="Confirma tu nueva contraseña"
                      disabled={isLoading}
                      autoComplete="new-password"
                      required
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar confirmación"
                          : "Mostrar confirmación"
                      }
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <FiEye className="w-5 h-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="text-red-600 text-sm mt-2 flex items-center gap-2"
                      role="alert"
                    >
                      <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Consejos de seguridad */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                    <FiShield className="w-4 h-4" aria-hidden="true" />
                    Consejos de Seguridad
                  </h3>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Usa al menos 6 caracteres</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Combina letras, números y símbolos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Evita información personal o patrones simples</span>
                    </li>
                  </ul>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      ></div>
                      <span>Restableciendo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FiSave className="w-5 h-5" aria-hidden="true" />
                      <span>Restablecer Contraseña</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Enlace para volver al login */}
              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Volver al inicio de sesión
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
              <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPasswordPage;
