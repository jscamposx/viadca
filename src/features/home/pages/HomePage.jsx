import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiLock,
  FiGlobe,
  FiStar,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-50 to-transparent"></div>
      </div>

      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwSDB2NjBoNjBWMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmMWYxZjEiLz48L2c+PC9zdmc+')]"></div>

      <header className="p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Viadca Viajes
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Destinos
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Ofertas
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Experiencias
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Contacto
            </a>
          </nav>

          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5">
            Iniciar sesión
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center z-10 px-4 py-12">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-4xl w-full border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full opacity-70"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full opacity-70"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <FiStar className="mr-2 text-blue-600" />
              <span className="text-blue-600 font-medium">
                Descubre el mundo
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
              Su próxima aventura <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                comienza aquí
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Explora destinos exclusivos alrededor del mundo o administra los
              paquetes de viaje si eres administrador.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <Link
                to="/"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex items-center justify-center"
              >
                <span>Explorar destinos</span>
                <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin"
                className="group relative w-full sm:w-auto bg-white border border-gray-300 hover:border-blue-500 text-gray-800 font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex items-center justify-center"
              >
                <FiLock className="mr-2 text-gray-600 group-hover:text-blue-600" />
                <span>Acceso Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <div className="z-10 py-8 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <FiSearch className="text-2xl text-blue-600" />,
                title: "Buscar destinos",
                desc: "Encuentra tu destino ideal entre cientos de opciones",
              },
              {
                icon: <FiMapPin className="text-2xl text-indigo-600" />,
                title: "Explorar mapas",
                desc: "Descubre nuevos lugares con nuestro mapa interactivo",
              },
              {
                icon: <FiCalendar className="text-2xl text-purple-600" />,
                title: "Reservar viajes",
                desc: "Planifica tus fechas y reserva con facilidad",
              },

              {
                icon: <FiPhone className="text-2xl text-cyan-600" />,
                title: "Soporte 24/7",
                desc: "Asistencia continúa durante todo tu viaje",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-5 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="z-10 py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros números hablan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de viajeros han confiado en nosotros para sus aventuras
              alrededor del mundo
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Destinos",
                value: "120+",
                color: "from-blue-600 to-indigo-600",
              },
              {
                title: "Clientes",
                value: "15K+",
                color: "from-indigo-600 to-purple-600",
              },

              {
                title: "Países",
                value: "45",
                color: "from-purple-600 to-fuchsia-600",
              },
              {
                title: "Experiencias",
                value: "200+",
                color: "from-cyan-600 to-blue-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`text-4xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center p-8 z-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 ml-3">
              Viadca Viajes
            </h2>
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Tu compañero de confianza para descubrir el mundo. Ofrecemos
            experiencias únicas y personalizadas para cada viajero.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Destinos
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Ofertas
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Experiencias
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Contacto
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Privacidad
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            &copy; 2025 Viadca Viajes. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
