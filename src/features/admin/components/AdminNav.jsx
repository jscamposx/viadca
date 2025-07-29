import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiHome,
  FiMenu,
  FiX,
  FiCompass,
  FiUser,
  FiSettings,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";

const NavItem = ({ to, icon, label, isOpen, isMobile = false }) => {
  const activeLinkStyle = {
    background: "linear-gradient(90deg, #3b82f6 0%, #93c5fd 100%)",
    color: "#fff",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
  };

  const commonClasses =
    "flex items-center p-3 rounded-xl relative overflow-hidden hover:bg-blue-50 transition-all duration-300 group";
  const desktopClasses = `${isOpen ? "pl-4" : "justify-center"}`;

  return (
    <li>
      <NavLink
        to={to}
        end={to === "/admin"}
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        className={({ isActive }) =>
          `${commonClasses} ${isMobile ? "" : desktopClasses} ${
            isActive
              ? "text-white font-semibold"
              : "text-slate-600 hover:text-blue-600"
          }`
        }
        title={!isOpen && !isMobile ? label : undefined}
      >
        <div
          className={`transition-all duration-300 ${isOpen || isMobile ? "mr-3" : ""}`}
        >
          {React.cloneElement(icon, {
            className:
              "transition-transform duration-300 group-hover:scale-110",
          })}
        </div>
        <span
          className={`font-medium overflow-hidden transition-all duration-300
                      ${
                        !(isOpen || isMobile)
                          ? "w-0 opacity-0"
                          : "w-full opacity-100"
                      }`}
        >
          {label}
        </span>
        {!isOpen && !isMobile && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl font-medium text-sm whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity">
            {label}
          </div>
        )}
      </NavLink>
    </li>
  );
};

const AdminNav = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/admin", icon: <FiHome size={20} />, label: "Dashboard" },
    { to: "/admin/paquetes", icon: <FiPackage size={20} />, label: "Paquetes" },
    {
      to: "/admin/mayoristas",
      icon: <FiUsers size={20} />,
      label: "Mayoristas",
    },
  ];

  const userLinks = [
    { to: "/admin/perfil", icon: <FiUser size={20} />, label: "Perfil" },
    {
      to: "/admin/configuracion",
      icon: <FiSettings size={20} />,
      label: "Configuración",
    },
    { to: "/logout", icon: <FiLogOut size={20} />, label: "Cerrar sesión" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  if (isMobile) {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white fixed top-0 w-full z-50 shadow-xl">
        <div className="flex justify-between items-center p-4 h-16">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <FiCompass className="text-blue-600 text-xl" />
            </div>
            <h1 className="font-bold text-lg ml-3">
              <span className="font-extrabold">VIADCA</span> Admin
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300
                       hover:scale-110 transform group active:scale-95"
          >
            <div className="relative">
              {isMobileMenuOpen ? (
                <FiX
                  size={24}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
              ) : (
                <FiMenu
                  size={24}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              )}
            </div>
          </button>
        </div>
        {isMobileMenuOpen && (
          <nav className="bg-white text-slate-700 shadow-lg">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Administrador</p>
                  <p className="text-sm text-slate-500">admin@viadca.com</p>
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <NavItem key={link.to} {...link} isMobile={true} />
              ))}
            </ul>

            <div className="p-4 border-t border-slate-200">
              <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">
                Cuenta
              </h3>
              <ul className="flex flex-col gap-1">
                {userLinks.map((link) => (
                  <NavItem key={link.to} {...link} isMobile={true} />
                ))}
              </ul>
            </div>
          </nav>
        )}
      </header>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-50 to-white text-slate-700 p-4
                 flex flex-col z-40 transition-all duration-300 ease-in-out
                 shadow-[0_0_25px_-5px_rgba(0,0,0,0.1)] border-r border-slate-200
                 ${isOpen ? "w-64" : "w-20"} group`}
    >
      {/* Botón toggle que aparece con hover */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 -right-4 p-3 bg-gradient-to-r from-blue-600 to-indigo-700 
                   hover:from-blue-700 hover:to-indigo-800 rounded-full text-white 
                   transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center
                   border-2 border-white hover:scale-110 transform z-20
                   opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                   group"
        aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
      >
        <div className="relative">
          {isOpen ? (
            <FiChevronLeft
              size={20}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <FiChevronRight
              size={20}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </div>

      
      </button>

      {/* Indicador sutil en el borde cuando está comprimida */}
      {!isOpen && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-1 w-1 h-12 bg-gradient-to-b from-blue-400 to-blue-600 
                        rounded-full opacity-0 group-hover:opacity-50 transition-all duration-300
                        shadow-lg"
        ></div>
      )}

      <div
        className="flex items-center mb-8 mt-4 px-2 py-3 cursor-pointer group/logo
                   hover:bg-blue-50 rounded-xl transition-all duration-300"
        onClick={() => !isOpen && setIsOpen(true)}
        title={!isOpen ? "Clic para expandir" : ""}
      >
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg
                        transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:shadow-xl"
        >
          <FiCompass className="text-white text-2xl" />
        </div>
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ${
            !isOpen ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <h1 className="font-bold text-2xl text-slate-800">
            <span className="text-blue-600 font-extrabold">VIADCA</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Panel de administración</p>
        </div>

        {/* Indicador visual cuando está comprimida - mejorado */}
        {!isOpen && (
          <div
            className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 
                          bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 rounded-lg shadow-xl 
                          font-medium text-sm whitespace-nowrap z-50 
                          opacity-0 group-hover/logo:opacity-100 transition-all duration-300
                          pointer-events-none scale-95 group-hover/logo:scale-100"
          >
            Clic para expandir
            <div
              className="absolute right-full top-1/2 transform -translate-y-1/2 
                            border-4 border-transparent border-r-blue-600"
            ></div>
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-1 flex-grow">
        {navLinks.map((link) => (
          <NavItem key={link.to} {...link} isOpen={isOpen} />
        ))}
      </ul>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="flex items-center p-3 rounded-xl bg-slate-50 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <FiUser className="text-blue-600" />
          </div>
          <div
            className={`ml-3 overflow-hidden transition-all duration-300 ${
              !isOpen ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            <p className="font-semibold text-slate-800">Administrador</p>
            <p className="text-xs text-slate-500 truncate">admin@viadca.com</p>
          </div>
        </div>

        <ul className="flex flex-col gap-1">
          {userLinks.map((link) => (
            <NavItem key={link.to} {...link} isOpen={isOpen} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminNav;
