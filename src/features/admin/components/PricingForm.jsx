import React, { useState } from 'react';
import { FiDollarSign, FiTag, FiX } from 'react-icons/fi';

const PricingForm = ({ formData, onFormChange }) => {
  const [showDiscount, setShowDiscount] = useState(!!formData.descuento);

  const formatNumber = (value) => {
    if (!value) return "";
    const numberValue = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(numberValue) ? "" : numberValue.toLocaleString("es-MX");
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      onFormChange({ target: { name, value: rawValue } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Total *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              name="precio_total"
              value={formatNumber(formData.precio_total)}
              onChange={handleNumericChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 4,800"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anticipo
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              name="anticipo"
              value={formatNumber(formData.anticipo)}
              onChange={handleNumericChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 1,000"
            />
          </div>
        </div>
        
        <div>
          {!showDiscount ? (
            <div className="flex flex-col justify-end h-full">
              <button
                type="button"
                onClick={() => setShowDiscount(true)}
                className="flex items-center justify-center w-full py-3 px-4 border border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-green-600"
              >
                <FiTag className="mr-2" /> Agregar descuento
              </button>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio con Descuento
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiDollarSign />
                </span>
                <input
                  type="text"
                  name="descuento"
                  value={formatNumber(formData.descuento)}
                  onChange={handleNumericChange}
                  className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 300"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowDiscount(false)}
                className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingForm;
