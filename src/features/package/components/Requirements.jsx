import { FiCheckSquare } from "react-icons/fi";

const Requirements = ({ requisitos }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">
      Requisitos para el Viaje
    </h2>
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
      <div className="flex items-start">
        <FiCheckSquare className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
        <p className="text-gray-700 leading-relaxed">{requisitos}</p>
      </div>
    </div>
  </div>
);

export default Requirements;
