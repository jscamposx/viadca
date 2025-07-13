import { FiClock, FiSend, FiDollarSign } from 'react-icons/fi';

const PackageInfo = ({ duracion, id_vuelo, precio_base }) => (
  <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles del Paquete</h3>
    <ul className="space-y-4">
      <li className="flex items-center">
        <FiClock className="w-6 h-6 text-blue-500 mr-3" />
        <div>
          <p className="font-semibold text-gray-700">Duración</p>
          <p className="text-gray-600">{duracion} días</p>
        </div>
      </li>
      <li className="flex items-center">
        <FiSend className="w-6 h-6 text-green-500 mr-3" />
        <div>
          <p className="font-semibold text-gray-700">Vuelo</p>
          <p className="text-gray-600">{id_vuelo}</p>
        </div>
      </li>
      <li className="flex items-center">
        <FiDollarSign className="w-6 h-6 text-yellow-500 mr-3" />
        <div>
          <p className="font-semibold text-gray-700">Precio Base</p>
          <p className="text-gray-600">${parseFloat(precio_base).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        </div>
      </li>
    </ul>
  </div>
);

export default PackageInfo;