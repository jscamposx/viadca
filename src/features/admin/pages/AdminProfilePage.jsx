import React, { useState, useEffect } from "react";
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
  FiCamera,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || user.nombre_completo || "",
        correo: user.correo || user.email || "",
      });
    }
  }, [user]);

  const isInitialLoading = !user;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInitialLoading) return;
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
        return "from-red-500 to-red-600";
      case "pre-autorizado":
        return "from-amber-500 to-amber-600";
      default:
        return "from-indigo-500 to-indigo-600";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/50 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with hover effect removed */}
            <div 
              className="relative group"
            >
              <div 
                className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${getRoleColor(user?.rol)} rounded-full flex items-center justify-center shadow-xl`}
              >
                {isInitialLoading ? (
                  <div className="w-16 h-16 bg-white/30 rounded-full animate-pulse" />
                ) : (
                  <span className="text-white font-bold text-3xl sm:text-4xl">
                    {getInitials(
                      user?.nombre || user?.nombre_completo || user?.usuario,
                    )}
                  </span>
                )}
              </div>
              
              {/* Camera overlay (static, no animation) */}
              <div 
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 cursor-pointer"
              >
                <FiCamera className="w-8 h-8 text-white" />
              </div>

              {/* Role badge */}
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user?.rol)} shadow-lg flex items-center justify-center`}>
                <FiShield className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1">
              {isInitialLoading ? (
                <>
                  <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse mx-auto sm:mx-0 mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse mx-auto sm:mx-0" />
                </>
              ) : (
                <>
                  <h1 
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                  >
                    {user?.nombre || user?.nombre_completo || user?.usuario}
                  </h1>
                  <p 
                    className="text-slate-600 mt-1"
                  >
                    @{user?.usuario}
                  </p>
                </>
              )}

              {/* Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                {isInitialLoading ? (
                  <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
                ) : (
                  <>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold text-white shadow-md bg-gradient-to-r ${getRoleColor(user?.rol)}`}>
                      {getRoleLabel(user?.rol)}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-md flex items-center gap-1.5 ${
                      isVerified 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                    }`}>
                      {isVerified ? (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          Verificado
                        </>
                      ) : (
                        <>
                          <FiClock className="w-4 h-4" />
                          Pendiente
                        </>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={() => !isInitialLoading && setIsEditing(true)}
                  disabled={isInitialLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiEdit className="w-5 h-5" />
                  <span>Editar perfil</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiX className="w-5 h-5" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || isInitialLoading}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <FiSave className="w-5 h-5" />
                    <span>{loading ? "Guardando..." : "Guardar"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Message (keep update animations) */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-5 rounded-2xl shadow-lg ${
                message.type === "success"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800"
                  : message.type === "error"
                    ? "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {message.type === "success" && <FiCheckCircle className="w-6 h-6" />}
                {message.type === "error" && <FiX className="w-6 h-6" />}
                {message.type === "info" && <FiClock className="w-6 h-6" />}
                <span className="font-medium">{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Información del perfil
            </h2>
            <p className="text-white/80 mt-1">
              Gestiona tu información personal
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Editable Fields */}
                  <div 
                    className="space-y-3"
                  >
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-indigo-600" />
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm"
                      placeholder="Ingresa tu nombre completo"
                      disabled={isInitialLoading || loading}
                    />
                  </div>

                  <div 
                    className="space-y-3"
                  >
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiMail className="w-5 h-5 text-indigo-600" />
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm"
                      placeholder="Ingresa tu correo electrónico"
                      disabled={isInitialLoading || loading}
                    />
                  </div>

                  {/* Read-only Fields */}
                  <div className="space-y-3 opacity-75">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiShield className="w-5 h-5 text-slate-500" />
                      Rol del sistema
                    </label>
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor(user?.rol)} flex items-center justify-center`}>
                          <FiShield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {getRoleLabel(user?.rol)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 opacity-75">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiKey className="w-5 h-5 text-slate-500" />
                      Nombre de usuario
                    </label>
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-300 flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {user?.usuario || "No disponible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2 opacity-75">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiCalendar className="w-5 h-5 text-slate-500" />
                      Miembro desde
                    </label>
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <FiCalendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">
                            {formatDate(
                              user?.creadoEn ||
                                user?.createdAt ||
                                user?.created_at ||
                                user?.fechaCreacion ||
                                user?.fecha_creacion ||
                                user?.fechaRegistro,
                            ) || "No disponible"}
                          </p>
                          <p className="text-sm text-slate-500">
                            Fecha de registro
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Mode */}
                <div 
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-indigo-600" />
                    Nombre completo
                  </label>
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200">
                    <p className="font-medium text-slate-800">
                      {user?.nombre || user?.nombre_completo || "No especificado"}
                    </p>
                  </div>
                </div>

                <div 
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiMail className="w-5 h-5 text-indigo-600" />
                    Correo electrónico
                  </label>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                    <p className="font-medium text-slate-800">
                      {user?.correo || user?.email || "No disponible"}
                    </p>
                  </div>
                </div>

                <div 
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiShield className="w-5 h-5 text-indigo-600" />
                    Rol del sistema
                  </label>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <p className="font-medium text-slate-800">
                      {getRoleLabel(user?.rol)}
                    </p>
                  </div>
                </div>

                <div 
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiKey className="w-5 h-5 text-indigo-600" />
                    Nombre de usuario
                  </label>
                  <div className="p-4 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl border border-slate-300">
                    <p className="font-medium text-slate-800">
                      {user?.usuario || "No disponible"}
                    </p>
                  </div>
                </div>

                <div 
                  className="space-y-3 md:col-span-2"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                    Miembro desde
                  </label>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                    <p className="font-medium text-slate-800">
                      {formatDate(
                        user?.creadoEn ||
                          user?.createdAt ||
                          user?.created_at ||
                          user?.fechaCreacion ||
                          user?.fecha_creacion ||
                          user?.fechaRegistro,
                      ) || "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Status (static, no entrance animation) */}
            <div 
              className={`mt-8 p-6 rounded-2xl shadow-lg ${
                isVerified && formData.correo === (user.correo || user.email)
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0 sm:shrink ${
                    isVerified && formData.correo === (user.correo || user.email)
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : "bg-gradient-to-br from-amber-500 to-orange-600"
                  }`}
                >
                  {isVerified && formData.correo === (user.correo || user.email) ? (
                    <FiCheckCircle className="w-6 h-6 text-white shrink-0" />
                  ) : (
                    <FiClock className="w-6 h-6 text-white shrink-0" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      isVerified && formData.correo === (user.correo || user.email)
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {isVerified && formData.correo === (user.correo || user.email)
                      ? "Cuenta verificada"
                      : isEditing && formData.correo !== (user.correo || user.email)
                        ? "Verificación requerida"
                        : "Verificación pendiente"}
                  </h3>
                  <p
                    className={`mt-1 ${
                      isVerified && formData.correo === (user.correo || user.email)
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {isVerified && formData.correo === (user.correo || user.email)
                      ? "Tu cuenta ha sido verificada correctamente"
                      : isEditing && formData.correo !== (user.correo || user.email)
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