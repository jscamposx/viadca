const ItineraryEditor = ({
  itinerario,
  onItinerarioChange,
  onAddItinerario,
  onRemoveItinerario,
}) => (
  <div className="space-y-4">
    <div className="flex justify-end items-center">
    
      <button
        type="button"
        onClick={onAddItinerario}
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Añadir Día
      </button>
    </div>

    <div className="space-y-3">
      {itinerario.map((item, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Día:</span>
              <input
                type="number"
                name="dia"
                min="1"
                value={item.dia}
                onChange={(e) => onItinerarioChange(index, e)}
                className="p-2 border border-gray-300 rounded-md w-16 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={item.descripcion}
                onChange={(e) => onItinerarioChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Actividades y detalles del día ${item.dia}`}
                rows="3"
                required
              />
            </div>

            <div className="flex items-end sm:items-center justify-end">
              <button
                type="button"
                onClick={() => onRemoveItinerario(index)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ItineraryEditor;
