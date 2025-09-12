import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiArrowLeft,
  FiUserCheck,
  FiHelpCircle,
  FiShield,
} from "react-icons/fi";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de verificación no válido");
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(
          response.message || "¡Tu email ha sido verificado correctamente!",
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Error al verificar el email. El token puede haber expirado.",
        );
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: (
            <FiLoader
              className="w-16 h-16 text-indigo-600 animate-spin"
              aria-hidden="true"
            />
          ),
          bg: "from-indigo-50 to-blue-50",
          card: "border-indigo-200 bg-white",
          text: "text-indigo-700",
          title: "Verificando Email",
          button:
            "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700",
          gradient: "from-indigo-600 to-blue-600",
        };
      case "success":
        return {
          icon: (
            <FiCheckCircle
              className="w-16 h-16 text-green-600"
              aria-hidden="true"
            />
          ),
          bg: "from-green-50 to-emerald-50",
          card: "border-green-200 bg-white",
          text: "text-green-700",
          title: "¡Email Verificado!",
          button:
            "from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800",
          gradient: "from-green-600 to-emerald-600",
        };
      case "error":
        return {
          icon: (
            <FiAlertCircle
              className="w-16 h-16 text-red-600"
              aria-hidden="true"
            />
          ),
          bg: "from-red-50 to-rose-50",
          card: "border-red-200 bg-white",
          text: "text-red-700",
          title: "Error de Verificación",
          button:
            "from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800",
          gradient: "from-red-600 to-rose-600",
        };
      default:
        return {
          icon: (
            <FiMail className="w-16 h-16 text-gray-600" aria-hidden="true" />
          ),
          bg: "from-gray-50 to-slate-50",
          card: "border-gray-200 bg-white",
          text: "text-gray-600",
          title: "Verificación de Email",
          button:
            "from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800",
          gradient: "from-gray-600 to-slate-600",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Panel izquierdo */}
        <div className="hidden md:flex md:w-1/2 min-h-screen relative bg-gradient-to-br from-indigo-600 to-blue-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

            <div className="absolute inset-0 opacity-20" aria-hidden="true">
              <div className="absolute top-10 left-10 w-16 h-16 rounded-lg border-2 border-white rotate-45"></div>
              <div className="absolute top-40 right-20 w-24 h-24 rounded-lg border-2 border-white rotate-12"></div>
              <div className="absolute bottom-20 left-1/3 w-20 h-20 rounded-lg border-2 border-white rotate-30"></div>
            </div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-10 lg:p-12 text-white">
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold">VIADCA</div>
                <div className="text-blue-200 text-sm">by Zafiro Tours</div>
              </div>

              <div className="mt-12 lg:mt-16 max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Verificación de cuenta
                </h2>
                <p className="text-blue-100 opacity-90">
                  Estamos verificando tu dirección de email para garantizar la
                  seguridad de tu cuenta y activar todas las funciones
                  disponibles.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-blue-200">
                <FiShield className="w-5 h-5" aria-hidden="true" />
                <span>Protección de datos garantizada</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <div
                  className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                  aria-hidden="true"
                ></div>
                <span>+50,000 viajeros satisfechos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-0">
          <div className="w-full max-w-[28rem] sm:max-w-md md:max-w-lg p-4 md:p-6">
            {/* Volver al inicio - Mobile */}
            <div className="md:hidden mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium group"
              >
                <FiArrowLeft
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <span>Volver al inicio</span>
              </Link>
            </div>

            {/* Tarjeta principal */}
            <div
              className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100`}
            >
              {/* Cabecera con gradiente */}
              <div
                className={`bg-gradient-to-r ${statusConfig.gradient} py-6 px-6 sm:px-8`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FiUserCheck
                      className="w-8 h-8 text-white"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white text-center">
                  {statusConfig.title}
                </h1>
                <p className="text-blue-100 text-center mt-1">
                  {status === "loading"
                    ? "Estamos procesando tu verificación"
                    : status === "success"
                      ? "Tu cuenta ha sido verificada"
                      : "Hubo un problema con la verificación"}
                </p>
              </div>

              {/* Contenido */}
              <div className="p-6 md:p-8">
                {/* Icono de estado */}
                <div className="flex justify-center mb-6">
                  {statusConfig.icon}
                </div>

                {/* Mensaje */}
                <p
                  className={`text-center text-base md:text-lg mb-8 ${statusConfig.text}`}
                  role={status === "error" ? "alert" : "status"}
                  aria-live={status === "error" ? "assertive" : "polite"}
                >
                  {message}
                </p>

                {/* Botones de acción */}
                {status === "success" && (
                  <div className="space-y-4">
                    <Link
                      to="/iniciar-sesion"
                      className={`w-full inline-block bg-gradient-to-r ${statusConfig.button} text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-center`}
                    >
                      Iniciar Sesión
                    </Link>
                    <div className="text-center">
                      <Link
                        to="/"
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        Volver al inicio
                      </Link>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/registro"
                        className={`text-center bg-gradient-to-r ${statusConfig.button} text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
                      >
                        Registrarse de Nuevo
                      </Link>
                      <Link
                        to="/iniciar-sesion"
                        className="text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-colors"
                      >
                        Intentar Iniciar Sesión
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Volver al inicio
                      </Link>
                    </div>
                  </div>
                )}

                {status === "loading" && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Por favor espera mientras verificamos tu email...
                    </p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <p className="text-sm text-indigo-700">
                        Este proceso puede tomar unos segundos. No cierres esta
                        página.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            {status === "success" && (
              <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiCheckCircle
                      className="w-5 h-5 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">
                      ¡Cuenta verificada!
                    </h3>
                    <p className="text-sm text-green-700">
                      Ahora puedes acceder a todas las funciones del sistema. Te
                      recomendamos completar tu perfil para una mejor
                      experiencia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                className="mt-6 p-4 bg-white rounded-xl border border-red-200 shadow-sm"
                role="note"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FiHelpCircle
                      className="w-5 h-5 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">
                      ¿Necesitas ayuda?
                    </h3>
                    <p className="text-sm text-red-700">
                      Si continúas teniendo problemas, contacta a nuestro equipo
                      de soporte en soporte@empresa.com o intenta registrarte
                      nuevamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

export default VerifyEmailPage;
