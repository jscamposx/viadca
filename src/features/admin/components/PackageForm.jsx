import { useState, useEffect } from "react";
import { FiTag, FiX, FiPercent, FiDollarSign } from "react-icons/fi";

const PackageForm = ({ formData, onFormChange }) => {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  
  // Calcular porcentaje de descuento
  useEffect(() => {
    if (formData.precio_base && formData.descuento) {
      const base = parseFloat(formData.precio_base);
      const discount = parseFloat(formData.descuento);
      
      if (!isNaN(base) && !isNaN(discount) && base > 0 && discount < base) {
        const percentage = Math.round(((base - discount) / base) * 100);
        setDiscountPercentage(percentage);
      } else {
        setDiscountPercentage(0);
      }
    } else {
      setDiscountPercentage(0);
    }
  }, [formData.precio_base, formData.descuento]);

  const formatNumber = (value) => {
    if (!value) return "";

    const numberValue = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(numberValue)) return "";

    return numberValue.toLocaleString("es-MX");
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");

    if (!isNaN(rawValue)) {
      onFormChange({ target: { name, value: rawValue } });
    } else if (value === "") {
      onFormChange({ target: { name, value: "" } });
    }
  };

  const handleAddDiscount = () => {
    setShowDiscount(true);
    // Sugerir un descuento inicial del 10%
    if (formData.precio_base && !formData.descuento) {
      const base = parseFloat(formData.precio_base);
      if (!isNaN(base)) {
        const suggestedDiscount = Math.round(base * 0.9).toString();
        onFormChange({ target: { name: "descuento", value: suggestedDiscount } });
      }
    }
  };

  const handleRemoveDiscount = () => {
    setShowDiscount(false);
    onFormChange({ target: { name: "descuento", value: "" } });
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="origen" value={formData.origen || ""} />
      <input
        type="hidden"
        name="origen_lat"
        value={formData.origen_lat || ""}
      />
      <input
        type="hidden"
        name="origen_lng"
        value={formData.origen_lng || ""}
      />
      <input type="hidden" name="destino" value={formData.destino || ""} />
      <input
        type="hidden"
        name="destino_lat"
        value={formData.destino_lat || ""}
      />
      <input
        type="hidden"
        name="destino_lng"
        value={formData.destino_lng || ""}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Paquete *
            </label>
            <input
              type="text"
              name="nombre_paquete"
              value={formData.nombre_paquete || ""}
              onChange={onFormChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Aventura en las Pirámides"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración (días) *
            </label>
            <input
              type="number"
              name="duracion"
              min="1"
              value={formData.duracion || ""}
              onChange={onFormChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. 7"
              required
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Base *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiDollarSign className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="precio_base"
                  value={formatNumber(formData.precio_base)}
                  onChange={handlePriceChange}
                  className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej. 1,500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              {!showDiscount && !formData.descuento ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <button
                    type="button"
                    onClick={handleAddDiscount}
                    className="flex items-center justify-center w-full py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <FiTag className="w-5 h-5 text-gray-400 mr-2 group-hover:text-blue-500" />
                    <span className="font-medium text-gray-600 group-hover:text-blue-500">
                      Agregar descuento
                    </span>
                  </button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Añade un precio especial por tiempo limitado
                  </p>
                </div>
              ) : (
                <div className="relative bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1 items-center">
                        <FiTag className="w-4 h-4 mr-2" />
                        Precio con descuento
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="p-1 rounded-full hover:bg-blue-200 transition-colors text-blue-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                      <FiDollarSign className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="descuento"
                      value={formatNumber(formData.descuento)}
                      onChange={handlePriceChange}
                      className="w-full pl-8 p-3 border border-blue-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej. 1,200"
                    />
                  </div>
                  
                  {discountPercentage > 0 ? (
                    <div className="mt-2 flex items-center justify-end">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        <FiPercent className="mr-1" />
                        {discountPercentage}% de descuento
                      </span>
                    </div>
                  ) : (
                    formData.precio_base && formData.descuento && (
                      <p className="mt-2 text-xs text-red-500 text-right">
                        El descuento debe ser menor que el precio base
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h3>
        <div>
          <textarea
            name="requisitos"
            value={formData.requisitos || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej. Pasaporte vigente, visa (si aplica), etc."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PackageForm;