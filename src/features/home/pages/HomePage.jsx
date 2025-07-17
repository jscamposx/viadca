import { Link } from "react-router-dom";
import { FiChevronRight, FiLock, FiGlobe, FiStar } from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white flex flex-col overflow-hidden">

      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#38bdf8' : '#818cf8',
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Efecto de gradiente animado */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 left-20 w-72 h-72 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      </div>
      
      <header className="p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Viadca Viajes</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-300 transition-colors">Destinos</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Ofertas</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Experiencias</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Contacto</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center z-10 px-4">
        <div className="text-center p-8 backdrop-blur-sm bg-gray-900/50 rounded-3xl shadow-2xl max-w-3xl w-full border border-gray-700/50">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/50 mb-6">
            <FiStar className="mr-2 text-blue-300" />
            <span className="text-blue-300 font-medium">Descubre el mundo</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400">
              Tu próxima aventura
            </span> <br />
            <span className="text-white">comienza aquí</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Explora destinos exclusivos alrededor del mundo o administra los paquetes de viaje si eres administrador.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/"
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <span>Explorar destinos</span>
              <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/admin"
              className="group relative w-full sm:w-auto bg-transparent border border-gray-600 hover:border-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <FiLock className="mr-2 text-gray-300 group-hover:text-blue-300" />
              <span>Acceso Admin</span>
            </Link>
          </div>
        </div>
      </main>
      
      <div className="z-10 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Destinos", value: "120+" },
            { title: "Clientes", value: "15K+" },
            { title: "Países", value: "45" },
            { title: "Experiencias", value: "200+" },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 text-center"
            >
              <div className="text-3xl font-bold text-blue-300">{stat.value}</div>
              <div className="text-gray-400">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center p-6 z-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">&copy; 2025 Viadca Viajes. Todos los derechos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-300 transition-colors">Términos</a>
            <a href="#" className="text-gray-500 hover:text-blue-300 transition-colors">Privacidad</a>
            <a href="#" className="text-gray-500 hover:text-blue-300 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;