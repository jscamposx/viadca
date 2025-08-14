import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
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
      if (user.rol === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true, state: { message: "¡Bienvenido!" } });
      }
    }
  }, [user, loginSuccess, navigate]);

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

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es requerido";
    }

    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es requerida";
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
    setMessage("");

    try {
      const response = await login(formData);
      setLoginSuccess(true);
    } catch (error) {
      const rawMsg = String(error?.response?.data?.message || "");
      const isTooMany =
        error?.response?.status === 429 ||
        /too many requests|throttlerexception/i.test(rawMsg);

      if (isTooMany) {
        const retryHeader = error?.response?.headers?.["retry-after"];
        let retryAfter = parseInt(retryHeader, 10);
        if (Number.isNaN(retryAfter) || retryAfter <= 0) retryAfter = 30;
        setCooldown(retryAfter);
        setMessage(
          `Has realizado demasiados intentos. Por tu seguridad, espera ${retryAfter}s e inténtalo más tarde.`,
        );
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 401) {
        setMessage("Credenciales incorrectas");
      } else if (error.response?.status === 403) {
        setMessage("Debes verificar tu email antes de iniciar sesión");
      } else {
        setMessage("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessage =
    cooldown > 0
      ? `Has realizado demasiados intentos. Por tu seguridad, espera ${cooldown}s e inténtalo más tarde.`
      : message;

  const isSuccessMessage =
    displayMessage.includes("verificación") ||
    displayMessage.includes("éxito") ||
    displayMessage.includes("Bienvenido");
  const isDisabled = isLoading || cooldown > 0;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Panel visual para escritorio */}
        <div className="hidden md:flex md:w-1/2 min-h-screen relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

            {/* Patrón geométrico */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-16 h-16 rounded-lg border-2 border-white rotate-45"></div>
              <div className="absolute top-40 right-20 w-24 h-24 rounded-lg border-2 border-white rotate-12"></div>
              <div className="absolute bottom-20 left-1/3 w-20 h-20 rounded-lg border-2 border-white rotate-30"></div>
            </div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold">VIADCA</div>
                <div className="text-indigo-200 text-sm">by Zafiro Tours</div>
              </div>

              <div className="mt-16 max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Descubre el mundo con nosotros
                </h2>
                <p className="text-indigo-100 opacity-90">
                  Accede a tu cuenta para gestionar tus reservas, ver tus viajes
                  próximos y descubrir nuevas experiencias.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-indigo-200 text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>+50,000 viajeros satisfechos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Adaptable a cualquier altura */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0">
          <div className="w-full max-w-md p-4 md:p-6">
            {/* Cabecera para móvil */}
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full inline-flex">
                  <FiLogIn className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">Accede a tu cuenta</p>
            </div>

            {/* Volver al inicio */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium group"
              >
                <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Volver al inicio</span>
              </Link>
            </div>

            {/* Contenedor del formulario con altura adaptable */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Título para escritorio */}
                <div className="hidden md:block mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Iniciar Sesión
                  </h1>
                  <p className="text-gray-500">
                    Ingresa tus credenciales para acceder
                  </p>
                </div>

                {/* Mensaje de estado */}
                {displayMessage && (
                  <div
                    className={`p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in ${
                      isSuccessMessage
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {isSuccessMessage ? (
                      <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-medium">
                      {displayMessage}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo Usuario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usuario o correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                          errors.usuario
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        placeholder="usuario@ejemplo.com"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiLock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-11 py-3.5 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                          errors.contrasena
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        placeholder="••••••••"
                        disabled={isDisabled}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isDisabled}
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.contrasena && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.contrasena}
                      </p>
                    )}
                  </div>

                  {/* Opciones adicionales */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Recordar sesión
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                    >
                      ¿Olvidaste contraseña?
                    </Link>
                  </div>

                  {/* Botón de Inicio de Sesión */}
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Iniciando sesión...</span>
                        </>
                      ) : cooldown > 0 ? (
                        <>
                          <FiAlertCircle className="w-5 h-5" />
                          <span>Espera {cooldown}s</span>
                        </>
                      ) : (
                        <>
                          <span>Iniciar Sesión</span>
                          <FiLogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Separador */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">
                      ¿Eres nuevo?
                    </span>
                  </div>
                </div>

                {/* Crear cuenta */}
                <div>
                  <Link
                    to="/register"
                    className="w-full block text-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-3.5 px-6 rounded-xl shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Crear nueva cuenta</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pie de página móvil */}
            <div className="mt-4 text-center text-gray-500 text-sm md:hidden">
              © {new Date().getFullYear()} VIADCA by Zafiro Tours
            </div>
          </div>
        </div>

        {/* Pie de página desktop */}
        <div className="hidden md:block absolute bottom-0 right-0 p-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} VIADCA by Zafiro Tours. Todos los
          derechos reservados.
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
