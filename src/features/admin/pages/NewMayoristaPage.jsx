import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMayoristas } from "../hooks/useMayoristas";
import { useNotification } from "./AdminLayout";
import {
  FiSave,
  FiArrowLeft,
  FiUsers,
  FiType,
  FiTag,
  FiAlertCircle,
} from "react-icons/fi";

const NewMayoristaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { createMayorista, updateMayorista, getMayoristaById } =
    useMayoristas();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_producto: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);

  const tiposProducto = [
    "Circuito",
    "Paquete",
    "Hotel",
    "Vuelo",
    "Traslado",
    "Excursión",
    "Combinado",
    "Crucero",
  ];

  useEffect(() => {
    if (isEditing && id) {
      const loadMayorista = async () => {
        try {
          setIsLoadingData(true);
          const mayorista = await getMayoristaById(id);
          setFormData({
            nombre: mayorista.nombre || "",
            tipo_producto: mayorista.tipo_producto || "",
          });
        } catch (error) {
          console.error("Error al cargar mayorista:", error);
          addNotification("Error al cargar los datos del mayorista", "error");
          navigate("/admin/mayoristas");
        } finally {
          setIsLoadingData(false);
        }
      };
      loadMayorista();
    }
  }, [isEditing, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.tipo_producto) {
      newErrors.tipo_producto = "El tipo de producto es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const mayoristData = {
        nombre: formData.nombre.trim(),
        tipo_producto: formData.tipo_producto,
      };

      if (isEditing) {
        await updateMayorista(id, mayoristData);
        addNotification("Mayorista actualizado correctamente", "success");
      } else {
        await createMayorista(mayoristData);
        addNotification("Mayorista creado correctamente", "success");
      }

      navigate("/admin/mayoristas");
    } catch (error) {
      console.error("Error al guardar mayorista:", error);

      if (error.response?.data?.message) {
        addNotification(error.response.data.message, "error");
      } else {
        addNotification(
          `Error al ${isEditing ? "actualizar" : "crear"} el mayorista`,
          "error",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/mayoristas");
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft />
            Volver a Mayoristas
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FiUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Mayorista" : "Nuevo Mayorista"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Modifica los datos del mayorista"
                : "Completa la información para crear un nuevo mayorista"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FiType className="text-blue-600" />
                Información Básica
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Datos principales del mayorista
              </p>
            </div>

            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre del Mayorista *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Agencia de Viajes Central"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FiAlertCircle size={14} />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tipo_producto"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de Producto *
              </label>
              <select
                id="tipo_producto"
                name="tipo_producto"
                value={formData.tipo_producto}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tipo_producto ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona un tipo de producto</option>
                {tiposProducto.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              {errors.tipo_producto && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FiAlertCircle size={14} />
                  {errors.tipo_producto}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Información importante
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  La clave del mayorista se generará automáticamente una vez
                  guardado el registro. Esta clave será única y se utilizará
                  para identificar al mayorista en el sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? "Actualizando..." : "Guardando..."}
                </>
              ) : (
                <>
                  <FiSave />
                  {isEditing ? "Actualizar Mayorista" : "Crear Mayorista"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMayoristaPage;
