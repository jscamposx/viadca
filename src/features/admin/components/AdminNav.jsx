import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiHome,
  FiSend,
  FiBriefcase,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiLock,
  FiUser,
  FiDatabase
} from "react-icons/fi";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoverState, setHoverState] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [showToggleArrow, setShowToggleArrow] = useState(false);
  const navRef = useRef(null);
  
  // Detectar dispositivos móviles
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setShowToggleArrow(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Manejar la aparición de la flecha
  useEffect(() => {
    const handleMouseEnter = () => {
      if (!isMobile) {
        setShowToggleArrow(true);
      }
    };
    
    const handleMouseLeave = () => {
      if (!isMobile) {
        setShowToggleArrow(false);
      }
    };
    
    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('mouseenter', handleMouseEnter);
      navElement.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (navElement) {
        navElement.removeEventListener('mouseenter', handleMouseEnter);
        navElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isMobile]);

  const toggleHover = (index) => {
    setHoverState(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex">
      <aside
        ref={navRef}
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4
                   flex flex-col z-50 transition-all duration-300 ease-in-out
                   shadow-[0_0_25px_-5px_rgba(0,0,0,0.3)] border-r border-slate-700
                   ${isOpen ? "w-64" : "w-20"} overflow-hidden`}
      >
        {/* Flecha de expansión */}
        {showToggleArrow && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute top-1/2 -right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-full
                      text-white hover:text-cyan-300 transition-all duration-300 shadow-md flex items-center justify-center
                      border border-slate-700 hover:border-cyan-400 transform -translate-y-1/2
                      ${isOpen ? "" : "rotate-180"}`}
            aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
          >
            {isOpen ? (
              <FiChevronLeft size={20} />
            ) : (
              <FiChevronRight size={20} />
            )}
          </button>
        )}

        {/* Logo y título */}
        <div className="flex items-center mb-10 mt-4 px-2 py-3 bg-slate-800/40 rounded-xl backdrop-blur-sm">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg">
            <FiBriefcase className="text-white text-2xl" />
          </div>
          <div className={`ml-3 overflow-hidden transition-all duration-300 ${!isOpen ? "opacity-0 w-0" : "opacity-100"}`}>
            <h1 className="font-bold text-2xl text-white">
              <span className="text-cyan-400 font-bold">Viad</span><span className="text-white font-light">ca</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
          </div>
        </div>

        {/* Elementos de navegación */}
        <ul className="flex flex-col gap-1 flex-grow">
          <NavItem 
            to="/admin" 
            icon={<FiHome size={20} />} 
            label="Dashboard" 
            isOpen={isOpen}
            index={0}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          <NavItem 
            to="/admin/paquetes" 
            icon={<FiPackage size={20} />} 
            label="Paquetes" 
            isOpen={isOpen}
            index={1}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          <NavItem 
            to="/admin/hoteles" 
            icon={<FiBriefcase size={20} />} 
            label="Hoteles" 
            isOpen={isOpen}
            index={2}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          <NavItem 
            to="/admin/vuelos" 
            icon={<FiSend size={20} />} 
            label="Vuelos" 
            isOpen={isOpen}
            index={3}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          
          {/* Nuevos elementos */}
          <NavItem 
            to="/admin/clientes" 
            icon={<FiUser size={20} />} 
            label="Clientes" 
            isOpen={isOpen}
            index={4}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          <NavItem 
            to="/admin/inventario" 
            icon={<FiDatabase size={20} />} 
            label="Inventario" 
            isOpen={isOpen}
            index={5}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
          
          {/* Separador */}
          <div className={`my-4 border-t border-slate-700 ${!isOpen ? "w-12 mx-auto" : "w-full"}`}></div>
          
          {/* Configuración */}
          <NavItem 
            to="/admin/configuracion" 
            icon={<FiSettings size={20} />} 
            label="Configuración" 
            isOpen={isOpen}
            index={6}
            hoverState={hoverState}
            toggleHover={toggleHover}
          />
        </ul>
        
        {/* Botón de cierre de sesión */}
        <NavItem 
          to="/logout" 
          icon={<FiLogOut size={20} />} 
          label="Cerrar Sesión" 
          isOpen={isOpen}
          index={7}
          hoverState={hoverState}
          toggleHover={toggleHover}
          isLogout={true}
        />
      </aside>
      
      {/* Botón flotante para móviles */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 p-3 bg-slate-900 text-cyan-400 rounded-full shadow-lg border border-slate-700 backdrop-blur-sm"
          aria-label="Abrir menú"
        >
          <FiChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

// Componente para elementos activos
const NavItem = ({ to, icon, label, isOpen, index, hoverState, toggleHover, isLogout = false }) => {
  // Estilo para elemento activo - fondo azul claro con texto azul
  const activeLinkStyle = {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    borderLeft: "3px solid #38bdf8"
  };

  return (
    <li>
      <NavLink
        to={to}
        end={to === "/admin"}
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        className={`flex items-center p-3 rounded-xl relative overflow-hidden
                   ${isLogout ? "mt-auto bg-slate-800/50 hover:bg-slate-700/80" : "hover:bg-slate-700/50"} 
                   ${isOpen ? "pl-4" : "justify-center"} transition-all duration-300 group`}
        title={!isOpen ? label : undefined}
        onMouseEnter={() => toggleHover(index)}
        onMouseLeave={() => toggleHover(index)}
      >
        {/* Efecto de hover */}
        {hoverState[index] && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
        )}
        
        {/* Icono con animación */}
        <div className={`transition-all duration-300 group-hover:scale-110 ${isOpen ? "mr-3" : ""}`}>
          {icon}
        </div>
        
        {/* Etiqueta con animación */}
        <span
          className={`font-medium overflow-hidden transition-all duration-300 text-slate-200
                     ${!isOpen ? "w-0 opacity-0" : "w-full opacity-100"}`}
        >
          {label}
        </span>
        
        {/* Indicador de estado activo para menú contraído */}
        {!isOpen && (
          <div className={`absolute top-1/2 -translate-y-1/2 left-3 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        )}
        
        {/* Tooltip para menú contraído */}
        {!isOpen && hoverState[index] && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl font-medium text-sm whitespace-nowrap z-50 border border-slate-700 backdrop-blur-sm">
            {label}
          </div>
        )}
      </NavLink>
    </li>
  );
};

export default AdminNav;