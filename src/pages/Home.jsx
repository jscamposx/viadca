import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">

      <header className="p-4 shadow-lg bg-gray-900/50">
        <h1 className="text-2xl font-bold">Viadca Viajes</h1>
      </header>
      

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/70 rounded-2xl shadow-2xl max-w-2xl mx-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Tu Próxima Aventura Comienza Aquí
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Explora nuestros destinos exclusivos o administra los paquetes de viaje si eres un administrador.
          </p>
          

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/paquetes/9ElV9" // URL de ejemplo de uno de tus paquetes (recuerda cambiarlo por el de tu bd)
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Ver Paquetes de Viaje
            </Link>
            <Link 
              to="/admin" 
              className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Acceso Admin
            </Link>
          </div>
        </div>
      </main>

 
      <footer className="text-center p-4 text-gray-500">
        <p>&copy; 2025 Viadca. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;