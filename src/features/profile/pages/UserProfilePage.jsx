import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiSave,
  FiX,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiRefreshCw,
  FiKey,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../api/authService";
import PageTransition from "../../../components/ui/PageTransition";

const UserProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setFormData({
        nombre:
          user.nombre || user.nombre_completo || user.nombreCompleto || "",
        correo: user.correo || user.email || "",
      });
    }
  }, [user]);

  const isInitialLoading = !user;
  const isVerified = Boolean(
    user?.email_verificado || user?.emailVerificado || user?.verificado,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInitialLoading) return;
    setLoading(true);
    setMessage(null);
    try {
      const prevNombre =
        user?.nombre || user?.nombre_completo || user?.nombreCompleto || "";
      const prevCorreo = user?.correo || user?.email || "";
      const nombreChanged = formData.nombre !== prevNombre;
      const emailChanged = formData.correo !== prevCorreo;
      const updateData = {};
      if (nombreChanged) updateData.nombre = formData.nombre;
      if (emailChanged) updateData.email = formData.correo;
      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "info", text: "No hay cambios para guardar" });
        setIsEditing(false);
        return;
      }
      await authService.updateProfile(updateData);
      const refreshed = await updateProfile();
      let successText = "Perfil actualizado exitosamente";
      if (emailChanged && nombreChanged)
        successText =
          "Nombre y correo actualizados. Revisa tu bandeja para verificar el nuevo correo.";
      else if (emailChanged)
        successText = "Correo actualizado. Revisa tu bandeja para verificarlo.";
      else if (nombreChanged) successText = "Nombre actualizado correctamente.";
      if (
        emailChanged &&
        !(refreshed?.email_verificado || refreshed?.emailVerificado)
      ) {
        successText +=
          " Tu cuenta permanecerá no verificada hasta confirmar el nuevo correo.";
      }
      setMessage({ type: "success", text: successText });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre:
        user?.nombre || user?.nombre_completo || user?.nombreCompleto || "",
      correo: user?.correo || user?.email || "",
    });
    setIsEditing(false);
    setMessage(null);
  };

  const sendPasswordReset = async () => {
    if (!user) return;
    setPwdLoading(true);
    setPwdMsg(null);
    try {
      await authService.forgotPassword(user.correo || user.email);
      setPwdMsg({
        type: "success",
        text: "Correo de restablecimiento enviado. Revisa tu bandeja.",
      });
    } catch (err) {
      setPwdMsg({
        type: "error",
        text: err.response?.data?.message || "Error al enviar el correo.",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const refreshProfile = async () => {
    setLoading(true);
    try {
      await updateProfile();
      setMessage({
        type: "success",
        text: "Perfil sincronizado con el servidor",
      });
    } catch (e) {
      setMessage({ type: "error", text: "No se pudo sincronizar el perfil" });
    } finally {
      setLoading(false);
    }
  };

  // Utilidad para construir iniciales del usuario
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header mínimo con solo "Volver" */}
        <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <button
                onClick={() => {
                  const fromState = location.state?.from;
                  const referrer = document.referrer;
                  if (fromState && typeof fromState === "string") {
                    navigate(fromState, { replace: true });
                    return;
                  }
                  if (referrer && new URL(referrer).origin === window.location.origin) {
                    // Solo navegar si el referrer es del mismo origen
                    navigate(-1);
                    return;
                  }
                  // Fallback al home
                  navigate("/", { replace: true });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-700 hover:text-blue-700 hover:border-blue-300 hover:bg-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Volver</span>
              </button>
              {/* Sin logo ni iconos adicionales en la página de perfil */}
              <div />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado del perfil (look atractivo, con avatar de iniciales) */}
          <div className="relative rounded-2xl overflow-hidden shadow border border-blue-100/60 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" aria-hidden="true" />
            <div className="px-3 sm:px-8 py-4 sm:py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200 shadow-sm">
                    <span className="text-lg sm:text-xl font-extrabold text-slate-800">
                      {getInitials(
                        user?.nombre ||
                          user?.nombre_completo ||
                          user?.nombreCompleto ||
                          user?.usuario ||
                          "U",
                      )}
                    </span>
                  </span>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-700">
                      {user?.nombre || user?.nombre_completo || "Tu Perfil"}
                    </h1>
                    <div className="flex flex-wrap items-center mt-2 gap-2">
                      <span className="text-slate-700 flex items-center break-all">
                        <FiMail className="mr-1.5 h-4 w-4" />
                        {user?.correo || user?.email}
                      </span>
                      {isVerified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          <FiCheckCircle className="mr-1.5 h-4 w-4" /> Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <FiClock className="mr-1.5 h-4 w-4" /> No verificado
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        <FiUser className="mr-1.5 h-4 w-4" />
                        {(user?.rol || "usuario").toString().toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition w-full sm:w-auto"
                    >
                      <FiEdit className="mr-2" /> Editar perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de navegación (solo 2, desplazables en móvil) */}
          <div className="mt-4 sm:mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap px-1 -mx-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Información personal
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-sm ${
                    activeTab === "security"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Seguridad
                </button>
              </nav>
            </div>
          </div>

          {/* Mensajes */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : message.type === "error"
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {message.text}
            </div>
          )}
          {pwdMsg && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                pwdMsg.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {pwdMsg.text}
            </div>
          )}

          {/* Contenido de la pestaña activa */}
          {activeTab === "profile" ? (
            <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
              <div className="px-3 sm:px-8 py-5 sm:py-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="nombre"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Nombre completo
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FiUser className="h-5 w-5" />
                          </div>
                          <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Ingresa tu nombre completo"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="correo"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FiMail className="h-5 w-5" />
                          </div>
                          <input
                            type="email"
                            name="correo"
                            id="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Ingresa tu correo electrónico"
                          />
                        </div>
                        {formData.correo !== (user?.correo || user?.email) && (
                          <p className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg flex items-start">
                            <FiClock className="mr-2 mt-0.5 flex-shrink-0" />
                            Al guardar, deberás verificar este nuevo correo.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-5 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <FiUser className="mr-2 text-blue-500" />
                          Información personal
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Nombre completo
                            </p>
                            <p className="text-gray-900 font-medium mt-1">
                              {formData.nombre || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Correo electrónico
                            </p>
                            <p className="text-gray-900 font-medium mt-1">
                              {formData.correo || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <FiShield className="mr-2 text-blue-500" />
                          Estado de la cuenta
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Verificación
                            </p>
                            <div className="mt-1">
                              {isVerified ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  <FiCheckCircle className="mr-1.5 h-4 w-4" />{" "}
                                  Verificada
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                  <FiClock className="mr-1.5 h-4 w-4" />{" "}
                                  Pendiente de verificación
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Rol</p>
                            <div className="mt-1">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <FiUser className="mr-1.5 h-4 w-4" />
                                {(user?.rol || "usuario")
                                  .toString()
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-700 flex items-start">
                        <FiKey className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-medium">Nota:</span> Solo puedes
                          actualizar tu nombre y correo electrónico. Al cambiar
                          el correo, se enviará un nuevo email de verificación y
                          tu cuenta quedará no verificada hasta confirmarlo.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "security" ? (
            <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
              <div className="px-3 sm:px-8 py-5 sm:py-6">
                <div className="max-w-3xl space-y-6">
                  <div className="relative p-6 bg-white rounded-2xl transition-all duration-300 border border-slate-200 hover:shadow-md">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-t-2xl" aria-hidden="true" />
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FiLock className="h-6 w-6" />
                      </div>
                      <div className="ml-5 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          Restablecer contraseña
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Te enviaremos un enlace a tu correo electrónico para
                          restablecer tu contraseña.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={sendPasswordReset}
                            disabled={pwdLoading}
                            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {pwdLoading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Enviando...
                              </>
                            ) : (
                              "Enviar enlace de restablecimiento"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 bg-white rounded-2xl transition-all duration-300 border border-slate-200 hover:shadow-md">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400 rounded-t-2xl" aria-hidden="true" />
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                        <FiShield className="h-6 w-6" />
                      </div>
                      <div className="ml-5 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          Verificación de correo
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          {isVerified
                            ? "Tu correo electrónico está verificado."
                            : "Tu correo electrónico aún no está verificado. Revisa tu bandeja de entrada y la carpeta de spam."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-6 bg-white rounded-2xl transition-all duration-300 border border-slate-200 hover:shadow-md">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-t-2xl" aria-hidden="true" />
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiRefreshCw className="h-6 w-6" />
                      </div>
                      <div className="ml-5 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          Sincronizar perfil
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Vuelve a cargar tus datos desde el servidor para
                          asegurarte de tener la información más reciente.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={refreshProfile}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Sincronizando...
                              </>
                            ) : (
                              "Actualizar datos ahora"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Fallback: si hubiera otro valor de tab, mostramos el perfil
            <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
              <div className="px-4 sm:px-8 py-6">Contenido no disponible</div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;
