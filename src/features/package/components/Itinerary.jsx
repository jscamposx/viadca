import { FiCalendar, FiClock, FiMap } from "react-icons/fi";

const Itinerary = ({ itinerario }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
      Itinerario del Viaje
    </h2>
    <div className="relative border-l-2 border-blue-500 ml-4 pl-8 space-y-6">
      {itinerario.map((item, index) => (
        <div key={item.id} className="group relative">
          <div className="absolute -left-5 -top-1 flex items-center justify-center bg-blue-500 rounded-full w-10 h-10 text-white font-bold z-10 transition-all group-hover:scale-110">
            {item.dia}
          </div>
          <div className="bg-white p-5 rounded-lg shadow-xs border border-gray-100 transition-all hover:shadow-sm hover:border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FiCalendar className="text-blue-500" size={18} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-700 mb-1">
                  Día {item.dia}: {item.titulo}
                </h4>
                {item.horario && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiClock className="mr-1" size={14} />
                    {item.horario}
                  </div>
                )}
                <p className="text-gray-600 leading-relaxed">{item.descripcion}</p>
                {item.lugares && (
                  <div className="mt-3 flex items-center text-sm text-blue-600">
                    <FiMap className="mr-1" size={14} />
                    {item.lugares}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Itinerary;