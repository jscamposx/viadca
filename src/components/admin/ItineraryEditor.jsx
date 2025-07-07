// src/components/admin/ItineraryEditor.jsx

const ItineraryEditor = ({
  itinerario,
  onItinerarioChange,
  onAddItinerario,
  onRemoveItinerario,
}) => (
  <div>
    <h2 className="text-xl font-semibold">Itinerario</h2>
    {itinerario.map((item, index) => (
      <div key={index} className="flex items-center gap-4 mt-2">
        <input
          type="number"
          name="dia"
          value={item.dia}
          onChange={(e) => onItinerarioChange(index, e)}
          className="p-2 border rounded w-20"
          required
        />
        <input
          type="text"
          name="descripcion"
          value={item.descripcion}
          onChange={(e) => onItinerarioChange(index, e)}
          className="p-2 border rounded flex-grow"
          placeholder={`Descripción del día ${item.dia}`}
          required
        />
        <button
          type="button"
          onClick={() => onRemoveItinerario(index)}
          className="bg-red-500 text-white p-2 rounded"
        >
          Eliminar
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={onAddItinerario}
      className="bg-blue-500 text-white p-2 rounded mt-4"
    >
      Añadir Día
    </button>
  </div>
);

export default ItineraryEditor;
