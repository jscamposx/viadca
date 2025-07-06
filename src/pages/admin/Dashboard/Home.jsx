import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Bienvenido al Panel de Administrador
          </h1>
          <p className="text-md sm:text-lg text-gray-600">
            Gestiona todo el contenido de tu sitio desde un solo lugar.
          </p>
        </header>
        <nav className="flex justify-center mb-12">
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <Link
                to="/admin/paquetes"
                className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Gestionar Paquetes
              </Link>
            </li>
          </ul>
        </nav>

        <main className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center sm:text-left">
            Estadísticas Rápidas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  Paquetes Totales
                </h3>
                <p className="text-3xl font-bold text-gray-800">15</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2v1m0 0v1m-3.343-3.343A6 6 0 0112 6m-3.343 3.343a6 6 0 000 8.486m11.314-8.486a6 6 0 010 8.486M12 18a6 6 0 01-3.343-10.657"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  Ventas del Mes
                </h3>
                <p className="text-3xl font-bold text-gray-800">$1,250</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
