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
  FiSettings,
  FiShield,
  FiLogOut,
  FiGlobe,
  FiBell,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../api/authService";
import PageTransition from "../../../components/ui/PageTransition";

const UserProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
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

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header estilo moderno */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900">MiApp</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <FiBell className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <FiSettings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(user?.nombre || "U")}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado del perfil */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="absolute -bottom-16 left-8">
                <div className="bg-white p-1 rounded-full shadow-lg">
                  <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600">
                    {isInitialLoading
                      ? "..."
                      : getInitials(
                          user?.nombre ||
                            user?.nombre_completo ||
                            user?.nombreCompleto ||
                            user?.usuario,
                        )}
                  </div>
                </div>
              </div>
              <div className="absolute right-6 top-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition"
                >
                  <FiEdit className="mr-2" /> Editar perfil
                </button>
              </div>
            </div>
            <div className="pt-20 px-8 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.nombre || user?.nombre_completo || "Tu Perfil"}
                </h1>
                <div className="flex items-center mt-2 space-x-3">
                  <span className="text-gray-600 flex items-center">
                    <FiMail className="mr-1.5 h-4 w-4" />
                    {user?.correo || user?.email}
                  </span>
                  {isVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1.5 h-4 w-4" /> Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FiClock className="mr-1.5 h-4 w-4" /> No verificado
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FiUser className="mr-1.5 h-4 w-4" />
                    {(user?.rol || "usuario").toString().toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Información personal
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "security"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Seguridad
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "settings"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Configuración
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
              <div className="px-8 py-6">
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
              <div className="px-8 py-6">
                <div className="max-w-3xl space-y-6">
                  <div className="p-6 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 border border-gray-200">
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

                  <div className="p-6 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 border border-gray-200">
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

                  <div className="p-6 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 border border-gray-200">
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
            <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
              <div className="px-8 py-6">
                <div className="max-w-3xl">
                  <h2 className="text-xl font-medium text-gray-900 mb-6">
                    Configuración de la cuenta
                  </h2>

                  <div className="space-y-6">
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiGlobe className="mr-2 text-blue-500" />
                        Preferencias de idioma
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Selecciona tu idioma preferido para la interfaz de
                        usuario.
                      </p>
                      <div className="relative">
                        <select className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg">
                          <option>Español</option>
                          <option>English</option>
                          <option>Português</option>
                          <option>Français</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiBell className="mr-2 text-blue-500" />
                        Notificaciones
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Controla cómo y cuándo recibes notificaciones.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Notificaciones por correo
                            </p>
                            <p className="text-sm text-gray-500">
                              Recibe notificaciones importantes por correo
                              electrónico
                            </p>
                          </div>
                          <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Notificaciones push
                            </p>
                            <p className="text-sm text-gray-500">
                              Recibe notificaciones en este dispositivo
                            </p>
                          </div>
                          <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200">
                            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FiShield className="mr-2 text-blue-500" />
                        Privacidad
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Controla cómo otros usuarios ven tu información.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Perfil público
                            </p>
                            <p className="text-sm text-gray-500">
                              Permite que otros usuarios vean tu perfil
                            </p>
                          </div>
                          <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Mostrar actividad
                            </p>
                            <p className="text-sm text-gray-500">
                              Permite que otros vean tu actividad reciente
                            </p>
                          </div>
                          <button className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200">
                            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;
