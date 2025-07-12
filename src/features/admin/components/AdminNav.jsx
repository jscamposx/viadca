import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiChevronLeft,
  FiPackage,
  FiHome,
  FiSend,
  FiTrash2,
  FiBriefcase,
} from "react-icons/fi";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(true);

  const activeLinkStyle = {
    backgroundColor: "#2563EB",
    color: "white",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4
                 flex flex-col z-50 transition-all duration-300 ease-in-out
                 ${isOpen ? "w-64" : "w-20"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-9 p-1.5 bg-gray-700 hover:bg-blue-600 rounded-full
                   text-white transition-transform duration-300"
      >
        <FiChevronLeft className={`transform ${!isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Logo o Título */}
      <div className="flex items-center mb-10">
        <div className="bg-white p-2 rounded-lg">
          <FiBriefcase className="text-blue-600 text-2xl" />
        </div>
        <h1
          className={`font-bold text-2xl ml-3 overflow-hidden transition-opacity duration-200 ${!isOpen ? "opacity-0 w-0" : "opacity-100"}`}
        >
          Viadca
        </h1>
      </div>

      <ul className="flex flex-col gap-4">
        <NavItem
          to="/admin/paquetes"
          icon={<FiPackage size={20} />}
          label="Paquetes"
          isOpen={isOpen}
          activeStyle={activeLinkStyle}
        />
        <NavItem
          to="/admin/hoteles"
          icon={<FiHome size={20} />}
          label="Hoteles"
          isOpen={isOpen}
          activeStyle={activeLinkStyle}
        />
        <NavItem
          to="/admin/vuelos"
          icon={<FiSend size={20} />}
          label="Vuelos"
          isOpen={isOpen}
          activeStyle={activeLinkStyle}
        />
        <NavItem
          to="/admin/papelera"
          icon={<FiTrash2 size={20} />}
          label="Papelera"
          isOpen={isOpen}
          activeStyle={activeLinkStyle}
        />
      </ul>
    </aside>
  );
};

const NavItem = ({ to, end = false, icon, label, isOpen, activeStyle }) => (
  <li>
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
      className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
      title={!isOpen ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={`ml-4 font-semibold overflow-hidden transition-all duration-200
                   ${!isOpen ? "w-0 opacity-0" : "w-full opacity-100"}`}
      >
        {label}
      </span>
    </NavLink>
  </li>
);

export default AdminNav;
