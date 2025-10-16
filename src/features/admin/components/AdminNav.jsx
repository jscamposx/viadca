import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FiTrash2,
  FiActivity,
} from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../../contexts/AuthContext";

const NavItem = ({
  to,
  onClick,
  icon,
  label,
  isOpen,
  isMobile = false,
  isButton = false,
}) => {
  const activeLinkStyle = {
    background:
      "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
    color: "#fff",
    boxShadow:
      "0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
  };

  const commonClasses =
    "flex items-center p-3 rounded-xl relative overflow-hidden hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group border border-transparent hover:border-blue-100 hover:shadow-sm";
  const desktopClasses = `${isOpen ? "pl-4" : "justify-center"}`;

  const content = (
    <>
      <div
        className={`transition-all duration-300 ${isOpen || isMobile ? "mr-3" : ""} flex items-center justify-center relative`}
      >
        {React.cloneElement(icon, {
          className: "transition-all duration-300",
          size: 20,
        })}
      </div>
      <span
        className={`font-medium overflow-hidden transition-all duration-300 text-sm
                    ${
                      !(isOpen || isMobile)
                        ? "w-0 opacity-0"
                        : "w-full opacity-100"
                    }`}
      >
        {label}
      </span>
      {!isOpen && !isMobile && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl font-medium text-sm whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
          {label}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
        </div>
      )}
    </>
  );

  return (
    <li>
      {isButton ? (
        <button
          onClick={onClick}
          className={`${commonClasses} ${isMobile ? "" : desktopClasses} text-gray-700 hover:text-red-600 w-full text-left`}
          title={!isOpen && !isMobile ? label : undefined}
        >
          {content}
        </button>
      ) : (
        <NavLink
          to={to}
          end={to === "/admin"}
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className={({ isActive }) =>
            `${commonClasses} ${isMobile ? "" : desktopClasses} ${
              isActive
                ? "text-white font-semibold shadow-lg"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
          title={!isOpen && !isMobile ? label : undefined}
        >
          {content}
        </NavLink>
      )}
    </li>
  );
};

const AdminNav = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navLinks = [
    { to: "/admin", icon: <FiHome size={20} />, label: "Dashboard" },
    { to: "/admin/paquetes", icon: <FiPackage size={20} />, label: "Paquetes" },
    {
      to: "/admin/mayoristas",
      icon: <FiUsers size={20} />,
      label: "Mayoristas",
    },
    {
      to: "/admin/usuarios",
      icon: <FiUser size={20} />,
      label: "Usuarios",
    },
    {
      to: "/admin/papelera",
      icon: <FiTrash2 size={20} />,
      label: "Papelera",
    },
    {
      to: "/admin/cola",
      icon: <FiActivity size={18} />,
      label: "Monitor",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  const userLinks = [
    { to: "/admin/perfil", icon: <FiUser size={20} />, label: "Perfil" },
    {
      to: "/admin/configuracion",
      icon: <FiSettings size={20} />,
      label: "Configuración",
    },
    {
      onClick: handleLogout,
      icon: <FiLogOut size={20} />,
      label: "Cerrar sesión",
      isButton: true,
    },
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
      <>
        <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white fixed top-0 w-full z-50 shadow-2xl border-b border-white/10">
          <div className="flex justify-between items-center p-4 h-16">
            <div className="flex items-center">
              <div
                className="bg-white/10 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/20 flex items-center justify-center"
                role="img"
                aria-label="VIADCA Panel"
              >
                <FiCompass className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <h1 className="font-bold text-lg ml-3">
                <span className="font-extrabold">VIADCA</span> Admin
              </h1>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300
                           hover:scale-110 transform group active:scale-95 border border-white/20"
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
          </div>
        </header>

        {/* Overlay oscuro cuando el menú está abierto */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Menú móvil deslizable */}
        <nav 
          className={`fixed top-16 left-0 right-0 bottom-0 bg-white text-gray-700 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <UserAvatar size="md" showInfo={true} />
          </div>

          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} isMobile={true} />
            ))}
          </ul>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 tracking-wide">
              Cuenta
            </h3>
            <ul className="flex flex-col gap-1">
              {userLinks.map((link, index) => (
                <NavItem key={link.to || index} {...link} isMobile={true} />
              ))}
            </ul>
          </div>
        </nav>
      </>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen nav-backdrop text-gray-700 p-4
                 flex flex-col z-40 nav-smooth-expand floating-shadow
                 border-r border-gray-200/80 nav-gradient-border
                 ${isOpen ? "w-64" : "w-20"} group`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-24 -right-3.5 p-2.5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 
                   hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 rounded-full text-white 
                   transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center
                   border-2 border-white hover:scale-110 transform z-20
                   opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                   group/btn nav-hover-lift"
        aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
      >
        <div className="relative">
          {isOpen ? (
            <FiChevronLeft
              size={16}
              className="transition-transform duration-300 group-hover/btn:scale-110"
            />
          ) : (
            <FiChevronRight
              size={16}
              className="transition-transform duration-300 group-hover/btn:scale-110"
            />
          )}
        </div>
      </button>

      <div
        className={`flex items-center mb-8 mt-4 px-2 py-3 cursor-pointer group/logo
                   hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-100 hover:shadow-sm nav-hover-lift ${!isOpen ? "justify-center" : ""}`}
        onClick={() => !isOpen && setIsOpen(true)}
        title={!isOpen ? "Clic para expandir" : ""}
      >
        <div
          className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-2.5 rounded-xl shadow-lg
                        transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:shadow-xl group-hover/logo:rotate-3 nav-float"
        >
          <FiCompass className="text-white text-2xl" />
        </div>
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ${
            !isOpen ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <h1 className="font-bold text-2xl text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold">
              VIADCA
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
        </div>

        {!isOpen && (
          <div
            className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 
                          bg-gradient-to-r from-gray-800 to-gray-700 text-white px-3 py-2 rounded-lg shadow-xl 
                          font-medium text-sm whitespace-nowrap z-50 
                          opacity-0 group-hover/logo:opacity-100 transition-all duration-300
                          pointer-events-none scale-95 group-hover/logo:scale-100"
          >
            Clic para expandir
            <div
              className="absolute right-full top-1/2 transform -translate-y-1/2 
                            border-4 border-transparent border-r-gray-800"
            ></div>
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-1 flex-grow">
        {navLinks.map((link) => (
          <NavItem key={link.to} {...link} isOpen={isOpen} />
        ))}
      </ul>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <div
          className={`flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 mb-4 border border-gray-100 shadow-sm nav-hover-lift ${!isOpen ? "justify-center" : ""}`}
        >
          {isOpen ? (
            <UserAvatar size="md" showInfo={true} />
          ) : (
            <UserAvatar size="md" showInfo={false} />
          )}
        </div>

        <ul className="flex flex-col gap-1">
          {userLinks.map((link, index) => (
            <NavItem key={link.to || index} {...link} isOpen={isOpen} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminNav;