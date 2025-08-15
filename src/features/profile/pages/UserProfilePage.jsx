import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit,
  FiSave,
  FiX,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiHome,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../api/authService";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import PageTransition from "../../../components/ui/PageTransition";

// Página de perfil para cualquier usuario autenticado (no sólo admin)
// Reglas PATCH /usuarios/profile: sólo nombre y email; cambiar email => re-verificación
const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

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

  // Actualiza los datos del perfil desde el servidor (sin cambios locales)
  const refreshProfile = async () => {
    setLoading(true);
    try {
      await updateProfile();
      setMessage({ type: "success", text: "Perfil sincronizado con el servidor" });
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-rose-50 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero con gradiente y formas decorativas */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 sm:p-8 shadow-2xl border border-white/10 mb-8">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-40 h-40 border-2 border-white/20 rotate-45 rounded-xl"></div>
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/20 shadow-lg">
                  {isInitialLoading
                    ? "..."
                    : getInitials(
                        user?.nombre ||
                          user?.nombre_completo ||
                          user?.nombreCompleto ||
                          user?.usuario,
                      )}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Tu Perfil
                  </h1>
                  <p className="text-white/85">Gestiona tu información personal</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
                      {(user?.rol || "usuario").toString().toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${isVerified ? "bg-emerald-500/20 border-emerald-300 text-emerald-100" : "bg-amber-500/20 border-amber-300 text-amber-100"}`}
                    >
                      {isVerified ? "Verificado" : "Verificación pendiente"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition border border-white/20"
                >
                  <FiHome className="w-4 h-4" /> Volver al inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Mensajes globales */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border text-sm font-medium shadow-sm ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : message.type === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              {message.text}
            </div>
          )}
          {pwdMsg && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium border ${pwdMsg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {pwdMsg.text}
            </div>
          )}

          {/* Layout principal */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Columna izquierda: Información del perfil */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Información del perfil
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Actualiza tu nombre o correo electrónico
                    </p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isInitialLoading}
                      className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow disabled:opacity-60 transition"
                    >
                      <FiEdit className="inline-block mr-2" /> Editar
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-medium text-slate-800 shadow-sm disabled:opacity-60 transition"
                      >
                        <FiX className="inline-block mr-1" /> Cancelar
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow disabled:opacity-60 transition"
                      >
                        <FiSave className="inline-block mr-1" /> {loading ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor="nombre"
                            className="text-sm font-medium text-slate-700 flex items-center gap-2"
                          >
                            Nombre completo
                            <span className="text-[10px] uppercase bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                              Editable
                            </span>
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                            <input
                              id="nombre"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Ingresa tu nombre"
                              className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="correo"
                            className="text-sm font-medium text-slate-700 flex items-center gap-2"
                          >
                            Correo electrónico
                            <span className="text-[10px] uppercase bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                              Editable
                            </span>
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                            <input
                              id="correo"
                              name="correo"
                              type="email"
                              value={formData.correo}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Ingresa tu correo"
                              className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            />
                          </div>
                          {formData.correo !== (user?.correo || user?.email) && (
                            <p className="text-xs text-amber-600 mt-1">
                              Al guardar, deberás verificar este nuevo correo.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium shadow hover:shadow-lg transition-all"
                        >
                          {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={loading}
                          className="ml-4 px-6 py-3 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-60 text-slate-800 font-medium shadow-sm transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
                          <FiUser className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                            Nombre
                          </p>
                          <p className="font-medium text-slate-800">
                            {formData.nombre || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-pink-500 text-white flex items-center justify-center shadow">
                          <FiMail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                            Correo
                          </p>
                          <p className="font-medium text-slate-800 break-all">
                            {formData.correo || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 text-xs text-slate-500 space-y-1">
                    <p>
                      <span className="font-semibold">Nota:</span> Sólo puedes
                      actualizar nombre y correo desde aquí.
                    </p>
                    <p>
                      Al cambiar el correo, se enviará un nuevo email de verificación
                      y tu cuenta quedará no verificada hasta confirmarlo.
                    </p>
                    <p>
                      No puedes modificar: usuario, rol, estado, contraseña o
                      identificadores internos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Seguridad y estado */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-rose-50 to-orange-50">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FiShield className="text-rose-500" /> Seguridad
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Gestiona opciones relacionadas con tu cuenta
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="mt-0.5">
                      <FiLock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Restablecer contraseña</p>
                      <p className="text-sm text-slate-600">
                        Te enviaremos un enlace a {user?.correo || user?.email || "tu correo"}.
                      </p>
                    </div>
                    <button
                      onClick={sendPasswordReset}
                      disabled={pwdLoading || isInitialLoading}
                      className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                      {pwdLoading ? "Enviando..." : "Enviar"}
                    </button>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${isVerified ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <div className="mt-0.5">
                      {isVerified ? (
                        <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <FiClock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Verificación de correo</p>
                      <p className="text-sm text-slate-600">
                        {isVerified
                          ? "Tu correo está verificado."
                          : "Tu correo aún no está verificado. Revisa tu bandeja y la carpeta de spam."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200">
                    <div className="mt-0.5">
                      <FiRefreshCw className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Sincronizar perfil</p>
                      <p className="text-sm text-slate-600">
                        Vuelve a cargar tus datos desde el servidor.
                      </p>
                    </div>
                    <button
                      onClick={refreshProfile}
                      disabled={loading}
                      className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {loading ? "Sincronizando..." : "Actualizar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;
