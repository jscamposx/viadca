import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiHome,
  FiSend,
  FiBriefcase,
  FiMenu,
  FiX,
  FiTrash,
  FiCompass,
} from "react-icons/fi";

const NavItem = ({ to, icon, label, isOpen, isMobile = false }) => {
  const activeLinkStyle = {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    fontWeight: "600",
  };

  const commonClasses =
    "flex items-center p-3 rounded-lg relative overflow-hidden hover:bg-slate-50 transition-all duration-300 group";
  const desktopClasses = `${isOpen ? "pl-4" : "justify-center"}`;

  return (
    <li>
      <NavLink
        to={to}
        end={to === "/admin"}
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        className={`${commonClasses} ${isMobile ? "" : desktopClasses}`}
        title={!isOpen && !isMobile ? label : undefined}
      >
        <div
          className={`transition-all duration-300 group-hover:scale-110 ${
            isOpen || isMobile ? "mr-3" : ""
          }`}
        >
          {icon}
        </div>
        <span
          className={`font-medium overflow-hidden transition-all duration-300 text-slate-600
                      ${
                        !(isOpen || isMobile)
                          ? "w-0 opacity-0"
                          : "w-full opacity-100"
                      }`}
        >
          {label}
        </span>
        {!isOpen && !isMobile && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl font-medium text-sm whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity">
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
    { to: "/admin/vuelos", icon: <FiSend size={20} />, label: "Vuelos" },
    { to: "/admin/papelera", icon: <FiTrash size={20} />, label: "Papelera" },
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
      <header className="bg-white text-slate-700 shadow-md fixed top-0 w-full z-50">
        <div className="flex justify-between items-center p-4 h-16">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow">
              <FiBriefcase className="text-white text-xl" />
            </div>
            <h1 className="font-bold text-lg text-slate-800 ml-3">
              <span className="text-blue-700">Viadca</span> Admin
            </h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <nav className="p-4 border-t border-slate-200 bg-white absolute w-full shadow-lg">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavItem key={link.to} {...link} isMobile={true} />
              ))}
            </ul>
          </nav>
        )}
      </header>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white text-slate-700 p-4
                 flex flex-col z-40 transition-all duration-300 ease-in-out
                 shadow-[0_0_25px_-5px_rgba(0,0,0,0.1)] border-r border-slate-200
                 ${isOpen ? "w-64" : "w-20"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-8 -right-3 p-1.5 bg-white hover:bg-slate-100 rounded-full
                   text-slate-600 hover:text-blue-500 transition-all duration-300 shadow-md flex items-center justify-center
                   border border-slate-300 hover:border-blue-400 transform"
        aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
      >
        {isOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
      </button>

      <div className="flex items-center mb-8 mt-4 px-2 py-3">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow">
          <FiCompass className="text-white text-2xl" />
        </div>
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ${
            !isOpen ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          <h1 className="font-bold text-2xl text-slate-800">
            <span className="text-blue-700 font-bold">Viadca</span>
          </h1>
        </div>
      </div>

      <ul className="flex flex-col gap-1 flex-grow">
        {navLinks.map((link) => (
          <NavItem key={link.to} {...link} isOpen={isOpen} />
        ))}
      </ul>

      <div className="mt-auto"></div>
    </aside>
  );
};

export default AdminNav;
