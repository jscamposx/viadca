import { FiCalendar } from "react-icons/fi";

const Itinerary = ({ itinerario }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">
      Itinerario del Viaje
    </h2>
    <div className="relative border-l-2 border-blue-500 ml-4 pl-8">
      {itinerario.map((item, index) => (
        <div key={item.id} className="mb-8 last:mb-0">
          <div className="absolute -left-5 -top-1 flex items-center justify-center bg-blue-500 rounded-full w-10 h-10 text-white font-bold">
            {item.dia}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-bold text-lg text-gray-700 mb-1 flex items-center">
              <FiCalendar className="mr-2" /> Día {item.dia}
            </h4>
            <p className="text-gray-600 leading-relaxed">{item.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Itinerary;
