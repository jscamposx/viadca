import React from "react";
import { FiUsers } from "react-icons/fi";
import { useMayoristas } from "../hooks/useMayoristas";

const MayoristasForm = ({ formData, onFormChange }) => {
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();

  const handleMayoristaChange = (mayoristaId) => {
    const currentIds = formData.mayoristasIds || [];
    let newIds;

    if (currentIds.includes(mayoristaId)) {
      newIds = currentIds.filter((id) => id !== mayoristaId);
    } else {
      newIds = [...currentIds, mayoristaId];
    }

    onFormChange({ target: { name: "mayoristasIds", value: newIds } });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FiUsers className="mx-auto h-12 w-12 text-indigo-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Mayoristas Asociados
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona los mayoristas que podrán vender este paquete
        </p>
      </div>

      {mayoristasLoading ? (
        <div className="text-center text-gray-500">Cargando mayoristas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mayoristas.map((mayorista) => (
            <label
              key={mayorista.id}
              className="relative flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
            >
              <input
                type="checkbox"
                checked={(formData.mayoristasIds || []).includes(mayorista.id)}
                onChange={() => handleMayoristaChange(mayorista.id)}
                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {mayorista.nombre}
                </div>
                {mayorista.email && (
                  <div className="text-sm text-gray-500">{mayorista.email}</div>
                )}
              </div>
              {(formData.mayoristasIds || []).includes(mayorista.id) && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      )}

      {(formData.mayoristasIds || []).length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-700">
            <strong>{(formData.mayoristasIds || []).length}</strong>{" "}
            mayorista(s) seleccionado(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default MayoristasForm;
