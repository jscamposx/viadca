import React from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../../hooks/useAllPackages"; // <-- Cambio aquí

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { paquetes, loading, error } = useAllPackages(); // <-- Y aquí

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando paquetes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestionar Paquetes
          </h1>
          <Link
            to="/admin/paquetes/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            + Agregar Paquete
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paquetes &&
            paquetes.map((paquete) => {
              const imagenPrincipal =
                paquete.imagenes && paquete.imagenes.length > 0
                  ? paquete.imagenes
                      .slice()
                      .sort((a, b) => a.orden - b.orden)[0]
                  : null;

              return (
                <div
                  key={paquete.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {imagenPrincipal ? (
                      <img
                        src={`${API_URL}${imagenPrincipal.url}`}
                        alt={paquete.nombre_paquete}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {paquete.nombre_paquete}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-1">
                      <span className="mr-2">⏱️</span>
                      <span>{paquete.duracion} días</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-4">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </div>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300"
                      >
                        View
                      </Link>
                      <div className="space-x-2">
                        <Link
                          to={`/admin/paquetes/editar/${paquete.id}`}
                          className="bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition duration-300"
                        >
                          Editar
                        </Link>
                        <button className="bg-red-500 hover:bg-red-800 text-white py-2 px-4 rounded-lg transition duration-300">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdminPaquetes;
