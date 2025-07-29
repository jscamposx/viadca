import React from 'react';

const BasicInfoForm = ({ formData, onFormChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título del Paquete */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del Paquete *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Maravillas de Kioto, Japón"
            required
          />
        </div>

        {/* Fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            name="fecha_inicio"
            value={formData.fecha_inicio || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin *
          </label>
          <input
            type="date"
            name="fecha_fin"
            value={formData.fecha_fin || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Descripciones */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué Incluye?
          </label>
          <textarea
            name="incluye"
            value={formData.incluye || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detalla qué incluye el paquete: vuelos, hospedaje, tours, comidas, etc..."
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué NO Incluye?
          </label>
          <textarea
            name="no_incluye"
            value={formData.no_incluye || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detalla qué NO incluye el paquete: seguros, comidas no especificadas, etc..."
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requisitos
          </label>
          <textarea
            name="requisitos"
            value={formData.requisitos || ""}
            onChange={onFormChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Pasaporte con vigencia mínima, visas requeridas, vacunas, etc..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
