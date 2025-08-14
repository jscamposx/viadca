import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiEdit,
  FiSave,
  FiX,
  FiCheckCircle,
  FiClock,
  FiKey,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../api/authService";

const AdminProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || user.nombre_completo || "",
        correo: user.correo || user.email || "",
      });
    }
  }, [user]);

  const isInitialLoading = !user; // Mejora LCP: no bloquear layout

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInitialLoading) return; // Evitar enviar si aún no hay usuario
    setLoading(true);
    setMessage(null);

    try {
      const updateData = {};
      if (formData.nombre !== (user?.nombre || user?.nombre_completo || "")) {
        updateData.nombre = formData.nombre;
      }
      if (formData.correo !== (user?.correo || user?.email || "")) {
        updateData.email = formData.correo;
      }

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "info", text: "No hay cambios para guardar" });
        setIsEditing(false);
        return;
      }

      const response = await authService.updateProfile(updateData);
      await updateProfile();

      setMessage({ type: "success", text: "Perfil actualizado exitosamente" });
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
      nombre: user?.nombre || user?.nombre_completo || "",
      correo: user?.correo || user?.email || "",
    });
    setIsEditing(false);
    setMessage(null);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "pre-autorizado":
        return "Pre-autorizado";
      default:
        return "Usuario";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-br from-red-500 to-red-600";
      case "pre-autorizado":
        return "bg-gradient-to-br from-amber-500 to-amber-600";
      default:
        return "bg-gradient-to-br from-indigo-500 to-indigo-600";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Error en fecha";
    }
  };

  const isVerified = Boolean(
    user?.email_verificado || user?.emailVerificado || user?.verificado,
  );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header con avatar - siempre visible, usa skeletons en carga */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              {isInitialLoading ? (
                <div className="w-12 h-12 bg-white/30 rounded-xl animate-pulse" />
              ) : (
                <span className="text-white font-bold text-3xl">
                  {getInitials(
                    user?.nombre || user?.nombre_completo || user?.usuario,
                  )}
                </span>
              )}
            </div>
            <div
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${getRoleColor(user?.rol)}`}
            >
              <FiShield className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            {isInitialLoading ? (
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mx-auto sm:mx-0 mb-2" />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {user?.nombre || user?.nombre_completo || user?.usuario}
              </h1>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 min-h-[36px]">
              {isInitialLoading ? (
                <>
                  <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.rol)} text-white shadow-sm`}
                  >
                    {getRoleLabel(user?.rol)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isVerified
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-amber-500 to-amber-600"
                    } text-white shadow-sm flex items-center gap-1`}
                  >
                    {isVerified ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : (
                      <FiClock className="w-4 h-4" />
                    )}
                    {isVerified ? "Verificado" : "Pendiente"}
                  </span>
                </>
              )}
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => !isInitialLoading && setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isInitialLoading}
            >
              <FiEdit className="w-4 h-4" />
              <span>Editar perfil</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <FiX className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || isInitialLoading}
              >
                <FiSave className="w-4 h-4" />
                <span>{loading ? "Guardando..." : "Guardar cambios"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800"
                : message.type === "error"
                  ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800"
            } shadow-sm transition-all duration-300 animate-fadeIn`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" && (
                <FiCheckCircle className="w-6 h-6 flex-shrink-0" />
              )}
              {message.type === "error" && (
                <FiX className="w-6 h-6 flex-shrink-0" />
              )}
              {message.type === "info" && (
                <FiClock className="w-6 h-6 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Panel principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Encabezado del panel */}
          <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-indigo-100/50 p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Información del perfil
              </h2>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Gestiona tu información personal
              </p>
            </div>
            {/* Botones de acción ya están en el header superior */}
          </div>
          {/* Contenido */}
          <div className="p-5">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre (editable) */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nombre"
                      className="text-sm font-medium text-gray-700 flex items-center gap-1"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Nombre completo</span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Editable
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full p-3.5 pl-12 bg-white rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm disabled:opacity-60"
                        placeholder="Ingresa tu nombre completo"
                        disabled={isInitialLoading || loading}
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    </div>
                  </div>

                  {/* Email (editable) */}
                  <div className="space-y-2">
                    <label
                      htmlFor="correo"
                      className="text-sm font-medium text-gray-700 flex items-center gap-1"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>Correo electrónico</span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Editable
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className="w-full p-3.5 pl-12 bg-white rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm disabled:opacity-60"
                        placeholder="Ingresa tu correo electrónico"
                        disabled={isInitialLoading || loading}
                      />
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    </div>
                  </div>

                  {/* Rol (solo lectura) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiShield className="w-4 h-4" />
                      <span>Rol</span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <FiLock className="w-3 h-3" /> No editable
                      </span>
                    </label>
                    <div
                      className="relative p-3.5 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-3 cursor-not-allowed select-none"
                      aria-readonly="true"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user?.rol)}`}
                      >
                        <FiShield className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {getRoleLabel(user?.rol)}
                      </span>
                      <FiLock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Usuario (solo lectura) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiKey className="w-4 h-4" />
                      <span>Nombre de usuario</span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <FiLock className="w-3 h-3" /> No editable
                      </span>
                    </label>
                    <div
                      className="relative p-3.5 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-3 cursor-not-allowed select-none"
                      aria-readonly="true"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {user?.usuario || (isInitialLoading ? "—" : "")}
                      </span>
                      <FiLock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Miembro desde (solo lectura) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>Miembro desde</span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <FiLock className="w-3 h-3" /> No editable
                      </span>
                    </label>
                    <div
                      className="relative p-4 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-3 cursor-not-allowed select-none"
                      aria-readonly="true"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-200 flex items-center justify-center">
                        <FiCalendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        {isInitialLoading ? (
                          <div className="h-5 w-44 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">
                            {formatDate(
                              user?.creadoEn ||
                                user?.createdAt ||
                                user?.created_at ||
                                user?.fechaCreacion ||
                                user?.fecha_creacion ||
                                user?.fechaRegistro,
                            )}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Fecha de registro (no editable)
                        </p>
                      </div>
                      <FiLock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    <span>Nombre completo</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    {isInitialLoading ? (
                      <div className="h-5 w-44 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {user?.nombre ||
                          user?.nombre_completo ||
                          "No especificado"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiMail className="w-4 h-4" />
                    <span>Correo electrónico</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FiMail className="w-5 h-5 text-blue-600" />
                    </div>
                    {isInitialLoading ? (
                      <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {user?.correo || user?.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rol */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiShield className="w-4 h-4" />
                    <span>Rol</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user?.rol)}`}
                    >
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    {isInitialLoading ? (
                      <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {getRoleLabel(user?.rol)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Usuario */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiKey className="w-4 h-4" />
                    <span>Nombre de usuario</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-gray-700" />
                    </div>
                    {isInitialLoading ? (
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {user?.usuario}
                      </span>
                    )}
                  </div>
                </div>

                {/* Fecha de registro */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>Miembro desde</span>
                  </label>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-purple-600" />
                    </div>
                    {isInitialLoading ? (
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <span className="font-medium text-gray-900">
                        {formatDate(
                          user?.creadoEn ||
                            user?.createdAt ||
                            user?.created_at ||
                            user?.fechaCreacion ||
                            user?.fecha_creacion ||
                            user?.fechaRegistro,
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Estado de verificación */}
            <div
              className={`mt-8 p-5 rounded-xl border ${
                isVerified && formData.correo === (user.correo || user.email)
                  ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                  : "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
              }`}
            >
              <div className="flex items-center sm:items-start gap-3">
                <div
                  className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow ${
                    isVerified &&
                    formData.correo === (user.correo || user.email)
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }`}
                >
                  {isVerified &&
                  formData.correo === (user.correo || user.email) ? (
                    <FiCheckCircle className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <FiClock className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    className={`font-bold ${
                      isVerified &&
                      formData.correo === (user.correo || user.email)
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {isVerified &&
                    formData.correo === (user.correo || user.email)
                      ? "Cuenta verificada"
                      : isEditing &&
                          formData.correo !== (user.correo || user.email)
                        ? "Verificación requerida"
                        : "Verificación pendiente"}
                  </h3>
                  <p
                    className={`mt-1 ${
                      isVerified &&
                      formData.correo === (user.correo || user.email)
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {isVerified &&
                    formData.correo === (user.correo || user.email)
                      ? "Tu cuenta ha sido verificada correctamente"
                      : isEditing &&
                          formData.correo !== (user.correo || user.email)
                        ? "Al cambiar tu correo electrónico, necesitarás verificar la nueva dirección"
                        : "Tu cuenta está pendiente de verificación. Por favor revisa tu correo."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
