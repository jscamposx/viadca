const Itinerary = ({ itinerario }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
      Itinerario del Viaje
    </h2>
    <ul className="space-y-4">
      {itinerario.map((item) => (
        <li key={item.id} className="flex items-start">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold mr-4">
            {item.dia}
          </div>
          <div className="flex-1">
            <p className="font-bold">Día {item.dia}</p>
            <p className="text-gray-600">{item.descripcion}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default Itinerary;
