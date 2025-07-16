import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const AdminFlightsPage = () => {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await api.flights.getVuelos();
        setVuelos(response.data);
      } catch (err) {
        setError("No se pudieron cargar los vuelos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVuelos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este vuelo?")) {
      try {
        await api.flights.deleteVuelo(id);
        setVuelos(vuelos.filter((vuelo) => vuelo.id !== id));
      } catch (err) {
        alert("Error al eliminar el vuelo.");
        console.error(err);
      }
    }
  };

  const getImageUrl = (vuelo) => {
    if (vuelo.imagenes && vuelo.imagenes.length > 0) {
      const url = vuelo.imagenes[0].url;
      if (url.startsWith("http")) return url;
      return `${API_URL}${url}`;
    }

    return "https://via.placeholder.com/100x50";
  };

  if (loading) return <p>Cargando vuelos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Vuelos</h1>
        <Link
          to="/admin/vuelos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Agregar Vuelo
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre del Vuelo
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Transporte
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {vuelos.map((vuelo) => (
              <tr key={vuelo.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img
                    src={getImageUrl(vuelo)}
                    alt={vuelo.nombre}
                    className="w-24 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {vuelo.nombre}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {vuelo.transporte}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/vuelos/editar/${vuelo.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(vuelo.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFlightsPage;
