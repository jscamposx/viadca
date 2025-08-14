import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiMail,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiSend,
  FiLock,
  FiHelpCircle,
} from "react-icons/fi";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El email no es válido");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await forgotPassword(email);
      setIsSuccess(true);
      setMessage(
        response.message ||
          "Se ha enviado un enlace de recuperación a tu email",
      );
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error al enviar el email de recuperación. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* Panel visual para escritorio */}
        <div className="hidden md:flex md:w-1/2 min-h-screen relative bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-500/20 rounded-full blur-3xl"></div>
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
                <div className="text-green-200 text-sm">by Zafiro Tours</div>
              </div>

              <div className="mt-16 max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Seguridad ante todo
                </h2>
                <p className="text-green-100 opacity-90">
                  Protegemos tus datos y te ayudamos a recuperar el acceso a tu
                  cuenta de forma segura.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-green-200 text-sm">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span>+50,000 viajeros protegidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0">
          <div className="w-full max-w-md p-4 md:p-6">
            {/* Cabecera para móvil */}
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full inline-flex">
                  <FiCheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                ¡Email Enviado!
              </h1>
              <p className="text-gray-600">Revisa tu bandeja de entrada</p>
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
                    ¡Email Enviado!
                  </h1>
                  <p className="text-gray-500">Revisa tu bandeja de entrada</p>
                </div>

                {/* Mensaje */}
                <div className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700">
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{message}</span>
                </div>

                <div className="space-y-6">
                  <Link
                    to="/login"
                    className="w-full inline-block text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Volver al Login
                  </Link>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                      setMessage("");
                    }}
                    className="w-full text-center text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Enviar otro email
                  </button>
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
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ¿No recibiste el email?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Revisa tu carpeta de spam o solicita un nuevo enlace. El
                    enlace es válido por 1 hora.
                  </p>
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
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 overflow-hidden">
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
                  Recupera tu acceso
                </h2>
                <p className="text-indigo-100 opacity-90">
                  Te ayudaremos a restablecer tu contraseña de forma segura y
                  rápida.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-indigo-200 text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Sistema de seguridad certificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0">
          <div className="w-full max-w-md p-4 md:p-6">
            {/* Cabecera para móvil */}
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full inline-flex">
                  <FiLock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Recuperar Contraseña
              </h1>
              <p className="text-gray-600">Te enviaremos un enlace seguro</p>
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
                    Recuperar Contraseña
                  </h1>
                  <p className="text-gray-500">
                    Ingresa tu email para recibir un enlace seguro
                  </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700">
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiMail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 ${
                          error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        placeholder="usuario@ejemplo.com"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Botón de Envío */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <span>Enviar Enlace</span>
                          <FiSend className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Enlaces adicionales */}
                <div className="mt-8 pt-5 border-t border-gray-200">
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
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ¿Cómo funciona?
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      </span>
                      <span>Recibirás un email con un enlace seguro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      </span>
                      <span>El enlace es válido por 1 hora</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      </span>
                      <span>Podrás crear una nueva contraseña</span>
                    </li>
                  </ul>
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

export default ForgotPasswordPage;
