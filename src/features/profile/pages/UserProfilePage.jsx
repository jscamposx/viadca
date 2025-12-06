import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiEdit3,
  FiSave,
  FiX,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiRefreshCw,
  FiShield,
  FiArrowLeft,
  FiActivity
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../api/authService";
import PageTransition from "../../../components/ui/PageTransition";

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);
  
  // Inicializar datos
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || user.nombre_completo || user.nombreCompleto || "",
        correo: user.correo || user.email || "",
      });
    }
  }, [user]);

  const isInitialLoading = !user;
  const isVerified = Boolean(user?.email_verificado || user?.emailVerificado || user?.verificado);

  // --- HANDLERS ---

  const handleBack = () => {
    const fromState = location.state?.from;
    const referrer = document.referrer;
    if (fromState && typeof fromState === "string") {
      navigate(fromState, { replace: true });
      return;
    }
    if (referrer && new URL(referrer).origin === window.location.origin) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

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
      const prevNombre = user?.nombre || user?.nombre_completo || user?.nombreCompleto || "";
      const prevCorreo = user?.correo || user?.email || "";
      
      if (formData.nombre === prevNombre && formData.correo === prevCorreo) {
        setMessage({ type: "info", text: "No hay cambios para guardar" });
        setIsEditing(false);
        return;
      }

      const updateData = {};
      if (formData.nombre !== prevNombre) updateData.nombre = formData.nombre;
      if (formData.correo !== prevCorreo) updateData.email = formData.correo;

      await authService.updateProfile(updateData);
      await updateProfile();
      
      setMessage({ type: "success", text: "Perfil actualizado exitosamente." });
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

  const sendPasswordReset = async () => {
    if (!user) return;
    setPwdLoading(true);
    setMessage(null);
    try {
      await authService.forgotPassword(user.correo || user.email);
      setMessage({
        type: "success",
        text: "Correo de restablecimiento enviado. Revisa tu bandeja.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error al enviar el correo.",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const refreshProfile = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await updateProfile();
      setMessage({ type: "success", text: "Datos sincronizados correctamente." });
    } catch (e) {
      setMessage({ type: "error", text: "No se pudo sincronizar el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || user?.nombre_completo || user?.nombreCompleto || "",
      correo: user?.correo || user?.email || "",
    });
    setIsEditing(false);
    setMessage(null);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Reciente";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        month: "long", year: "numeric",
      });
    } catch { return "Reciente"; }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] font-sans pb-12 relative">
        
        {/* --- BANNER SUPERIOR (Diseño Solicitado) --- */}
        <div className="h-72 w-full absolute top-0 left-0 z-0 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10">
          
          {/* Cabecera con Botón Volver */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               {/* Botón Volver */}
               <button 
                  onClick={handleBack}
                  className="mb-4 flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm font-medium group"
               >
                  <div className="p-1 rounded-full border border-blue-300/30 group-hover:border-white transition-colors">
                    <FiArrowLeft />
                  </div>
                  Volver 
               </button>
               <h1 className="text-3xl md:text-4xl font-bold text-white font-volkhov">Mi Perfil</h1>
               <p className="text-blue-100 mt-2 text-sm">Administra tu información personal y seguridad.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* --- COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD (Sticky) --- */}
            <div className="lg:col-span-4 lg:sticky lg:top-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
                    
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg ring-4 ring-white">
                        {getInitials(user?.nombre || user?.nombre_completo || user?.usuario)}
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                        {user?.nombre || user?.nombre_completo || "Usuario"}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">@{user?.usuario}</p>

                    {/* Badge Rol */}
                    <div className="mt-3 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100 bg-blue-50 text-blue-700 flex items-center gap-1.5">
                        <FiUser className="w-3 h-3"/>
                        {user?.rol || "Cliente"}
                    </div>

                    {/* Stats List */}
                    <div className="w-full mt-8 space-y-4 border-t border-slate-100 pt-6">
                         <div className="flex justify-between items-center text-sm">
                             <div className="flex items-center gap-2 text-slate-500">
                                 <FiCheckCircle className={isVerified ? "text-emerald-500" : "text-slate-300"} />
                                 <span>Estado</span>
                             </div>
                             <span className={`font-bold ${isVerified ? "text-emerald-600" : "text-slate-400"}`}>
                                 {isVerified ? "Verificado" : "Pendiente"}
                             </span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                             <div className="flex items-center gap-2 text-slate-500">
                                 <FiClock className="text-slate-400" />
                                 <span>Miembro desde</span>
                             </div>
                             <span className="font-bold text-slate-700 capitalize">
                                 {formatDate(user?.creadoEn || user?.createdAt)}
                             </span>
                         </div>
                    </div>
                </div>

                {/* Botón Sincronizar (Acción rápida) */}
                <button 
                    onClick={refreshProfile}
                    disabled={loading}
                    className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                >
                    <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sincronizar datos
                </button>
            </div>

            {/* --- COLUMNA DERECHA: FORMULARIOS --- */}
            <div className="lg:col-span-8 space-y-6">

                {/* --- TARJETA 1: DATOS PERSONALES --- */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <FiUser size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Datos Personales</h3>
                                <p className="text-slate-400 text-xs">Información básica de tu cuenta.</p>
                            </div>
                        </div>
                        {!isEditing && (
                             <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all"
                            >
                                <FiEdit3 className="w-4 h-4" />
                                <span>Editar</span>
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            {/* Input: Nombre */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none text-slate-800 font-bold text-base transition-colors placeholder-slate-300"
                                        placeholder="Tu Nombre"
                                    />
                                ) : (
                                    <div className="py-2 text-base font-bold text-slate-800 border-b border-transparent">
                                        {formData.nombre || "Sin nombre"}
                                    </div>
                                )}
                            </div>

                            {/* Input: Correo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none text-slate-800 font-bold text-base transition-colors placeholder-slate-300"
                                    />
                                ) : (
                                    <div className="py-2 text-base font-bold text-slate-800 border-b border-transparent">
                                        {formData.correo}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mensajes de feedback */}
                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`mb-6 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                                        message.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                                    }`}
                                >
                                    {message.type === 'success' ? <FiCheckCircle/> : <FiActivity/>}
                                    {message.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botones Accion */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex justify-end gap-3 pt-4 border-t border-slate-100"
                                >
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 rounded-lg text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* --- TARJETA 2: SEGURIDAD (Estilo Blanco Limpio) --- */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                            <FiLock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Contraseña</h3>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Te enviaremos un enlace para restablecerla.</p>
                        </div>
                    </div>
                    <button 
                        onClick={sendPasswordReset}
                        disabled={pwdLoading}
                        className="whitespace-nowrap text-sm font-bold text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                    >
                        {pwdLoading ? "Enviando..." : "Cambiar Contraseña"}
                    </button>
                </div>

                {/* Alerta de Verificación (Si no está verificado) */}
                {!isVerified && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                            <FiShield />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-800">Verificación Requerida</h4>
                            <p className="text-xs text-amber-700 mt-1">
                                Tu cuenta aún no está verificada. Algunas funciones podrían estar limitadas. Revisa tu correo.
                            </p>
                        </div>
                    </div>
                )}

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;