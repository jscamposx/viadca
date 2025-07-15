import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { paquetes, loading, error } = useAllPackages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaquetes, setFilteredPaquetes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "nombre", direction: "asc" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filtrado y ordenamiento
  useEffect(() => {
    let result = [...(paquetes || [])];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre_paquete.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term) ||
        p.precio_base.toString().includes(term)
      );
    }
    
    // Aplicar ordenamiento
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPaquetes(result);
  }, [paquetes, searchTerm, sortConfig]);

  // Función para solicitar ordenamiento
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = (url) => {
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  // Manejar eliminación de paquete
  const handleDelete = (id) => {
    // Lógica para eliminar el paquete
    console.log("Eliminar paquete con ID:", id);
    setDeleteConfirm(null);
    // Aquí iría la llamada a la API para eliminar el paquete
  };

  // Estado de carga mejorado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">Cargando paquetes...</p>
      </div>
    );
  }

  // Estado de error mejorado
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-6 rounded-xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error al cargar los paquetes</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Gestión de Paquetes</h1>
            <p className="text-gray-600 mt-2">
              {paquetes?.length || 0} {paquetes?.length === 1 ? "paquete disponible" : "paquetes disponibles"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar paquetes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <Link
              to="/admin/paquetes/nuevo"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Paquete
            </Link>
          </div>
        </div>
        
        {/* Controles de ordenamiento */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-700 font-medium">Ordenar por:</span>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition ${sortConfig.key === 'nombre' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => requestSort('nombre')}
            >
              Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition ${sortConfig.key === 'precio_base' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => requestSort('precio_base')}
            >
              Precio {sortConfig.key === 'precio_base' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition ${sortConfig.key === 'duracion' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => requestSort('duracion')}
            >
              Duración {sortConfig.key === 'duracion' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Grid de paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaquetes.length > 0 ? (
            filteredPaquetes.map((paquete) => {
              const imagenPrincipal = paquete.imagenes?.length > 0
                ? paquete.imagenes[0]
                : null;

              return (
                <div 
                  key={paquete.id} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-56 relative overflow-hidden">
                    {imagenPrincipal ? (
                      <img
                        src={getImageUrl(imagenPrincipal.url)}
                        alt={paquete.nombre_paquete}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Sin imagen disponible</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
                          {paquete.nombre_paquete}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-3">
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{paquete.duracion} días</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                        Activo
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {paquete.descripcion || "No hay descripción disponible."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Vista previa
                      </Link>
                      
                      <Link
                        to={`/admin/paquetes/editar/${paquete.url}`}
                        className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Link>
                      
                      <button 
                        onClick={() => setDeleteConfirm(paquete.id)}
                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron paquetes</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? `No hay resultados para "${searchTerm}".` : 'Parece que no hay paquetes disponibles.'}
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition"
                >
                  {searchTerm ? 'Limpiar búsqueda' : 'Crear nuevo paquete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">¿Eliminar paquete?</h3>
              <p className="text-gray-500 mt-2">
                Esta acción eliminará permanentemente el paquete. ¿Estás seguro de continuar?
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaquetes;