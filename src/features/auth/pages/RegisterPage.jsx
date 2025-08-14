import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    usuario: "",
    correo: "",
    nombre: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (!formData.contrasena) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.contrasena.length >= 6) strength += 25;
    if (/[A-Z]/.test(formData.contrasena)) strength += 25;
    if (/[0-9]/.test(formData.contrasena)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.contrasena)) strength += 25;

    setPasswordStrength(strength);
  }, [formData.contrasena]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario =
        "El usuario solo puede contener letras, números y guiones bajos";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El email no es válido";
    }

    if (!formData.contrasena) {
      newErrors.contrasena = "La contraseña es requerida";
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    } else if (passwordStrength < 75) {
      newErrors.contrasena = "La contraseña es demasiado débil";
    }

    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Confirma tu contraseña";
    } else if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    if (!acceptedTerms) {
      newErrors.terms = "Debes aceptar los términos y condiciones";
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
      const { confirmarContrasena, nombre, usuario, correo, contrasena } =
        formData;
      const dataToSend = { usuario, correo, contrasena };
      if (nombre && String(nombre).trim() !== "") {
        dataToSend.nombre = String(nombre).trim();
      }

      await register(dataToSend);

      setMessage("Registro exitoso. Intentando iniciar sesión...");

      try {
        const resp = await login({
          usuario: formData.usuario,
          contrasena: formData.contrasena,
        });
        const rol = resp?.usuario?.rol;
        if (rol === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", {
            replace: true,
            state: { message: "¡Bienvenido! Tu cuenta fue creada." },
          });
        }
      } catch (loginErr) {
        navigate("/", {
          replace: true,
          state: {
            message:
              "Cuenta creada. Verifica tu email antes de iniciar sesión.",
          },
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 409) {
        setMessage("El usuario o email ya están registrados");
      } else {
        setMessage("Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessMessage =
    message.includes("exitoso") ||
    message.includes("Verifica") ||
    message.includes("Bienvenido");

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = () => {
    if (!formData.contrasena) return "";
    if (passwordStrength >= 75) return "Fuerte";
    if (passwordStrength >= 50) return "Moderada";
    if (passwordStrength >= 25) return "Débil";
    return "Muy débil";
  };

  return (
    <PageTransition animationType="zoom">
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Panel izquierdo */}
        <div className="hidden md:flex md:w-1/2 min-h-screen relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

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
                  Únete a nuestra comunidad
                </h2>
                <p className="text-indigo-100 opacity-90">
                  Regístrate para acceder a descuentos exclusivos, gestionar tus
                  reservas y descubrir nuevas experiencias de viaje.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-200">
                <FiShield className="w-5 h-5" />
                <span>Protección de datos garantizada</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>+50,000 viajeros satisfechos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Optimizado para desktop */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0">
          <div className="w-full max-w-3xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 md:p-6 lg:p-8">
            {/* Cabecera para móvil */}
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full inline-flex">
                  <FiUserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Crear Cuenta
              </h1>
              <p className="text-gray-600">Únete a nuestra comunidad</p>
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

            {/* Contenedor del formulario con diseño optimizado */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 md:p-8">
                {/* Título para escritorio */}
                <div className="hidden md:block mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Crear Cuenta
                  </h1>
                  <p className="text-gray-500">
                    Completa el formulario para registrarte
                  </p>
                </div>

                {/* Mensaje de estado */}
                {message && (
                  <div
                    role="alert"
                    aria-live="polite"
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
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Campos en grid de 2 columnas para desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Columna izquierda */}
                    <div className="space-y-5">
                      {/* Campo Usuario */}
                      <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-indigo-600" />
                            <span>Usuario</span>
                          </div>
                        </label>
                        <input
                          id="usuario"
                          type="text"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                            errors.usuario
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="Ej: juan_perez"
                          disabled={isLoading}
                          aria-invalid={Boolean(errors.usuario)}
                          aria-describedby={errors.usuario ? "usuario-error" : undefined}
                        />
                        {errors.usuario && (
                          <p id="usuario-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
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
                          id="correo"
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                            errors.correo
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="tu@email.com"
                          disabled={isLoading}
                          aria-invalid={Boolean(errors.correo)}
                          aria-describedby={errors.correo ? "correo-error" : undefined}
                        />
                        {errors.correo && (
                          <p id="correo-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.correo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-5">
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
                            id="contrasena"
                            type={showPassword ? "text" : "password"}
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                              errors.contrasena
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            placeholder="Mínimo 6 caracteres"
                            disabled={isLoading}
                            aria-invalid={Boolean(errors.contrasena)}
                            aria-describedby={errors.contrasena ? "contrasena-error" : undefined}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Indicador de fuerza de contraseña */}
                        {formData.contrasena && (
                          <div className="mt-2" aria-live="polite">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1" aria-hidden="true">
                              <div
                                className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Seguridad</span>
                              <span className="font-medium text-gray-700">
                                {getPasswordStrengthText()}
                              </span>
                            </div>
                          </div>
                        )}

                        {errors.contrasena && (
                          <p id="contrasena-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
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
                            id="confirmarContrasena"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarContrasena"
                            value={formData.confirmarContrasena}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                              errors.confirmarContrasena
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            placeholder="Confirma tu contraseña"
                            disabled={isLoading}
                            aria-invalid={Boolean(errors.confirmarContrasena)}
                            aria-describedby={errors.confirmarContrasena ? "confirmar-error" : undefined}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmarContrasena && (
                          <p id="confirmar-error" className="text-red-600 text-sm mt-2 flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4" />
                            {errors.confirmarContrasena}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Campo Nombre completo - Ancho completo */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-indigo-600" />
                        <span>Nombre completo (opcional)</span>
                      </div>
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 border-gray-300 hover:border-gray-400"
                      placeholder="Ej: Juan Pérez"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Términos y Condiciones */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        aria-invalid={Boolean(errors.terms)}
                        aria-describedby={errors.terms ? "terms-error" : undefined}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-600">
                        Acepto los{" "}
                        <Link
                          to="/terminos"
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Términos y Condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link
                          to="/privacidad"
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Política de Privacidad
                        </Link>
                      </label>
                      {errors.terms && (
                        <p id="terms-error" className="text-red-600 text-sm mt-1 flex items-center gap-2">
                          <FiAlertCircle className="w-4 h-4" />
                          {errors.terms}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
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
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">
                      ¿Ya tienes cuenta?
                    </span>
                  </div>
                </div>

                {/* Iniciar sesión */}
                <div>
                  <Link
                    to="/login"
                    className="w-full block text-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-3.5 px-6 rounded-xl shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Iniciar sesión</span>
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

export default RegisterPage;
