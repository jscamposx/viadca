import React, { useEffect, useRef, useState } from 'react';
import {
  FiUser,
  FiMoreVertical,
  FiShield,
  FiClock,
  FiTrash2,
  FiCheckCircle,
  FiCalendar
} from 'react-icons/fi';

const UserCard = ({ 
  user, 
  currentUser, 
  handleRoleChange, 
  setConfirmDialog, 
  getRoleColor, 
  getRoleIcon, 
  loading 
}) => {
  // Referencias (menú eliminado)
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  
  // Helpers UI
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = String(name).trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : '')).toUpperCase();
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'pre-autorizado': return 'Pre-autorizado';
      default: return 'Usuario';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Error en fecha';
    }
  };

  const getRegistrationDate = (user) => {
    const dateField = user.creadoEn || user.createdAt || user.created_at || 
                    user.fechaCreacion || user.fecha_creacion || user.fechaRegistro;
    return formatDate(dateField);
  };

  const isEmailVerified = (user) => {
    return user.email_verificado || user.emailVerificado || user.verificado;
  };

  // Cerrar menú 3 puntos
  useEffect(()=>{
    if(!roleMenuOpen) return;
    const onDown = (e)=>{ if(menuRef.current && !menuRef.current.contains(e.target) && !menuBtnRef.current.contains(e.target)) setRoleMenuOpen(false); };
    const onKey = (e)=>{ if(e.key==='Escape') setRoleMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return ()=>{ document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  },[roleMenuOpen]);

  // Color del fondo del icono según el rol
  const getRoleIconBg = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'pre-autorizado': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      default: return 'bg-gradient-to-br from-blue-500 to-blue-600';
    }
  };

  // Truncado elegante de username
  const rawUsername = user.usuario || '';
  const MAX_NAME_LEN = 22;
  const isUsernameTruncated = rawUsername.length > MAX_NAME_LEN;
  const displayUsername = isUsernameTruncated ? rawUsername.slice(0, MAX_NAME_LEN) + '…' : rawUsername;

  return (
    <div>
      <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-visible border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
        {/* Header gradiente */}
        <div className="relative p-4 sm:p-5 lg:p-6 pr-14 sm:pr-16 lg:pr-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
          {/* Botón 3 puntos */}
          {user.id !== currentUser?.id && (
            <button
              ref={menuBtnRef}
              onClick={()=> setRoleMenuOpen(o=>!o)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-10 h-10 sm:w-10 sm:h-10 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-white/80 backdrop-blur flex items-center justify-center shadow-sm border border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 touch-manipulation"
              aria-haspopup="true"
              aria-expanded={roleMenuOpen}
              aria-label="Abrir opciones de rol"
              title="Opciones de rol"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-4">
            {/* Avatar / Ícono */}
            <div className={`${getRoleIconBg(user.rol)} p-3 sm:p-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center`}> 
              <FiUser className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Ajuste de truncado: estructura flex con min-w-0 para evitar encimado */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex-1 min-w-0" title={rawUsername}>
                    <span className="block truncate pr-2 sm:pr-4">{displayUsername}</span>
                    {isUsernameTruncated && (
                      <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-purple-50 via-purple-50/80 to-transparent"></span>
                    )}
                  </span>
                  {user.id === currentUser?.id && (
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/70 text-blue-700 shadow-sm border border-blue-200 backdrop-blur">
                      Tú
                    </span>
                  )}
                </div>
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-white/80 shadow-sm ${
                  user.rol === 'admin' ? 'text-red-700' : user.rol === 'pre-autorizado' ? 'text-orange-700' : 'text-blue-700'
                }`}>
                  {/* Ícono unificado */}
                  <FiUser className="w-3.5 h-3.5" />
                  {getRoleLabel(user.rol)}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-white/80 shadow-sm ${isEmailVerified(user) ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isEmailVerified(user) ? <FiCheckCircle className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
                  {isEmailVerified(user) ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
          {roleMenuOpen && (
            <div ref={menuRef} className="absolute z-50 mt-2 right-3 top-12 w-60">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl">
                <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-indigo-100/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wide text-indigo-600">Cambiar rol</span>
                    <button onClick={()=>setRoleMenuOpen(false)} className="p-1 rounded-md hover:bg-indigo-50 text-indigo-500">
                      <span className="sr-only">Cerrar</span>
                      ✕
                    </button>
                  </div>
                  <ul className="py-1">
                    {/*
                      { value:'usuario', icon:<FiUser className='w-4 h-4' />, desc:'Acceso básico' },
                      { value:'pre-autorizado', icon:<FiClock className='w-4 h-4' />, desc:'Pendiente revisión' },
                      { value:'admin', icon:<FiShield className='w-4 h-4' />, desc:'Control total' }
                    */}
                    {['usuario', 'pre-autorizado', 'admin'].map(role => (
                      <li key={role}>
                        <button
                          onClick={()=> { if(user.rol!==role){ handleRoleChange(user, role); } setRoleMenuOpen(false); }}
                          disabled={user.rol===role}
                          className={`w-full flex items-start gap-3 px-3 py-2 text-left text-xs sm:text-sm transition-all group ${user.rol===role ? 'bg-indigo-50/70 text-indigo-700 cursor-default' : 'hover:bg-indigo-50 text-gray-700'}`}
                        >
                          <span className={`mt-0.5 ${user.rol===role ? 'text-indigo-600' : 'text-indigo-500 group-hover:scale-110 transition-transform'}`}>
                            {role === 'admin' ? <FiShield className='w-4 h-4' /> : role === 'pre-autorizado' ? <FiClock className='w-4 h-4' /> : <FiUser className='w-4 h-4' />}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="font-medium block leading-tight">{getRoleLabel(role)}</span>
                            <span className={`text-[10px] leading-tight opacity-80 ${user.rol===role ? 'text-indigo-600' : 'text-gray-500'}`}>{role === 'admin' ? 'Control total' : role === 'pre-autorizado' ? 'Pendiente revisión' : 'Acceso básico'}</span>
                          </span>
                          {user.rol===role && <FiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cuerpo */}
        <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
          {/* Grid resumen */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default">
                <FiCalendar className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <div className="text-[11px] text-blue-700 font-medium truncate" title={getRegistrationDate(user)}>
                  {getRegistrationDate(user)}
                </div>
              </div>
              <div className={`rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default ${isEmailVerified(user) ? 'bg-green-50 hover:bg-green-100' : 'bg-yellow-50 hover:bg-yellow-100'}`}> 
                {isEmailVerified(user) ? <FiCheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600" /> : <FiClock className="w-4 h-4 mx-auto mb-1 text-yellow-600" />}
                <div className={`text-[11px] font-medium truncate ${isEmailVerified(user) ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isEmailVerified(user) ? 'Email OK' : 'Sin verificar'}
                </div>
              </div>
            </div>

          {/* Información detallada */}
          <div className="flex-1 w-full">
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2 font-semibold tracking-wide">INFORMACIÓN</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[55%]" title={user.correo || user.email}>{user.correo || user.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600">Rol</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[55%]">{getRoleLabel(user.rol)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          {user.id !== currentUser?.id && (
            <div className="mt-auto">
              {/* Solo botón eliminar */}
              <button
                onClick={() => setConfirmDialog({ isOpen: true, type: 'delete', user })}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Eliminar usuario"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;