const Loading = () => (

  <div className="flex flex-col items-center justify-center p-10 h-screen w-full">
    <div className="relative w-12 h-12 mb-4">
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-gray-600">Cargando paquete...</p>
  </div>
);

export default Loading;