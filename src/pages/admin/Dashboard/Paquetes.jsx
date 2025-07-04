import React from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import { useFetch } from '../../../hooks/useFetch';

const AdminPaquetes = () => {
  const { data: paquetes, loading, error } = useFetch(api.packages.getPaquetes);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando paquetes...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestionar Paquetes</h1>
          <Link
            to="/admin/paquetes/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            + Agregar Paquete
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre del Paquete</th>
                  <th scope="col" className="px-6 py-3">URL del Paquete</th>
                  <th scope="col" className="px-6 py-3">Duración</th>
                  <th scope="col" className="px-6 py-3">Precio Base</th>
                  <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
      
                {paquetes && paquetes.map((paquete) => (
                  <tr key={paquete.id_paquete} className="bg-white border-b hover:bg-gray-50"> 
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {paquete.nombre_paquete}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {`/paquetes/${paquete.url}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {paquete.duracion} días
                    </td>
                    <td className="px-6 py-4">
                      {parseFloat(paquete.precio_base).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/paquetes/editar/${paquete.id_paquete}`}
                        className="font-medium text-blue-600 hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        className="font-medium text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPaquetes;