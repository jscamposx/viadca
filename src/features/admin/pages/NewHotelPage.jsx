import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";

const NewHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: "",
    estrellas: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.hotels
        .getHotelById(id)
        .then((response) => {
          setFormData({
            nombre: response.data.nombre,
            estrellas: response.data.estrellas,
          });
        })
        .catch(() => setError("No se pudo cargar la información del hotel."))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await api.hotels.updateHotel(id, formData);
        alert("Hotel actualizado con éxito.");
      } else {
        await api.hotels.createHotel(formData);
        alert("Hotel creado con éxito.");
      }
      navigate("/admin/hoteles");
    } catch (err) {
      setError("Error al guardar el hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Editar Hotel" : "Crear Nuevo Hotel"}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Hotel
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="estrellas"
            className="block text-sm font-medium text-gray-700"
          >
            Estrellas
          </label>
          <input
            type="number"
            id="estrellas"
            name="estrellas"
            min="1"
            max="5"
            value={formData.estrellas}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300"
        >
          {loading ? "Guardando..." : "Guardar Hotel"}
        </button>
      </form>
    </div>
  );
};

export default NewHotelPage;
