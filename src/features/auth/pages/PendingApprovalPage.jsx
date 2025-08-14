import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import PageTransition from "../../../components/ui/PageTransition";
import {
  FiClock,
  FiMail,
  FiShield,
  FiRefreshCw,
  FiHome,
  FiLogOut,
  FiUser,
  FiCheckCircle,
  FiArrowLeft,
  FiHelpCircle,
  FiAlertTriangle,
  FiChevronRight,
} from "react-icons/fi";

const PendingApprovalPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.rol === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    try {
      await updateProfile();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Panel izquierdo */}
        <div className="hidden md:flex md:w-1/2 min-h-screen relative bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
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
                <div className="text-amber-200 text-sm">by Zafiro Tours</div>
              </div>

              <div className="mt-12 lg:mt-16 max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Aprobación Pendiente
                </h2>
                <p className="text-amber-100 opacity-90">
                  Estamos revisando tu solicitud para garantizar que cumples con
                  todos los requisitos necesarios para acceder al panel
                  administrativo.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-200">
                <FiShield className="w-5 h-5" aria-hidden="true" />
                <span>Proceso de verificación seguro</span>
              </div>
              <div className="flex items-center gap-2 text-amber-200">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
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
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors font-medium group"
              >
                <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <span>Volver al inicio</span>
              </Link>
            </div>

            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200">
              {/* Cabecera con gradiente */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-6 px-6 sm:px-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FiClock className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Cuenta Pendiente de Aprobación
                </h1>
                <p className="text-amber-100 text-center">
                  Tu registro está siendo revisado por nuestro equipo
                </p>
              </div>

              {/* Contenido */}
              <div className="p-6 md:p-8">
                {/* Información del usuario */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mb-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-500 p-2 rounded-lg">
                      <FiUser className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800">
                        Información de tu cuenta
                      </h3>
                      <p className="text-sm text-amber-600">
                        Estado actual del registro
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FiUser className="w-4 h-4 text-amber-600" aria-hidden="true" />
                        <span className="text-gray-600 font-medium">
                          Usuario:
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 truncate">
                        {user?.usuario}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FiMail className="w-4 h-4 text-amber-600" aria-hidden="true" />
                        <span className="text-gray-600 font-medium">
                          Email:
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 truncate">
                        {user?.correo}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FiAlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                          <span className="text-gray-600 font-medium">
                            Estado:
                          </span>
                        </div>
                        <p className="font-medium text-amber-600">
                          Pre-autorizado
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FiCheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                          <span className="text-gray-600 font-medium">
                            Email:
                          </span>
                        </div>
                        <p className="font-medium text-green-600">Verificado</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje principal */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-4">
                      <FiShield className="w-8 h-8 text-blue-600" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      ¡Gracias por registrarte!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Tu cuenta ha sido creada exitosamente y tu email ha sido
                      verificado. Ahora estamos revisando tu solicitud para
                      darte acceso completo al panel de administración.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <FiHelpCircle className="w-5 h-5" aria-hidden="true" />
                      ¿Qué sigue?
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5" aria-hidden="true">
                          <FiChevronRight className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>Un administrador revisará tu solicitud</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5" aria-hidden="true">
                          <FiChevronRight className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>
                          Recibirás un email cuando tu cuenta sea aprobada
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5" aria-hidden="true">
                          <FiChevronRight className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>
                          Podrás acceder al panel administrativo completo
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Estado de progreso */}
                <div className="mb-6" aria-label="Estado del proceso de aprobación">
                  <h3 className="font-semibold text-gray-800 mb-4 text-center">
                    Estado del Proceso
                  </h3>

                  <div className="relative mb-1">
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-gray-200 rounded-full" aria-hidden="true"></div>
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 rounded-full"
                      style={{ width: "66%" }}
                    ></div>
                    <div className="relative flex justify-between">
                      <div className="z-10">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="z-10">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="z-10">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-pulse" aria-live="polite">
                          <FiClock className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="z-10">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <FiClock className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 text-center" aria-hidden="true">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-green-600 font-medium">
                        Registro
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Completado
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-green-600 font-medium">
                        Verificación
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Completado
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-amber-600 font-medium">
                        Aprobación
                      </span>
                      <span className="text-xs text-amber-600 font-medium">
                        En proceso
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 font-medium">
                        Acceso
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Pendiente
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tiempo estimado */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200 flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiClock className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Tiempo estimado de aprobación
                    </h4>
                    <p className="text-sm text-gray-600">
                      Normalmente procesamos las solicitudes en{" "}
                      <span className="font-medium text-blue-600">
                        24-48 horas
                      </span>
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={handleRefresh}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    aria-label="Verificar estado"
                  >
                    <FiRefreshCw className="w-5 h-5" aria-hidden="true" />
                    <span>Verificar Estado</span>
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FiHome className="w-5 h-5" aria-hidden="true" />
                      <span>Ir al Inicio</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      aria-label="Cerrar sesión"
                    >
                      <FiLogOut className="w-5 h-5" aria-hidden="true" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <FiMail className="w-5 h-5 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ¿Necesitas ayuda?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Si tienes alguna pregunta sobre tu solicitud, puedes
                    contactarnos en{" "}
                    <a
                      href="mailto:admin@viajes.com"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      admin@viajes.com
                    </a>
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
    </PageTransition>
  );
};

export default PendingApprovalPage;
