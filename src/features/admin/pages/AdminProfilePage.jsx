import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiEdit3,
  FiSave,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiLock,
  FiShield,
  FiActivity,
  FiKey
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
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

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
        setMessage({ type: "info", text: "Sin cambios para guardar." });
        setIsEditing(false);
        return;
      }

      await authService.updateProfile(updateData);
      await updateProfile();

      setMessage({ type: "success", text: "Perfil actualizado correctamente." });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al actualizar.",
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

  // --- Helpers ---
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0].charAt(0).toUpperCase()
      : words.slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase();
  };

  // Helper modificado para usar colores sólidos en lugar de gradientes
  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return { 
            badgeBg: "bg-rose-100", badgeText: "text-rose-800", 
            solidBg: "bg-rose-600", // Color sólido para el avatar
        };
      case "pre-autorizado":
        return { 
            badgeBg: "bg-amber-100", badgeText: "text-amber-800", 
            solidBg: "bg-amber-500",
        };
      default:
        return { 
            badgeBg: "bg-indigo-100", badgeText: "text-indigo-800", 
            solidBg: "bg-indigo-600",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        month: "long", year: "numeric",
      });
    } catch { return "Reciente"; }
  };

  const isVerified = Boolean(user?.email_verificado || user?.emailVerificado || user?.verificado);
  const roleStyle = getRoleStyle(user?.rol);

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12 relative overflow-hidden">
      
      {/* --- BANNER SUPERIOR DE COLOR SÓLIDO (Sin degradado) --- */}
      <div className="h-72 w-full absolute top-0 left-0 z-0 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-sm">
         {/* Patrón decorativo sutil */}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-36">
        
        {/* Título de la página en blanco sobre el banner */}
        <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-volkhov drop-shadow-lg">Configuración de Cuenta</h1>
            <p className="text-white/90 mt-2 text-lg drop-shadow">Gestiona tu perfil y preferencias de seguridad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* --- COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD (Sticky) --- */}
            <div className="lg:col-span-4 lg:sticky lg:top-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    
                    {/* Header de la tarjeta */}
                    <div className="bg-slate-50/80 p-8 flex flex-col items-center border-b border-slate-100 relative">
                         {/* Avatar con color sólido */}
                         <div className={`relative z-10 w-28 h-28 rounded-full ${roleStyle.solidBg} flex items-center justify-center text-white text-4xl font-bold shadow-lg border-[5px] border-white mb-5`}>
                            {getInitials(user?.nombre || user?.nombre_completo || user?.usuario)}
                        </div>
                        
                        <h2 className="relative z-10 text-2xl font-bold text-slate-800 text-center">
                            {user?.nombre || user?.nombre_completo || "Usuario"}
                        </h2>
                        <p className="relative z-10 text-slate-500 text-sm mt-1 font-medium">@{user?.usuario}</p>

                        {/* Badges de Rol */}
                        <div className="relative z-10 mt-5 flex gap-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${roleStyle.badgeBg} ${roleStyle.badgeText} uppercase tracking-wider flex items-center gap-1`}>
                                <FiShield className="w-3.5 h-3.5" /> {user?.rol || "Usuario"}
                             </span>
                        </div>
                    </div>

                    {/* Stats / Info rápida */}
                    <div className="py-2">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                            <span className="text-sm text-slate-500 flex items-center gap-3 font-medium group-hover:text-slate-700">
                                <div className={`p-1.5 rounded-lg ${isVerified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                                   {isVerified ? <FiCheckCircle size={16}/> : <FiAlertTriangle size={16}/>}
                                </div>
                                Estado
                            </span>
                            <span className={`text-sm font-bold ${isVerified ? "text-emerald-700" : "text-amber-600"}`}>
                                {isVerified ? "Verificado" : "Pendiente"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                            <span className="text-sm text-slate-500 flex items-center gap-3 font-medium group-hover:text-slate-700">
                                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                                   <FiActivity size={16}/>
                                </div>
                                Registro
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                                {formatDate(user?.creadoEn || user?.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* --- COLUMNA DERECHA: CONTENIDO --- */}
            <div className="lg:col-span-8 space-y-8">

                {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
                <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
                    
                    <div className="border-b border-slate-100 pb-6 mb-8 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
                                <FiUser size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Datos Personales</h3>
                                <p className="text-slate-500 text-sm mt-1">Información básica de tu cuenta.</p>
                            </div>
                        </div>
                        {!isEditing && (
                             <button 
                                onClick={() => setIsEditing(true)}
                                className="group flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
                            >
                                <FiEdit3 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                                <span>Editar</span>
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Input Nombre */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                {isEditing ? (
                                    <div className="relative group">
                                        <FiUser className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all text-slate-700 font-medium"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                ) : (
                                    <div className="py-3 text-lg text-slate-800 font-bold border-b border-slate-100 px-1">
                                        {formData.nombre}
                                    </div>
                                )}
                            </div>

                            {/* Input Correo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                {isEditing ? (
                                    <div className="relative group">
                                        <FiMail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all text-slate-700 font-medium"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                ) : (
                                    <div className="py-3 text-lg text-slate-800 font-bold border-b border-slate-100 px-1 flex items-center gap-2">
                                        {formData.correo}
                                        {!isVerified && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold">Sin verificar</span>}
                                    </div>
                                )}
                            </div>

                            {/* Usuario (Solo lectura) */}
                            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-200 text-slate-500 rounded-xl">
                                        <FiKey size={20}/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de Usuario</p>
                                        <p className="text-base font-bold text-slate-700 mt-0.5">@{user?.usuario}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">No editable</span>
                            </div>
                        </div>

                        {/* Mensajes de Estado Animados */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className={`mt-8 rounded-2xl px-5 py-4 text-sm font-medium flex items-start gap-3 shadow-sm ${
                                        message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                                        message.type === "error" ? "bg-rose-50 text-rose-800 border border-rose-100" :
                                        "bg-blue-50 text-blue-800 border border-blue-100"
                                    }`}
                                >
                                    <div className={`mt-0.5 p-1 rounded-full ${message.type === "success" ? "bg-emerald-100 text-emerald-600": message.type === "error" ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}>
                                        {message.type === "success" ? <FiCheckCircle size={16}/> : <FiAlertTriangle size={16}/>}
                                    </div>
                                    <p className="leading-snug">{message.text}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botones de acción (Sin degradado) */}
                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mt-8 flex items-center gap-4 justify-end border-t border-slate-100 pt-6"
                            >
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
                                >
                                    <FiX size={18}/> Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    // Color sólido índigo
                                    className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                         Guardando...
                                        </>
                                    ) : (
                                        <><FiSave size={18} /> Guardar Cambios</>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* --- SECCIÓN 2: SEGURIDAD --- */}
                <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
                    <div className="border-b border-slate-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
                                <FiLock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Seguridad de la Cuenta</h3>
                                <p className="text-slate-500 text-sm mt-1">Gestiona la seguridad de tu cuenta.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                                <FiLock className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-base font-semibold text-slate-900">Restablecer contraseña</h4>
                                <p className="mt-2 text-sm text-slate-600">
                                    Te enviaremos un enlace a tu correo electrónico para restablecer tu contraseña.
                                </p>
                                <div className="mt-4">
                                    <button
                                        onClick={sendPasswordReset}
                                        disabled={pwdLoading}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {pwdLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <FiLock size={16} />
                                                Enviar enlace de restablecimiento
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                {/* Mensaje de estado para password reset */}
                                <AnimatePresence>
                                    {pwdMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium flex items-start gap-3 ${
                                                pwdMsg.type === "success"
                                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                                    : "bg-rose-50 text-rose-800 border border-rose-100"
                                            }`}
                                        >
                                            <div
                                                className={`mt-0.5 p-1 rounded-full ${
                                                    pwdMsg.type === "success"
                                                        ? "bg-emerald-100 text-emerald-600"
                                                        : "bg-rose-100 text-rose-600"
                                                }`}
                                            >
                                                {pwdMsg.type === "success" ? (
                                                    <FiCheckCircle size={16} />
                                                ) : (
                                                    <FiAlertTriangle size={16} />
                                                )}
                                            </div>
                                            <p className="leading-snug">{pwdMsg.text}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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