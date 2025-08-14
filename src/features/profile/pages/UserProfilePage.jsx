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

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50/40 p-4 sm:p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
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
            <h1 className="text-3xl font-bold text-slate-800">Perfil</h1>
            <p className="text-slate-600">Gestiona tu información personal</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium transition"
            >
              <FiHome className="w-4 h-4" /> Volver al inicio
            </Link>
          </div>
        </div>
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
            className={`mb-4 p-3 rounded-lg text-sm font-medium border ${pwdMsg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
          >
            {pwdMsg.text}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-50 to-orange-50">
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
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow disabled:opacity-60 transition"
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
                  <FiSave className="inline-block mr-1" />{" "}
                  {loading ? "Guardando..." : "Guardar"}
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
                      Nombre completo{" "}
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
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="correo"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      Correo electrónico{" "}
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
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                    {formData.correo !== (user?.correo || user?.email) && (
                      <p className="text-xs text-amber-600 mt-1">
                        Al guardar, deberás verificar este nuevo correo.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow">
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
                  <div className="w-12 h-12 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow">
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

            <div
              className={`mt-8 p-5 rounded-xl border ${
                isVerified && formData.correo === (user?.correo || user?.email)
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${
                    isVerified &&
                    formData.correo === (user?.correo || user?.email)
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }`}
                >
                  {isVerified &&
                  formData.correo === (user?.correo || user?.email) ? (
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <FiClock className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold ${
                      isVerified &&
                      formData.correo === (user?.correo || user?.email)
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {isVerified &&
                    formData.correo === (user?.correo || user?.email)
                      ? "Cuenta verificada"
                      : isEditing &&
                          formData.correo !== (user?.correo || user?.email)
                        ? "Verificación requerida"
                        : "Verificación pendiente"}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      isVerified &&
                      formData.correo === (user?.correo || user?.email)
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {isVerified &&
                    formData.correo === (user?.correo || user?.email)
                      ? "Tu cuenta ha sido verificada correctamente"
                      : isEditing &&
                          formData.correo !== (user?.correo || user?.email)
                        ? "Al cambiar tu correo electrónico, necesitarás verificar la nueva dirección"
                        : "Tu cuenta está pendiente de verificación. Por favor revisa tu correo."}
                  </p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium shadow hover:shadow-lg transition-all"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="ml-4 px-6 py-3 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-60 text-slate-800 font-medium shadow-sm transition-all"
                >
                  Cancelar
                </button>
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
            {/* Sección seguridad / contraseña */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FiLock className="w-5 h-5 text-blue-600" /> Seguridad
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Puedes solicitar un correo para restablecer tu contraseña. El
                enlace llegará a tu correo actual.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <button
                  onClick={sendPasswordReset}
                  disabled={pwdLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium shadow transition"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${pwdLoading ? "animate-spin" : ""}`}
                  />
                  {pwdLoading
                    ? "Enviando..."
                    : "Enviar correo de restablecimiento"}
                </button>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Usar formulario avanzado
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Después de recibir el correo, sigue el enlace para establecer
                una nueva contraseña.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Envuélvelo en ProtectedRoute cuando se use en el router
const ProtectedUserProfilePage = () => (
  <ProtectedRoute>
    <UserProfilePage />
  </ProtectedRoute>
);

export default ProtectedUserProfilePage;
