import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NewFlightPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [transporte, setTransporte] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.flights
        .getVueloById(id)
        .then((response) => {
          const { nombre, transporte, imagenes } = response.data;
          setNombre(nombre || "");
          setTransporte(transporte || "");
          if (imagenes && imagenes.length > 0) {
            const API_URL = import.meta.env.VITE_API_URL;
            setPreview(
              imagenes[0].url.startsWith("http")
                ? imagenes[0].url
                : `${API_URL}${imagenes[0].url}`,
            );
          }
        })
        .catch(() => setError("No se pudo cargar la información del vuelo."))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let imageUrl = null;

      if (imagen) {
        const base64String = await fileToBase64(imagen);

        const base64Data = base64String.split(",")[1];

        const uploadResponse = await api.images.uploadBase64Image(base64Data);
        imageUrl = uploadResponse.data.url;
      }

      const vueloPayload = {
        nombre,
        transporte,
      };

      if (imageUrl) {
        vueloPayload.imagenes = [{ url: imageUrl }];
      }

      if (isEditing) {
        await api.flights.updateVuelo(id, vueloPayload);
        alert("Vuelo actualizado con éxito.");
      } else {
        await api.flights.createVuelo(vueloPayload);
        alert("Vuelo creado con éxito.");
      }
      navigate("/admin/vuelos");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Error al guardar el vuelo: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Editar Vuelo" : "Crear Nuevo Vuelo"}
      </h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
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
            Nombre del Vuelo
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="transporte"
            className="block text-sm font-medium text-gray-700"
          >
            Transporte
          </label>
          <input
            type="text"
            id="transporte"
            value={transporte}
            onChange={(e) => setTransporte(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="imagen"
            className="block text-sm font-medium text-gray-700"
          >
            Imagen
          </label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Vista previa:</p>
            <img
              src={preview}
              alt="Vista previa"
              className="mt-2 h-40 w-auto rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/vuelos")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Regresar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300 transition-colors"
          >
            {loading
              ? "Guardando..."
              : isEditing
                ? "Actualizar Vuelo"
                : "Crear Vuelo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewFlightPage;
